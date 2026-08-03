import { Sale, Customer } from '../types';

export type PeriodType = 'dia' | 'mes' | 'anio' | 'rango';

export interface PeriodRange {
  /** Inicio del período, inclusive. */
  start: Date;
  /** Fin del período, EXCLUSIVO (medianoche del día siguiente al último día incluido). */
  end: Date;
  /** Inicio del período anterior equivalente, para calcular el % de crecimiento. */
  prevStart: Date;
  /** Fin del período anterior, exclusivo. */
  prevEnd: Date;
}

function startOfDay(d: Date): Date {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function addDays(d: Date, days: number): Date {
  const copy = new Date(d);
  copy.setDate(copy.getDate() + days);
  return copy;
}

/**
 * Calcula el rango de fechas para el filtro elegido en el Dashboard, y el
 * rango "anterior" equivalente para poder mostrar el % de crecimiento
 * (ej: hoy vs ayer, este mes vs el mes pasado, el rango elegido vs el mismo
 * número de días inmediatamente antes).
 */
export function getPeriodRange(type: PeriodType, customStart?: string, customEnd?: string): PeriodRange {
  const now = new Date();

  if (type === 'dia') {
    const start = startOfDay(now);
    const end = addDays(start, 1);
    return { start, end, prevStart: addDays(start, -1), prevEnd: start };
  }

  if (type === 'mes') {
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const prevStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    return { start, end, prevStart, prevEnd: start };
  }

  if (type === 'anio') {
    const start = new Date(now.getFullYear(), 0, 1);
    const end = new Date(now.getFullYear() + 1, 0, 1);
    const prevStart = new Date(now.getFullYear() - 1, 0, 1);
    return { start, end, prevStart, prevEnd: start };
  }

  // Rango personalizado (ej: comparar 2-3 meses de comportamiento)
  const fallbackStart = addDays(startOfDay(now), -90);
  const start = customStart ? startOfDay(new Date(`${customStart}T00:00:00`)) : fallbackStart;
  const endInclusive = customEnd ? startOfDay(new Date(`${customEnd}T00:00:00`)) : startOfDay(now);
  const end = addDays(endInclusive, 1);
  const lengthMs = end.getTime() - start.getTime();
  return { start, end, prevStart: new Date(start.getTime() - lengthMs), prevEnd: start };
}

export function filterSalesInRange(sales: Sale[], start: Date, end: Date): Sale[] {
  return sales.filter((s) => {
    const t = new Date(s.timestamp).getTime();
    return t >= start.getTime() && t < end.getTime();
  });
}

export function sumSales(sales: Sale[]): number {
  return sales.reduce((acc, s) => acc + s.total, 0);
}

export interface TopProductRow {
  productId: string;
  name: string;
  unit: string;
  quantity: number;
  revenue: number;
}

/** Agrupa las ventas del período por producto y devuelve el top por ingresos. */
export function computeTopProducts(sales: Sale[], limit = 5): TopProductRow[] {
  const map = new Map<string, TopProductRow>();

  for (const sale of sales) {
    for (const item of sale.items) {
      const existing = map.get(item.product.id);
      if (existing) {
        existing.quantity += item.quantity;
        existing.revenue += item.subtotal;
      } else {
        map.set(item.product.id, {
          productId: item.product.id,
          name: item.product.name,
          unit: item.product.unit,
          quantity: item.quantity,
          revenue: item.subtotal
        });
      }
    }
  }

  return Array.from(map.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, limit);
}

export interface CustomerRow {
  customerId: string;
  name: string;
  document: string;
  type: Customer['type'];
  purchaseCount: number;
  totalSpent: number;
  lastVisit: Date;
  isNewInPeriod: boolean;
  tag: 'nuevo' | 'frecuente' | 'vip';
}

export interface CustomerAnalytics {
  rows: CustomerRow[];
  newInPeriodCount: number;
}

/**
 * Ranking de clientes por frecuencia/gasto en el período filtrado.
 * `allSales` (todo el historial, sin filtrar) se usa solo para saber cuál
 * fue la PRIMERA compra histórica de cada cliente, y así marcar como
 * "nuevo" a quien compró por primera vez dentro del período seleccionado.
 */
export function computeCustomerAnalytics(
  periodSales: Sale[],
  allSales: Sale[],
  periodStart: Date,
  periodEnd: Date
): CustomerAnalytics {
  interface Accum {
    customer: Customer;
    purchaseCount: number;
    totalSpent: number;
    lastVisit: Date;
  }

  const statsMap = new Map<string, Accum>();

  for (const sale of periodSales) {
    if (!sale.customer) continue;
    const ts = new Date(sale.timestamp);
    const existing = statsMap.get(sale.customer.id);
    if (existing) {
      existing.purchaseCount += 1;
      existing.totalSpent += sale.total;
      if (ts > existing.lastVisit) existing.lastVisit = ts;
    } else {
      statsMap.set(sale.customer.id, {
        customer: sale.customer,
        purchaseCount: 1,
        totalSpent: sale.total,
        lastVisit: ts
      });
    }
  }

  const firstPurchaseMs = new Map<string, number>();
  for (const sale of allSales) {
    if (!sale.customer) continue;
    const ts = new Date(sale.timestamp).getTime();
    const existing = firstPurchaseMs.get(sale.customer.id);
    if (existing === undefined || ts < existing) {
      firstPurchaseMs.set(sale.customer.id, ts);
    }
  }

  const sorted = Array.from(statsMap.values()).sort((a, b) => b.totalSpent - a.totalSpent);

  const periodStartMs = periodStart.getTime();
  const periodEndMs = periodEnd.getTime();

  const rows: CustomerRow[] = sorted.map((entry, idx) => {
    const firstMs = firstPurchaseMs.get(entry.customer.id);
    const isNewInPeriod = firstMs !== undefined && firstMs >= periodStartMs && firstMs < periodEndMs;

    let tag: CustomerRow['tag'] = 'frecuente';
    if (entry.purchaseCount === 1) tag = 'nuevo';
    else if (idx === 0) tag = 'vip';

    return {
      customerId: entry.customer.id,
      name: entry.customer.name,
      document: entry.customer.document,
      type: entry.customer.type,
      purchaseCount: entry.purchaseCount,
      totalSpent: entry.totalSpent,
      lastVisit: entry.lastVisit,
      isNewInPeriod,
      tag
    };
  });

  const newInPeriodCount = rows.filter(r => r.isNewInPeriod).length;

  return { rows, newInPeriodCount };
}
