import { Sale } from '../types';

/**
 * "Enchufe" para facturación electrónica DIAN — mismo patrón que
 * serialScale.ts para la gramera: se deja lista toda la interfaz/flujo
 * (botón, estado de carga, éxito, error) sin depender todavía de un
 * proveedor autorizado por la DIAN concreto (Factus, Alegra, Siigo, etc.).
 *
 * Cuando se elija el proveedor, lo único que hay que hacer es reemplazar el
 * cuerpo de `issueElectronicInvoice` por la llamada real a su API (mandar
 * los datos de `sale`, guardar sus credenciales en variables de entorno
 * como se hizo con Supabase) — el resto de la app (el botón en el ticket,
 * el manejo de estados) no necesita cambiar.
 */

export interface ElectronicInvoiceResult {
  success: boolean;
  /** CUFE = Código Único de Facturación Electrónica que asigna la DIAN. */
  cufe?: string;
  invoiceUrl?: string;
  error?: string;
}

export async function issueElectronicInvoice(sale: Sale): Promise<ElectronicInvoiceResult> {
  // TODO: reemplazar por la llamada real al proveedor DIAN elegido, ej:
  // const res = await fetch('https://api.<proveedor>.com/v1/invoices', { ... });
  await new Promise((resolve) => setTimeout(resolve, 900));

  return {
    success: true,
    cufe: `SIMULADO-${sale.receiptNumber}-${Date.now().toString().slice(-6)}`,
    invoiceUrl: undefined
  };
}
