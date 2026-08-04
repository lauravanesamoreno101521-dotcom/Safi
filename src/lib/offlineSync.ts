import { Sale } from '../types';

/**
 * Cola de ventas pendientes de sincronizar cuando se pierde la conexión a
 * internet. Se guarda en localStorage (no en memoria) a propósito: si se
 * cae el internet Y además se cierra o recarga la pestaña antes de que
 * vuelva la señal, la venta no se pierde y sigue apareciendo como
 * "pendiente de sincronizar" hasta que realmente se sincronice. Esto es
 * distinto de conectar la app a Supabase con datos reales (eso sigue en
 * pausa) — es solo una red de seguridad local para no perder trazabilidad.
 */

const STORAGE_KEY = 'safi_pending_sync_sales';

export function getPendingSales(): Sale[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Sale[];
    // Las fechas vuelven como string desde JSON; se reconstruyen a Date.
    return parsed.map((s) => ({ ...s, timestamp: new Date(s.timestamp) }));
  } catch {
    return [];
  }
}

function savePendingSales(sales: Sale[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sales));
  } catch {
    // Si localStorage no está disponible (modo privado, etc.) simplemente
    // no se puede guardar la cola; la venta ya quedó igual en el historial
    // en memoria de la sesión actual.
  }
}

export function queueSaleForSync(sale: Sale): void {
  const pending = getPendingSales();
  pending.push(sale);
  savePendingSales(pending);
}

/**
 * TODO: cuando la app quede conectada de verdad a Supabase (con datos
 * reales), reemplazar el cuerpo por el insert real de cada venta pendiente,
 * por ejemplo: `await supabase.from('ventas').insert(pending)`. Por ahora
 * simula el envío exitoso y limpia la cola local, dejando el flujo
 * (detectar reconexión → sincronizar → avisar) completamente listo.
 */
export async function syncPendingSales(): Promise<number> {
  const pending = getPendingSales();
  if (pending.length === 0) return 0;
  await new Promise((resolve) => setTimeout(resolve, 800));
  savePendingSales([]);
  return pending.length;
}
