// Conexión directa a una báscula/gramera física por USB o puerto serial,
// usando la Web Serial API (soportada en Chrome y Edge de escritorio; no
// disponible en Safari, Firefox ni navegadores móviles).
//
// IMPORTANTE: todavía no sabemos la marca/modelo exacto de báscula que se va
// a comprar. El patrón de texto que reconoce `parseWeightLine` es genérico
// (cubre formatos comunes tipo "+0.345kg", "ST,GS,+000.345kg", "345 g").
// Cuando se tenga el equipo en mano, hay que revisar su manual (protocolo de
// comunicación serial) y ajustar esa función si el formato real es distinto.
// Todo lo demás (apertura de conexión, lectura en tiempo real, desconexión)
// no debería necesitar cambios.

export function isWebSerialSupported(): boolean {
  return typeof navigator !== 'undefined' && 'serial' in navigator;
}

export interface ScaleConnection {
  disconnect: () => Promise<void>;
}

interface ConnectOptions {
  /** Velocidad del puerto serial. 9600 es el valor más común en básculas de tienda. */
  baudRate?: number;
  onWeight: (kg: number) => void;
  onError?: (message: string) => void;
  onDisconnect?: () => void;
}

/**
 * Intenta extraer un valor de peso en kg de una línea de texto cruda enviada
 * por la báscula. Devuelve null si la línea no contiene un peso reconocible.
 */
export function parseWeightLine(line: string): number | null {
  const match = line.match(/([+-]?\d+(?:\.\d+)?)\s*(kg|g)\b/i);
  if (!match) return null;

  const value = parseFloat(match[1]);
  if (Number.isNaN(value)) return null;

  const unit = match[2].toLowerCase();
  return unit === 'g' ? value / 1000 : value;
}

/**
 * Pide al usuario elegir el puerto/dispositivo, abre la conexión y empieza a
 * leer el peso en tiempo real, llamando a `onWeight` (en kg) cada vez que
 * llega una lectura nueva. Devuelve un objeto con `disconnect()` para cerrar
 * la conexión de forma limpia (por ejemplo, al cerrar el modal de gramera).
 */
export async function connectToScale(options: ConnectOptions): Promise<ScaleConnection> {
  const { baudRate = 9600, onWeight, onError, onDisconnect } = options;

  if (!isWebSerialSupported()) {
    throw new Error(
      'Este navegador no soporta conexión directa a báscula (Web Serial API). ' +
        'Usa Chrome o Edge en un computador, o continúa con el peso manual.'
    );
  }

  const port = await navigator.serial.requestPort();
  await port.open({ baudRate });

  if (!port.readable) {
    throw new Error('No se pudo abrir el flujo de lectura del puerto serial.');
  }

  const textDecoder = new TextDecoderStream();
  const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
  const reader = textDecoder.readable.getReader();

  let buffer = '';
  let cancelled = false;

  (async () => {
    try {
      while (!cancelled) {
        const { value, done } = await reader.read();
        if (done) break;
        if (value) {
          buffer += value;
          const lines = buffer.split(/\r?\n/);
          buffer = lines.pop() ?? '';
          for (const line of lines) {
            const kg = parseWeightLine(line);
            if (kg !== null) {
              onWeight(kg);
            }
          }
        }
      }
    } catch (err) {
      if (!cancelled) {
        onError?.(err instanceof Error ? err.message : 'Error leyendo la báscula.');
      }
    } finally {
      onDisconnect?.();
    }
  })();

  const disconnect = async () => {
    cancelled = true;
    try {
      await reader.cancel();
      await readableStreamClosed.catch(() => undefined);
      await port.close();
    } catch {
      // Silenciar errores al cerrar: el puerto puede haberse desconectado físicamente.
    }
  };

  return { disconnect };
}
