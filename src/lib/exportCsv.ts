import { Sale } from '../types';

function escapeCsvField(value: string): string {
  if (value.includes(';') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

/**
 * Genera y descarga un archivo .csv (se abre directo en Excel) con el
 * consolidado de ventas: N° de ticket, fecha, hora, cliente, método de
 * pago y valor pagado. Se usa punto y coma como separador porque es lo que
 * Excel en español (configuración regional Colombia) espera por defecto.
 *
 * No requiere ninguna librería adicional, así que no depende de que se
 * ejecute `npm install` de nuevo para funcionar.
 */
export function exportConsolidatedSalesCsv(sales: Sale[]): void {
  const headers = ['Ticket N°', 'Fecha', 'Hora', 'Cliente', 'Método de Pago', 'Valor Pagado'];

  const rows = sales.map((sale) => {
    const date = new Date(sale.timestamp);
    return [
      sale.receiptNumber,
      date.toLocaleDateString('es-CO'),
      date.toLocaleTimeString('es-CO'),
      sale.customer ? sale.customer.name : 'Mostrador General',
      sale.paymentMethod,
      sale.total.toString()
    ].map(escapeCsvField).join(';');
  });

  const csvContent = [headers.join(';'), ...rows].join('\r\n');
  // BOM al inicio para que Excel detecte UTF-8 y no dañe las tildes/ñ
  const blob = new Blob(['﻿' + csvContent], { type: 'text/csv;charset=utf-8;' });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const today = new Date().toISOString().slice(0, 10);
  link.href = url;
  link.download = `excel-consolidado-safi-${today}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
