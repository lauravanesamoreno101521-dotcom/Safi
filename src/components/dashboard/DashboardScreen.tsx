import React, { useMemo, useState } from 'react';
import { usePOS } from '../../context/POSContext';
import {
  TrendingUp,
  AlertTriangle,
  Barcode,
  Receipt,
  ArrowRight,
  DollarSign,
  Users,
  Activity,
  Trophy
} from 'lucide-react';
import { MOCK_WEEKLY_SALES } from '../../data/mockData';
import logoSafi from '../../assets/logo-safi.jpg';
import {
  PeriodType,
  getPeriodRange,
  filterSalesInRange,
  sumSales,
  computeTopProducts
} from '../../lib/salesAnalytics';
import { PeriodFilterBar, toDateInputValue } from '../shared/PeriodFilterBar';

const PERIOD_METRIC_LABELS: Record<PeriodType, string> = {
  dia: 'Ventas de Hoy',
  mes: 'Ventas de este Mes',
  anio: 'Ventas de este Año',
  rango: 'Ventas del Rango'
};

const formatShortDate = (d: Date) =>
  d.toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' });

export const DashboardScreen: React.FC = () => {
  const { setActiveTab, activityLogs, products, salesHistory } = usePOS();

  // Find how many products have stock below minStock
  const criticalStockCount = products.filter(p => p.stock <= p.minStock).length || 14;

  // --- Filtro de ventas por Día / Mes / Año / Rango personalizado ---
  const [periodType, setPeriodType] = useState<PeriodType>('dia');
  const defaultRangeStart = useMemo(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 3);
    return toDateInputValue(d);
  }, []);
  const [rangeStart, setRangeStart] = useState(defaultRangeStart);
  const [rangeEnd, setRangeEnd] = useState(toDateInputValue(new Date()));

  const periodRange = useMemo(
    () => getPeriodRange(periodType, rangeStart, rangeEnd),
    [periodType, rangeStart, rangeEnd]
  );

  const periodSales = useMemo(
    () => filterSalesInRange(salesHistory, periodRange.start, periodRange.end),
    [salesHistory, periodRange]
  );
  const previousPeriodSales = useMemo(
    () => filterSalesInRange(salesHistory, periodRange.prevStart, periodRange.prevEnd),
    [salesHistory, periodRange]
  );

  const periodTotal = useMemo(() => sumSales(periodSales), [periodSales]);
  const previousPeriodTotal = useMemo(() => sumSales(previousPeriodSales), [previousPeriodSales]);
  const growthPct = previousPeriodTotal > 0
    ? Math.round(((periodTotal - previousPeriodTotal) / previousPeriodTotal) * 100)
    : (periodTotal > 0 ? 100 : 0);

  const topProducts = useMemo(() => computeTopProducts(periodSales, 5), [periodSales]);

  const periodRangeLabel = `${formatShortDate(periodRange.start)} — ${formatShortDate(new Date(periodRange.end.getTime() - 1))}`;

  return (
    <div className="flex-1 p-6 lg:p-8 flex flex-col gap-8 overflow-y-auto bg-[#faf3e6]">
      {/* BRAND HEADER: Logo Safi */}
      <div className="flex items-center gap-4 bg-white shadow-xs p-5 rounded-2xl border border-[#ddc9a3]">
        <img
          src={logoSafi}
          alt="Logo Safi Salsamentaría"
          className="w-16 h-16 rounded-full object-cover border-2 border-[#7a0d0a] shadow-sm shrink-0"
        />
        <div>
          <h2 className="text-xl font-bold text-[#2a1a12]">Safi Salsamentaría</h2>
          <p className="text-sm text-[#7a6552]">Panel de control · Sabor de la Familia</p>
        </div>
      </div>

      {/* FILTRO DE VENTAS: Día / Mes / Año / Rango personalizado */}
      <PeriodFilterBar
        label="Ver ventas por:"
        periodType={periodType}
        onPeriodTypeChange={setPeriodType}
        rangeStart={rangeStart}
        onRangeStartChange={setRangeStart}
        rangeEnd={rangeEnd}
        onRangeEndChange={setRangeEnd}
      />

      {/* METRICS SUMMARY - TOP ROW (4 columns matching screenshot) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Metric 1: Sales Today */}
        <div className="bg-white shadow-xs p-6 rounded-2xl border border-[#ddc9a3] flex flex-col justify-between gap-4 transition-all hover:-translate-y-1 duration-300">
          <div className="flex justify-between items-start">
            <span className="font-medium text-sm text-[#7a6552]">{PERIOD_METRIC_LABELS[periodType]}</span>
            <span
              className={`text-white text-xs px-2.5 py-0.5 rounded-full font-bold shadow-xs ${
                growthPct >= 0 ? 'bg-[#a83a2c]' : 'bg-[#7a6552]'
              }`}
            >
              {growthPct >= 0 ? '+' : ''}{growthPct}%
            </span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-[#2a1a12] tracking-tight">
              ${periodTotal.toLocaleString('es-CO')}
            </span>
          </div>
          <p className="text-xs text-[#7a6552] -mt-2">
            {periodSales.length} {periodSales.length === 1 ? 'venta' : 'ventas'} · {periodRangeLabel}
          </p>
          {/* Mini Sparkline Simulation */}
          <div className="h-8 flex items-end gap-1.5 pt-1">
            <div className="flex-1 bg-[#f0d6ce] h-[40%] rounded-t-sm"></div>
            <div className="flex-1 bg-[#f0d6ce] h-[60%] rounded-t-sm"></div>
            <div className="flex-1 bg-[#f0d6ce] h-[45%] rounded-t-sm"></div>
            <div className="flex-1 bg-[#f0d6ce] h-[80%] rounded-t-sm"></div>
            <div className="flex-1 bg-[#7a0d0a] h-full rounded-t-sm"></div>
          </div>
        </div>

        {/* Metric 2: Income vs Expense */}
        <div className="bg-white shadow-xs p-6 rounded-2xl border border-[#ddc9a3] flex flex-col justify-between gap-4 transition-all hover:-translate-y-1 duration-300">
          <span className="font-medium text-sm text-[#7a6552]">Utilidad Neta (Mensual)</span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-[#2a1a12] tracking-tight">$8.120.000</span>
          </div>
          <div className="flex flex-col gap-1.5 mt-1">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-[#2a1a12]">Ingresos vs Gastos</span>
              <span className="text-[#7a0d0a]">68%</span>
            </div>
            <div className="w-full bg-[#efe1c4] h-2 rounded-full overflow-hidden">
              <div className="bg-[#7a0d0a] h-full transition-all duration-500" style={{ width: '68%' }}></div>
            </div>
          </div>
        </div>

        {/* Metric 3: Low Stock Alert */}
        <div className="bg-[#ffdad6] p-6 rounded-2xl border-2 border-[#ba1a1a]/30 flex flex-col justify-between transition-all hover:-translate-y-1 duration-300">
          <div>
            <div className="flex items-center gap-2 text-[#93000a]">
              <AlertTriangle className="w-5 h-5 stroke-2" />
              <span className="font-bold text-sm">Alerta de Inventario</span>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-black text-[#93000a]">{criticalStockCount}</span>
              <p className="font-medium text-sm text-[#93000a]/80 mt-1">
                Productos con stock crítico
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('inventario')}
            className="mt-3 text-[#93000a] font-bold text-xs underline flex items-center gap-1 hover:opacity-80 cursor-pointer w-fit"
          >
            <span>Ver detalles</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Metric 4: Quick POS Action (Red card) */}
        <div
          onClick={() => setActiveTab('pos')}
          className="bg-[#7a0d0a] flex flex-col justify-center items-center text-center p-6 rounded-2xl border border-[#7a0d0a] shadow-lg transition-all hover:brightness-110 active:scale-95 cursor-pointer group"
        >
          <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Barcode className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-white">Punto de Venta</h3>
          <p className="text-xs text-white/80 mt-1 font-medium">Abrir caja y facturar</p>
        </div>
      </div>

      {/* MAIN CHART & ACTIVITY BENTO GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Comparison Chart Section (2 columns) */}
        <div className="lg:col-span-2 bg-white shadow-xs rounded-2xl border border-[#ddc9a3] overflow-hidden flex flex-col">
          <div className="p-6 border-b border-[#ddc9a3] flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-[#2a1a12]">Ventas Semanales</h2>
              <p className="text-xs text-[#7a6552] mt-0.5">Comparativa vs. Semana Anterior</p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#7a0d0a]"></div>
                <span className="text-xs text-[#7a6552] font-medium">Actual</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#d3c3a8]"></div>
                <span className="text-xs text-[#7a6552] font-medium">Anterior</span>
              </div>
            </div>
          </div>

          <div className="p-6 flex-1 min-h-[320px] flex items-end justify-between gap-4 md:gap-8 pt-10">
            {MOCK_WEEKLY_SALES.map((item) => {
              // Normalize heights for visual representation
              const maxVal = 4500000;
              const actualPct = Math.min(100, Math.round((item.actual / maxVal) * 100));
              const prevPct = Math.min(100, Math.round((item.previous / maxVal) * 100));

              return (
                <div key={item.day} className="flex flex-col items-center gap-2 w-full">
                  <div className="w-full flex items-end justify-center gap-1.5 h-56">
                    {/* Previous Bar */}
                    <div
                      title={`Anterior: $${item.previous.toLocaleString('es-CO')}`}
                      className="w-4 sm:w-6 bg-[#d3c3a8] hover:bg-[#8a6f52] transition-colors rounded-t-md"
                      style={{ height: `${prevPct}%` }}
                    ></div>
                    {/* Actual Bar */}
                    <div
                      title={`Actual: $${item.actual.toLocaleString('es-CO')}`}
                      className="w-4 sm:w-6 bg-[#7a0d0a] hover:bg-[#4f0906] transition-colors rounded-t-md shadow-xs"
                      style={{ height: `${actualPct}%` }}
                    ></div>
                  </div>
                  <span className="text-xs font-bold text-[#7a6552]">{item.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity Section (1 column matching screenshot) */}
        <div className="bg-white shadow-xs rounded-2xl border border-[#ddc9a3] flex flex-col">
          <div className="p-6 border-b border-[#ddc9a3] flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#2a1a12]">Actividad Reciente</h2>
            <span className="text-xs bg-[#efe1c4] text-[#2a1a12] font-bold px-2.5 py-1 rounded-full">
              En vivo
            </span>
          </div>

          <div className="flex flex-col flex-1 divide-y divide-[#efe1c4] overflow-y-auto max-h-[360px]">
            {activityLogs.slice(0, 5).map((log) => (
              <div
                key={log.id}
                className="p-5 hover:bg-[#faf6ee] transition-colors flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-[#efe1c4] flex items-center justify-center text-[#7a0d0a] group-hover:scale-110 transition-transform">
                    <Receipt className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-sm text-[#2a1a12]">{log.productName}</span>
                    <span className="text-xs text-[#7a6552]">{log.quantityStr}</span>
                  </div>
                </div>
                <span className="font-bold text-sm text-[#2a1a12]">
                  ${log.amount.toLocaleString('es-CO')}
                </span>
              </div>
            ))}
          </div>

          <div className="p-4 text-center border-t border-[#ddc9a3] mt-auto">
            <button
              onClick={() => setActiveTab('reportes')}
              className="text-[#7a0d0a] font-bold text-xs hover:underline cursor-pointer"
            >
              Ver todo el historial
            </button>
          </div>
        </div>
      </div>

      {/* TOP PRODUCTOS EN EL PERÍODO SELECCIONADO */}
      <div className="bg-white shadow-xs rounded-2xl border border-[#ddc9a3] flex flex-col">
        <div className="p-6 border-b border-[#ddc9a3] flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[#7a0d0a]" />
            <div>
              <h2 className="text-xl font-bold text-[#2a1a12]">Más Vendidos en el Período</h2>
              <p className="text-xs text-[#7a6552] mt-0.5">{periodRangeLabel}</p>
            </div>
          </div>
          <span className="text-xs bg-[#efe1c4] text-[#2a1a12] font-bold px-2.5 py-1 rounded-full">
            {periodSales.length} {periodSales.length === 1 ? 'venta' : 'ventas'}
          </span>
        </div>

        {topProducts.length === 0 ? (
          <div className="p-8 text-center text-sm text-[#7a6552]">
            No hay ventas registradas en este período.
          </div>
        ) : (
          <div className="divide-y divide-[#efe1c4]">
            {topProducts.map((p, idx) => (
              <div key={p.productId} className="p-5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-7 h-7 rounded-full bg-[#f5e2da] text-[#7a0d0a] font-bold text-xs flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <div className="flex flex-col min-w-0">
                    <span className="font-bold text-sm text-[#2a1a12] truncate">{p.name}</span>
                    <span className="text-xs text-[#7a6552]">
                      {p.quantity.toLocaleString('es-CO', { maximumFractionDigits: 3 })} {p.unit}
                    </span>
                  </div>
                </div>
                <span className="font-bold text-sm text-[#2a1a12] shrink-0">
                  ${p.revenue.toLocaleString('es-CO')}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* BUSINESS HEALTH SPARK BENTO SECTION (3 bottom cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-xs flex items-center justify-between border border-[#ddc9a3]">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-[#7a6552] uppercase tracking-wider">
              Ticket Promedio
            </span>
            <span className="text-2xl font-bold text-[#2a1a12]">$34.500</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#f5e2da] flex items-center justify-center text-[#7a0d0a]">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-xs flex items-center justify-between border border-[#ddc9a3]">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-[#7a6552] uppercase tracking-wider">
              Frecuencia Clientes
            </span>
            <span className="text-2xl font-bold text-[#2a1a12]">1.4 / sem</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#efe1c4] flex items-center justify-center text-[#2a1a12]">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-xs flex items-center justify-between border border-[#ddc9a3]">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-[#7a6552] uppercase tracking-wider">
              Pérdida por Merma
            </span>
            <span className="text-2xl font-bold text-[#ba1a1a]">2.1%</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#ffdad6] flex items-center justify-center text-[#ba1a1a]">
            <Activity className="w-6 h-6" />
          </div>
        </div>
      </div>
    </div>
  );
};
