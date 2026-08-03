import React from 'react';
import { usePOS } from '../../context/POSContext';
import { 
  TrendingUp, 
  AlertTriangle, 
  Barcode, 
  Receipt, 
  ArrowRight, 
  DollarSign, 
  Users, 
  Activity 
} from 'lucide-react';
import { MOCK_WEEKLY_SALES } from '../../data/mockData';

export const DashboardScreen: React.FC = () => {
  const { setActiveTab, activityLogs, products } = usePOS();

  // Find how many products have stock below minStock
  const criticalStockCount = products.filter(p => p.stock <= p.minStock).length || 14;

  return (
    <div className="flex-1 p-6 lg:p-8 flex flex-col gap-8 overflow-y-auto bg-[#f1fbff]">
      {/* METRICS SUMMARY - TOP ROW (4 columns matching screenshot) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Metric 1: Sales Today */}
        <div className="bg-white shadow-xs p-6 rounded-2xl border border-[#dfbfba] flex flex-col justify-between gap-4 transition-all hover:-translate-y-1 duration-300">
          <div className="flex justify-between items-start">
            <span className="font-medium text-sm text-[#586062]">Ventas del Día</span>
            <span className="bg-[#c04838] text-white text-xs px-2.5 py-0.5 rounded-full font-bold shadow-xs">
              +12%
            </span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-[#131d21] tracking-tight">$2.450.000</span>
          </div>
          {/* Mini Sparkline Simulation */}
          <div className="h-8 flex items-end gap-1.5 pt-1">
            <div className="flex-1 bg-[#ffdad4] h-[40%] rounded-t-sm"></div>
            <div className="flex-1 bg-[#ffdad4] h-[60%] rounded-t-sm"></div>
            <div className="flex-1 bg-[#ffdad4] h-[45%] rounded-t-sm"></div>
            <div className="flex-1 bg-[#ffdad4] h-[80%] rounded-t-sm"></div>
            <div className="flex-1 bg-[#9f3023] h-full rounded-t-sm"></div>
          </div>
        </div>

        {/* Metric 2: Income vs Expense */}
        <div className="bg-white shadow-xs p-6 rounded-2xl border border-[#dfbfba] flex flex-col justify-between gap-4 transition-all hover:-translate-y-1 duration-300">
          <span className="font-medium text-sm text-[#586062]">Utilidad Neta (Mensual)</span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-[#131d21] tracking-tight">$8.120.000</span>
          </div>
          <div className="flex flex-col gap-1.5 mt-1">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-[#131d21]">Ingresos vs Gastos</span>
              <span className="text-[#9f3023]">68%</span>
            </div>
            <div className="w-full bg-[#e4f0f4] h-2 rounded-full overflow-hidden">
              <div className="bg-[#9f3023] h-full transition-all duration-500" style={{ width: '68%' }}></div>
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
          className="bg-[#9f3023] flex flex-col justify-center items-center text-center p-6 rounded-2xl border border-[#9f3023] shadow-lg transition-all hover:brightness-110 active:scale-95 cursor-pointer group"
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
        <div className="lg:col-span-2 bg-white shadow-xs rounded-2xl border border-[#dfbfba] overflow-hidden flex flex-col">
          <div className="p-6 border-b border-[#dfbfba] flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-[#131d21]">Ventas Semanales</h2>
              <p className="text-xs text-[#586062] mt-0.5">Comparativa vs. Semana Anterior</p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#9f3023]"></div>
                <span className="text-xs text-[#586062] font-medium">Actual</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#c1c8ca]"></div>
                <span className="text-xs text-[#586062] font-medium">Anterior</span>
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
                      className="w-4 sm:w-6 bg-[#c1c8ca] hover:bg-[#8b716d] transition-colors rounded-t-md"
                      style={{ height: `${prevPct}%` }}
                    ></div>
                    {/* Actual Bar */}
                    <div
                      title={`Actual: $${item.actual.toLocaleString('es-CO')}`}
                      className="w-4 sm:w-6 bg-[#9f3023] hover:bg-[#881f14] transition-colors rounded-t-md shadow-xs"
                      style={{ height: `${actualPct}%` }}
                    ></div>
                  </div>
                  <span className="text-xs font-bold text-[#586062]">{item.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity Section (1 column matching screenshot) */}
        <div className="bg-white shadow-xs rounded-2xl border border-[#dfbfba] flex flex-col">
          <div className="p-6 border-b border-[#dfbfba] flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#131d21]">Actividad Reciente</h2>
            <span className="text-xs bg-[#e4f0f4] text-[#131d21] font-bold px-2.5 py-1 rounded-full">
              En vivo
            </span>
          </div>

          <div className="flex flex-col flex-1 divide-y divide-[#e4f0f4] overflow-y-auto max-h-[360px]">
            {activityLogs.slice(0, 5).map((log) => (
              <div
                key={log.id}
                className="p-5 hover:bg-[#f8fafb] transition-colors flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-[#e4f0f4] flex items-center justify-center text-[#9f3023] group-hover:scale-110 transition-transform">
                    <Receipt className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-sm text-[#131d21]">{log.productName}</span>
                    <span className="text-xs text-[#586062]">{log.quantityStr}</span>
                  </div>
                </div>
                <span className="font-bold text-sm text-[#131d21]">
                  ${log.amount.toLocaleString('es-CO')}
                </span>
              </div>
            ))}
          </div>

          <div className="p-4 text-center border-t border-[#dfbfba] mt-auto">
            <button
              onClick={() => setActiveTab('reportes')}
              className="text-[#9f3023] font-bold text-xs hover:underline cursor-pointer"
            >
              Ver todo el historial
            </button>
          </div>
        </div>
      </div>

      {/* BUSINESS HEALTH SPARK BENTO SECTION (3 bottom cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-xs flex items-center justify-between border border-[#dfbfba]">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-[#586062] uppercase tracking-wider">
              Ticket Promedio
            </span>
            <span className="text-2xl font-bold text-[#131d21]">$34.500</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#fff2f0] flex items-center justify-center text-[#9f3023]">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-xs flex items-center justify-between border border-[#dfbfba]">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-[#586062] uppercase tracking-wider">
              Frecuencia Clientes
            </span>
            <span className="text-2xl font-bold text-[#131d21]">1.4 / sem</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#e4f0f4] flex items-center justify-center text-[#131d21]">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-xs flex items-center justify-between border border-[#dfbfba]">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-[#586062] uppercase tracking-wider">
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
