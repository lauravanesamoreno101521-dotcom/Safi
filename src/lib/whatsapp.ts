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

export function buildInvoiceWhatsAppMessage(sale: Sale): string {
  const lines: string[] = [];
  lines.push(`*Salsamentaría Safi* — Ticket ${sale.receiptNumber}`);
  lines.push(new Date(sale.timestamp).toLocaleString('es-CO'));
  if (sale.customer) {
    lines.push(`Cliente: ${sale.customer.name}`);
  }
  lines.push('');
  sale.items.forEach((item) => {
    lines.push(
      `• ${item.product.name} — ${item.quantity} ${item.product.unit} — $${item.subtotal.toLocaleString('es-CO')}`
    );
  });
  lines.push('');
  lines.push(`Subtotal: $${sale.subtotal.toLocaleString('es-CO')}`);
  lines.push(`IVA (19%): $${sale.tax.toLocaleString('es-CO')}`);
  lines.push(`*Total: $${sale.total.toLocaleString('es-CO')} COP*`);
  lines.push('');
  lines.push('¡Gracias por tu compra! 🧀🍖');
  return lines.join('\n');
}

/** Mensaje corto para alertas de descuentos/promociones (mismo enlace 1 a 1). */
export function buildPromoWhatsAppMessage(customerName: string, promoText: string): string {
  return `Hola ${customerName} 👋, desde *Salsamentaría Safi* tenemos una promoción para ti:\n\n${promoText}\n\n¡Te esperamos!`;
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
