import React, { useMemo, useState } from 'react';
import { usePOS } from '../../context/POSContext';
import { Trophy, Search } from 'lucide-react';
import { PeriodFilterBar, toDateInputValue } from '../shared/PeriodFilterBar';
import {
  PeriodType,
  getPeriodRange,
  filterSalesInRange,
  computeCustomerAnalytics
} from '../../lib/salesAnalytics';

const TAG_STYLES: Record<'nuevo' | 'frecuente' | 'vip', { label: string; bg: string; text: string }> = {
  nuevo: { label: 'Nuevo', bg: '#efe1c4', text: '#6b4a30' },
  frecuente: { label: 'Frecuente', bg: '#e3e0bd', text: '#3f3d15' },
  vip: { label: 'VIP', bg: '#f7ecc9', text: '#7a5c0a' }
};

function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase())
    .join('');
}

function formatRelativeDate(date: Date): string {
  const diffDays = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays <= 0) return 'Hoy';
  if (diffDays === 1) return 'Hace 1 día';
  return `Hace ${diffDays} días`;
}

const formatShortDate = (d: Date) =>
  d.toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' });

export const ClientsScreen: React.FC = () => {
  const { salesHistory, customers } = usePOS();

  const [periodType, setPeriodType] = useState<PeriodType>('mes');
  const defaultRangeStart = useMemo(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 3);
    return toDateInputValue(d);
  }, []);
  const [rangeStart, setRangeStart] = useState(defaultRangeStart);
  const [rangeEnd, setRangeEnd] = useState(toDateInputValue(new Date()));
  const [search, setSearch] = useState('');

  const periodRange = useMemo(
    () => getPeriodRange(periodType, rangeStart, rangeEnd),
    [periodType, rangeStart, rangeEnd]
  );

  const periodSales = useMemo(
    () => filterSalesInRange(salesHistory, periodRange.start, periodRange.end),
    [salesHistory, periodRange]
  );

  const { rows, newInPeriodCount } = useMemo(
    () => computeCustomerAnalytics(periodSales, salesHistory, periodRange.start, periodRange.end),
    [periodSales, salesHistory, periodRange]
  );

  const filteredRows = useMemo(() => {
    if (!search.trim()) return rows;
    const q = search.toLowerCase();
    return rows.filter(r => r.name.toLowerCase().includes(q) || r.document.toLowerCase().includes(q));
  }, [rows, search]);

  const topCustomer = rows[0];
  const periodRangeLabel = `${formatShortDate(periodRange.start)} — ${formatShortDate(new Date(periodRange.end.getTime() - 1))}`;

  return (
    <div className="flex-1 p-6 lg:p-8 flex flex-col gap-6 overflow-y-auto bg-[#faf3e6]">
      <PeriodFilterBar
        label="Ver clientes por:"
        periodType={periodType}
        onPeriodTypeChange={setPeriodType}
        rangeStart={rangeStart}
        onRangeStartChange={setRangeStart}
        rangeEnd={rangeEnd}
        onRangeEndChange={setRangeEnd}
      />

      {/* RESUMEN */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white shadow-xs p-6 rounded-2xl border border-[#ddc9a3]">
          <p className="text-xs font-bold text-[#7a6552] uppercase tracking-wider mb-2">Clientes Registrados</p>
          <p className="text-2xl font-bold text-[#2a1a12]">{customers.length}</p>
        </div>
        <div className="bg-white shadow-xs p-6 rounded-2xl border border-[#ddc9a3]">
          <p className="text-xs font-bold text-[#7a6552] uppercase tracking-wider mb-2">Nuevos en el Período</p>
          <p className="text-2xl font-bold text-[#2a1a12]">{newInPeriodCount}</p>
        </div>
        <div className="bg-white shadow-xs p-6 rounded-2xl border border-[#ddc9a3]">
          <p className="text-xs font-bold text-[#7a6552] uppercase tracking-wider mb-2">Cliente Más Frecuente</p>
          {topCustomer ? (
            <>
              <p className="text-base font-bold text-[#2a1a12] truncate">{topCustomer.name}</p>
              <p className="text-xs text-[#7a6552] mt-1">
                {topCustomer.purchaseCount} {topCustomer.purchaseCount === 1 ? 'compra' : 'compras'}
              </p>
            </>
          ) : (
            <p className="text-sm text-[#7a6552]">Sin datos en este período</p>
          )}
        </div>
      </div>

      {/* RANKING */}
      <div className="bg-white shadow-xs rounded-2xl border border-[#ddc9a3] flex flex-col">
        <div className="p-6 border-b border-[#ddc9a3] flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[#7a0d0a]" />
            <div>
              <h2 className="text-xl font-bold text-[#2a1a12]">Ranking de Clientes Frecuentes</h2>
              <p className="text-xs text-[#7a6552] mt-0.5">{periodRangeLabel}</p>
            </div>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 text-[#7a6552] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar cliente..."
              className="pl-9 pr-3 py-2 bg-[#f3e7d0] border border-[#ddc9a3] rounded-xl text-xs outline-none focus:border-[#7a0d0a] w-48"
            />
          </div>
        </div>

        {filteredRows.length === 0 ? (
          <div className="p-8 text-center text-sm text-[#7a6552]">
            No hay compras de clientes registradas en este período.
          </div>
        ) : (
          <div className="divide-y divide-[#efe1c4]">
            {filteredRows.map((row, idx) => {
              const tag = TAG_STYLES[row.tag];
              return (
                <div key={row.customerId} className="p-5 flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-[#f5e2da] text-[#7a0d0a] font-bold text-xs flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <div className="w-10 h-10 rounded-full bg-[#7a0d0a] text-white text-xs font-bold flex items-center justify-center shrink-0">
                    {initials(row.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-[#2a1a12] truncate">{row.name}</span>
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0"
                        style={{ background: tag.bg, color: tag.text }}
                      >
                        {tag.label}
                      </span>
                    </div>
                    <span className="text-xs text-[#7a6552]">
                      Última visita: {formatRelativeDate(row.lastVisit)}
                    </span>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-[#2a1a12]">
                      {row.purchaseCount} {row.purchaseCount === 1 ? 'compra' : 'compras'}
                    </p>
                    <p className="text-xs text-[#7a6552]">${row.totalSpent.toLocaleString('es-CO')} total</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
