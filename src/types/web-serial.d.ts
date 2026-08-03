// Declaraciones mínimas para la Web Serial API.
// TypeScript aún no la incluye en sus tipos estándar de DOM, así que se
// declaran aquí solo las piezas que usa este proyecto (src/lib/serialScale.ts).
// Referencia: https://developer.mozilla.org/en-US/docs/Web/API/Web_Serial_API

interface SerialPort {
  open(options: { baudRate: number }): Promise<void>;
  close(): Promise<void>;
  readonly readable: ReadableStream<Uint8Array> | null;
  readonly writable: WritableStream<Uint8Array> | null;
}

interface Serial extends EventTarget {
  requestPort(): Promise<SerialPort>;
  getPorts(): Promise<SerialPort[]>;
}

interface Navigator {
  readonly serial: Serial;
}
