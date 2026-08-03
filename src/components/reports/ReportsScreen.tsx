import React, { useMemo, useState } from 'react';
import { usePOS } from '../../context/POSContext';
import {
  BarChart3,
  Download,
  FileSpreadsheet,
  Receipt,
  Calendar,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  Printer
} from 'lucide-react';
import { MOCK_WEEKLY_SALES } from '../../data/mockData';
import { exportConsolidatedSalesCsv } from '../../lib/exportCsv';
import { PeriodFilterBar, toDateInputValue } from '../shared/PeriodFilterBar';
import { PeriodType, getPeriodRange, filterSalesInRange } from '../../lib/salesAnalytics';

const formatShortDate = (d: Date) =>
  d.toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' });

export const ReportsScreen: React.FC = () => {
  const { salesHistory, setIsReceiptModalOpen } = usePOS();

  const totalWeeklyActual = MOCK_WEEKLY_SALES.reduce((acc, d) => acc + d.actual, 0);
  const totalWeeklyPrevious = MOCK_WEEKLY_SALES.reduce((acc, d) => acc + d.previous, 0);
  const weeklyGrowth = Math.round(
    ((totalWeeklyActual - totalWeeklyPrevious) / totalWeeklyPrevious) * 100
  );

  // --- Filtro Día / Mes / Año / Rango, enlazado con la tabla y con la exportación ---
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

  const periodRangeLabel = `${formatShortDate(periodRange.start)} — ${formatShortDate(new Date(periodRange.end.getTime() - 1))}`;

  return (
    <div className="flex-1 p-6 lg:p-8 flex flex-col gap-6 overflow-y-auto bg-[#faf3e6]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#2a1a12]">Reportes y Estadísticas</h2>
          <p className="text-sm text-[#7a6552]">
            Análisis financiero, rotación de productos e historial de tickets emitidos
          </p>
        </div>

        <div className="flex gap-2 flex-wrap">
          {/*
            TODO cuando exista login con roles: "Exportar Balance DIAN" solo debe
            verlo el rol Administrador. "Exportar Excel Consolidado" lo ven tanto
            Administrador como Visualizador (es el único botón que le queda a
            Visualizador, junto con el acceso a Dashboard y Reportes).
          */}
          <button
            onClick={() => alert('Exportando Reporte Contable en Excel/PDF...')}
            className="px-4 py-2.5 bg-[#2a1a12] hover:bg-gray-800 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 cursor-pointer transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Exportar Balance DIAN</span>
          </button>
          <button
            onClick={() => exportConsolidatedSalesCsv(periodSales)}
            disabled={periodSales.length === 0}
            className="px-4 py-2.5 bg-[#7a0d0a] hover:bg-[#4f0906] text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 cursor-pointer transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Exportar Excel Consolidado</span>
          </button>
        </div>
      </div>

      {/* FILTRO: Día / Mes / Año / Rango — enlazado con la tabla y la exportación */}
      <PeriodFilterBar
        label="Ver reporte por:"
        periodType={periodType}
        onPeriodTypeChange={setPeriodType}
        rangeStart={rangeStart}
        onRangeStartChange={setRangeStart}
        rangeEnd={rangeEnd}
        onRangeEndChange={setRangeEnd}
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-[#ddc9a3] shadow-xs">
          <span className="text-xs font-bold text-[#7a6552] uppercase">
            Ingresos Semanales
          </span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-bold text-[#2a1a12]">
              ${totalWeeklyActual.toLocaleString('es-CO')}
            </span>
            <span className="text-xs bg-[#e3e0bd] text-[#3f3d15] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              +{weeklyGrowth}%
              <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            vs. ${totalWeeklyPrevious.toLocaleString('es-CO')} semana ant.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#ddc9a3] shadow-xs">
          <span className="text-xs font-bold text-[#7a6552] uppercase">
            Tickets Emitidos Hoy
          </span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-bold text-[#2a1a12]">
              {salesHistory.length + 42}
            </span>
            <span className="text-xs bg-[#f5e2da] text-[#7a0d0a] font-bold px-2 py-0.5 rounded-full">
              Promedio $34.500
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">Caja Principal • Sede Norte</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#ddc9a3] shadow-xs">
          <span className="text-xs font-bold text-[#7a6552] uppercase">
            Producto Líder en Peso
          </span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-xl font-bold text-[#2a1a12]">
              Jamón Serrano Premium
            </span>
          </div>
          <p className="text-xs text-[#7a0d0a] font-bold mt-1">
            18.4 Kg vendidos en 7 días
          </p>
        </div>
      </div>

      {/* Sales History & Receipts Table */}
      <div className="bg-white rounded-2xl shadow-xs border border-[#ddc9a3] overflow-hidden">
        <div className="p-6 border-b border-[#ddc9a3] flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-[#2a1a12]">
              Historial de Tickets Emitidos
            </h3>
            <p className="text-xs text-[#7a6552]">{periodRangeLabel}</p>
          </div>
          <span className="text-xs bg-[#efe1c4] text-[#2a1a12] font-bold px-3 py-1 rounded-full">
            {periodSales.length} {periodSales.length === 1 ? 'ticket' : 'tickets'} en el período
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#faf6ee] border-b border-[#ddc9a3]">
              <tr>
                <th className="px-6 py-3 text-xs font-bold text-[#7a6552] uppercase">Ticket N°</th>
                <th className="px-6 py-3 text-xs font-bold text-[#7a6552] uppercase">Fecha</th>
                <th className="px-6 py-3 text-xs font-bold text-[#7a6552] uppercase">Hora</th>
                <th className="px-6 py-3 text-xs font-bold text-[#7a6552] uppercase">Cliente</th>
                <th className="px-6 py-3 text-xs font-bold text-[#7a6552] uppercase">Método Pago</th>
                <th className="px-6 py-3 text-xs font-bold text-[#7a6552] uppercase text-right">Total</th>
                <th className="px-6 py-3 w-20 text-center">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#efe1c4]">
              {periodSales.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-sm text-[#7a6552]">
                    No hay tickets emitidos en este período.
                  </td>
                </tr>
              )}
              {periodSales.map((s) => (
                <tr key={s.id} className="hover:bg-[#faf6ee]">
                  <td className="px-6 py-4 font-mono font-bold text-[#7a0d0a] text-sm">
                    {s.receiptNumber}
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-500">
                    {new Date(s.timestamp).toLocaleDateString('es-CO')}
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-500">
                    {new Date(s.timestamp).toLocaleTimeString('es-CO')}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-[#2a1a12]">
                    {s.customer ? s.customer.name : 'Mostrador General'}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs uppercase bg-[#efe1c4] text-[#2a1a12] px-2.5 py-1 rounded-lg font-bold">
                      {s.paymentMethod}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-sm text-[#2a1a12]">
                    ${s.total.toLocaleString('es-CO')}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => setIsReceiptModalOpen(true)}
                      className="p-1.5 text-gray-500 hover:text-[#7a0d0a] rounded-lg hover:bg-[#f5e2da] cursor-pointer"
                      title="Imprimir ticket"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
