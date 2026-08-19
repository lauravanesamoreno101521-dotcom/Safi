import { Sale } from '../types';

/**
 * "Enlace" de WhatsApp para enviar la factura al cliente: usa el formato
 * público de WhatsApp Click-to-Chat (wa.me), que no requiere ninguna cuenta
 * de WhatsApp Business API ni backend propio. Abre WhatsApp (app o web) con
 * el número del cliente y el mensaje de la factura ya redactado, listo para
 * que quien esté en caja solo presione "Enviar".
 *
 * Limitación real a tener en cuenta: wa.me solo permite iniciar UNA
 * conversación 1 a 1 por clic (por eso sirve perfecto para enviar la
 * factura de cada venta). Para enviar alertas de descuentos/promociones de
 * forma masiva y automática a todos los clientes registrados sí se
 * necesitaría más adelante la API oficial de WhatsApp Business (Meta Cloud
 * API o un proveedor como Twilio/360dialog), que requiere verificación del
 * negocio y plantillas de mensaje aprobadas. Por ahora, para probar el
 * envío 1 a 1 de la factura, este enlace ya es 100% funcional.
 */

function sanitizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  // Si el número ya trae indicativo de país (Colombia = 57) se deja igual;
  // si es un celular colombiano de 10 dígitos sin indicativo, se le agrega.
  if (digits.startsWith('57') && digits.length > 10) return digits;
  if (digits.length === 10) return `57${digits}`;
  return digits;
}

const TICKET_WIDTH = 32;
const RULE = '-'.repeat(TICKET_WIDTH);

/** Alinea un monto a la derecha frente a una etiqueta, como en un ticket físico. */
function padRow(left: string, right: string, width = TICKET_WIDTH): string {
  const gap = Math.max(1, width - left.length - right.length);
  return left + ' '.repeat(gap) + right;
}

function money(n: number): string {
  return `$${n.toLocaleString('es-CO')}`;
}

/**
 * Arma el mensaje de WhatsApp con el mismo look de una factura/ticket real
 * (encabezado del negocio, ítems y totales alineados en columnas, método de
 * pago) en vez de una línea de texto corrida. WhatsApp no soporta HTML,
 * pero sí un bloque de texto monoespaciado (```) que mantiene la alineación
 * de columnas — con eso se logra el efecto visual de "recibo".
 */
export function buildInvoiceWhatsAppMessage(sale: Sale): string {
  const lines: string[] = [];

  // --- Encabezado del negocio ---
  lines.push('🧾 *SALSAMENTARÍA SAFI*');
  lines.push('NIT: 900.812.441-8 · Régimen Común');
  lines.push('Bucaramanga, Santander');
  lines.push('');
  lines.push(`_Ticket:_ *${sale.receiptNumber}*`);
  lines.push(`_Fecha:_ ${new Date(sale.timestamp).toLocaleString('es-CO')}`);
  if (sale.customer) {
    lines.push(`_Cliente:_ ${sale.customer.name}`);
  }
  lines.push('');

  // --- Cuerpo tipo ticket (monoespaciado para que los montos queden alineados) ---
  const body: string[] = [];
  sale.items.forEach((item) => {
    body.push(item.product.name);
    const qtyLabel = `  ${item.quantity} ${item.product.unit} x ${money(item.product.price)}`;
    body.push(padRow(qtyLabel, money(item.subtotal)));
  });
  body.push(RULE);
  body.push(padRow('Subtotal:', money(sale.subtotal)));
  body.push(padRow('IVA (19%):', money(sale.tax)));
  body.push(RULE);
  body.push(padRow('TOTAL:', money(sale.total)));

  if (sale.paymentMethod === 'efectivo') {
    body.push('');
    body.push(padRow('Efectivo recibido:', money(sale.cashReceived || 0)));
    body.push(padRow('Cambio:', money(sale.change || 0)));
  }

  lines.push('```' + body.join('\n') + '```');
  lines.push('');
  lines.push(`💳 Método de pago: *${sale.paymentMethod.toUpperCase()}*`);
  lines.push('');
  lines.push('¡Gracias por tu compra! 🧀🍖');
  lines.push('_Conserva este mensaje como tu factura._');

  return lines.join('\n');
}

/** Mensaje corto para alertas de descuentos/promociones (mismo enlace 1 a 1). */
export function buildPromoWhatsAppMessage(customerName: string, promoText: string): string {
  return `Hola ${customerName} 👋, desde *Salsamentaría Safi* tenemos una promoción para ti:\n\n${promoText}\n\n¡Te esperamos!`;
}

/** Texto corto que acompaña la imagen de la factura cuando se envía como foto por WhatsApp. */
export function buildInvoiceShareCaption(sale: Sale): string {
  return [
    `🧾 Factura ${sale.receiptNumber} — Salsamentaría Safi`,
    `Total: $${sale.total.toLocaleString('es-CO')} COP`,
    '¡Gracias por tu compra! 🧀🍖'
  ].join('\n');
}

/** Devuelve null si el cliente no tiene teléfono registrado (no hay a quién enviarle). */
export function getWhatsAppLink(phone: string | undefined, message: string): string | null {
  if (!phone) return null;
  const sanitized = sanitizePhone(phone);
  if (!sanitized) return null;
  return `https://wa.me/${sanitized}?text=${encodeURIComponent(message)}`;
}

export function getInvoiceWhatsAppLink(sale: Sale): string | null {
  if (!sale.customer?.phone) return null;
  return getWhatsAppLink(sale.customer.phone, buildInvoiceWhatsAppMessage(sale));
}
