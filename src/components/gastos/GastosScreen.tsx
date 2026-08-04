import React, { useMemo, useState } from 'react';
import { usePOS } from '../../context/POSContext';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Scale,
  Plus,
  ArrowDownCircle,
  ArrowUpCircle,
  X
} from 'lucide-react';
import { PeriodFilterBar, toDateInputValue } from '../shared/PeriodFilterBar';
import { PeriodType, getPeriodRange, filterSalesInRange } from '../../lib/salesAnalytics';
import { GastoCategoria, GastoEgresoCategoria, GastoIngresoCategoria } from '../../types';

const CATEGORIA_LABELS: Record<GastoCategoria, string> = {
  // Salidas (gastos)
  compra_proveedor: 'Compra a Proveedor',
  servicios_publicos: 'Servicios Públicos',
  nomina: 'Nómina',
  transporte_domicilios: 'Transporte / Domicilios',
  arriendo: 'Arriendo',
  mantenimiento: 'Mantenimiento',
  otro_egreso: 'Otra Salida',
  // Entradas (ingresos manuales, distintos a una venta)
  abono_cliente: 'Abono de Cliente',
  capital_socio: 'Capital de Socio',
  devolucion_proveedor: 'Devolución de Proveedor',
  otro_ingreso: 'Otra Entrada'
};

// El desplegable de categoría solo debe mostrar las que tienen sentido para
// el tipo de movimiento elegido (una "Nómina" nunca es una entrada, un
// "Abono de Cliente" nunca es una salida).
const EGRESO_CATEGORIAS: GastoEgresoCategoria[] = [
  'compra_proveedor',
  'servicios_publicos',
  'nomina',
  'transporte_domicilios',
  'arriendo',
  'mantenimiento',
  'otro_egreso'
];

const INGRESO_CATEGORIAS: GastoIngresoCategoria[] = [
  'abono_cliente',
  'capital_socio',
  'devolucion_proveedor',
  'otro_ingreso'
];

interface UnifiedMovement {
  id: string;
  fecha: Date;
  tipo: 'ingreso' | 'egreso';
  descripcion: string;
  detalle: string;
  monto: number;
}

export const GastosScreen: React.FC = () => {
  const { salesHistory, gastos, addGasto } = usePOS();

  const [periodType, setPeriodType] = useState<PeriodType>('mes');
  const defaultRangeStart = useMemo(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
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

  const periodGastos = useMemo(
    () => gastos.filter((g) => {
      const t = g.fecha.getTime();
      return t >= periodRange.start.getTime() && t < periodRange.end.getTime();
    }),
    [gastos, periodRange]
  );

  const totalIngresos = useMemo(
    () => periodSales.reduce((acc, s) => acc + s.total, 0) + periodGastos.filter(g => g.tipo === 'ingreso').reduce((acc, g) => acc + g.monto, 0),
    [periodSales, periodGastos]
  );
  const totalEgresos = useMemo(
    () => periodGastos.filter(g => g.tipo === 'egreso').reduce((acc, g) => acc + g.monto, 0),
    [periodGastos]
  );
  const balance = totalIngresos - totalEgresos;

  // Unifica ventas (entradas) + gastos manuales (entradas/salidas) en un solo
  // libro de caja ordenado por fecha, coherente y fácil de leer.
  const movements: UnifiedMovement[] = useMemo(() => {
    const fromSales: UnifiedMovement[] = periodSales.map((s) => ({
      id: s.id,
      fecha: new Date(s.timestamp),
      tipo: 'ingreso',
      descripcion: `Venta ${s.receiptNumber}`,
      detalle: s.customer ? s.customer.name : 'Mostrador general',
      monto: s.total
    }));
    const fromGastos: UnifiedMovement[] = periodGastos.map((g) => ({
      id: g.id,
      fecha: g.fecha,
      tipo: g.tipo,
      descripcion: g.descripcion,
      detalle: CATEGORIA_LABELS[g.categoria],
      monto: g.monto
    }));
    return [...fromSales, ...fromGastos].sort((a, b) => b.fecha.getTime() - a.fecha.getTime());
  }, [periodSales, periodGastos]);

  // --- Formulario para registrar un nuevo movimiento manual ---
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formTipo, setFormTipo] = useState<'ingreso' | 'egreso'>('egreso');
  const [formCategoria, setFormCategoria] = useState<GastoCategoria>('compra_proveedor');
  const [formDescripcion, setFormDescripcion] = useState('');
  const [formMonto, setFormMonto] = useState('');

  const categoriasDisponibles: GastoCategoria[] = formTipo === 'egreso' ? EGRESO_CATEGORIAS : INGRESO_CATEGORIAS;

  const handleTipoChange = (tipo: 'ingreso' | 'egreso') => {
    setFormTipo(tipo);
    // Al cambiar el tipo, la categoría se reinicia a la primera opción
    // válida para ese tipo (una entrada no puede quedar con "Nómina", etc.).
    setFormCategoria(tipo === 'egreso' ? EGRESO_CATEGORIAS[0] : INGRESO_CATEGORIAS[0]);
  };

  const resetForm = () => {
    setFormTipo('egreso');
    setFormCategoria(EGRESO_CATEGORIAS[0]);
    setFormDescripcion('');
    setFormMonto('');
    setIsFormOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const monto = Number(formMonto);
    if (!formDescripcion.trim() || !monto || monto <= 0) return;

    addGasto({
      tipo: formTipo,
      categoria: formCategoria,
      descripcion: formDescripcion.trim(),
      monto
    });
    resetForm();
  };

  return (
    <div className="flex-1 p-6 lg:p-8 flex flex-col gap-6 overflow-y-auto bg-[#faf3e6]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#2a1a12] flex items-center gap-2">
            <Wallet className="w-6 h-6 text-[#7a0d0a]" />
            Gastos y Caja
          </h2>
          <p className="text-sm text-[#7a6552]">
            Entradas (ventas y otros ingresos) y salidas de caja, con balance del período
          </p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="px-4 py-2.5 bg-[#7a0d0a] hover:bg-[#4f0906] text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 cursor-pointer transition-all self-start"
        >
          <Plus className="w-4 h-4" />
          Registrar Movimiento
        </button>
      </div>

      {/* Formulario inline para registrar entrada/salida manual */}
      {isFormOpen && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-[#ddc9a3] shadow-xs p-5 flex flex-col gap-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#2a1a12]">Nuevo Movimiento de Caja</h3>
            <button
              type="button"
              onClick={resetForm}
              className="p-1 text-gray-400 hover:text-[#7a0d0a] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleTipoChange('egreso')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                formTipo === 'egreso' ? 'bg-[#7a0d0a] text-white shadow-sm' : 'bg-[#f3e7d0] text-[#6b4a30]'
              }`}
            >
              <ArrowDownCircle className="w-4 h-4" />
              Salida (Gasto)
            </button>
            <button
              type="button"
              onClick={() => handleTipoChange('ingreso')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                formTipo === 'ingreso' ? 'bg-[#3d3f10] text-white shadow-sm' : 'bg-[#f3e7d0] text-[#6b4a30]'
              }`}
            >
              <ArrowUpCircle className="w-4 h-4" />
              Entrada (Ingreso manual)
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-[#7a6552] uppercase">
                Categoría <span className="normal-case font-medium text-gray-400">({formTipo === 'egreso' ? 'de salida' : 'de entrada'})</span>
              </label>
              <select
                value={formCategoria}
                onChange={(e) => setFormCategoria(e.target.value as GastoCategoria)}
                className="border-2 border-[#ddc9a3] rounded-xl px-3 py-2 text-sm outline-none focus:border-[#7a0d0a] cursor-pointer"
              >
                {categoriasDisponibles.map((cat) => (
                  <option key={cat} value={cat}>{CATEGORIA_LABELS[cat]}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1 md:col-span-1">
              <label className="text-[11px] font-bold text-[#7a6552] uppercase">Descripción</label>
              <input
                type="text"
                value={formDescripcion}
                onChange={(e) => setFormDescripcion(e.target.value)}
                placeholder="Ej: Pago proveedor de quesos"
                required
                className="border-2 border-[#ddc9a3] rounded-xl px-3 py-2 text-sm outline-none focus:border-[#7a0d0a]"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-[#7a6552] uppercase">Monto (COP)</label>
              <input
                type="number"
                min={1}
                value={formMonto}
                onChange={(e) => setFormMonto(e.target.value)}
                placeholder="0"
                required
                className="border-2 border-[#ddc9a3] rounded-xl px-3 py-2 text-sm outline-none focus:border-[#7a0d0a]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="self-end px-5 py-2.5 bg-[#2a1a12] hover:bg-gray-800 text-white font-bold text-xs rounded-xl cursor-pointer transition-all"
          >
            Guardar Movimiento
          </button>
        </form>
      )}

      {/* Filtro Día / Mes / Año / Rango */}
      <PeriodFilterBar
        label="Ver caja por:"
        periodType={periodType}
        onPeriodTypeChange={setPeriodType}
        rangeStart={rangeStart}
        onRangeStartChange={setRangeStart}
        rangeEnd={rangeEnd}
        onRangeEndChange={setRangeEnd}
      />

      {/* KPIs: Entradas, Salidas, Balance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-[#ddc9a3] shadow-xs">
          <span className="text-xs font-bold text-[#7a6552] uppercase flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-[#3d3f10]" />
            Entradas del Período
          </span>
          <div className="mt-2 text-2xl font-bold text-[#3d3f10]">
            ${totalIngresos.toLocaleString('es-CO')}
          </div>
          <p className="text-xs text-gray-400 mt-1">Ventas + ingresos manuales</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#ddc9a3] shadow-xs">
          <span className="text-xs font-bold text-[#7a6552] uppercase flex items-center gap-1.5">
            <TrendingDown className="w-3.5 h-3.5 text-[#7a0d0a]" />
            Salidas del Período
          </span>
          <div className="mt-2 text-2xl font-bold text-[#7a0d0a]">
            ${totalEgresos.toLocaleString('es-CO')}
          </div>
          <p className="text-xs text-gray-400 mt-1">Gastos y compras registradas</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#ddc9a3] shadow-xs">
          <span className="text-xs font-bold text-[#7a6552] uppercase flex items-center gap-1.5">
            <Scale className="w-3.5 h-3.5 text-[#2a1a12]" />
            Balance del Período
          </span>
          <div className={`mt-2 text-2xl font-bold ${balance >= 0 ? 'text-[#2a1a12]' : 'text-[#7a0d0a]'}`}>
            ${balance.toLocaleString('es-CO')}
          </div>
          <p className="text-xs text-gray-400 mt-1">Entradas menos salidas</p>
        </div>
      </div>

      {/* Libro de movimientos unificado */}
      <div className="bg-white rounded-2xl shadow-xs border border-[#ddc9a3] overflow-hidden">
        <div className="p-6 border-b border-[#ddc9a3] flex items-center justify-between">
          <h3 className="text-lg font-bold text-[#2a1a12]">Movimientos de Caja</h3>
          <span className="text-xs bg-[#efe1c4] text-[#2a1a12] font-bold px-3 py-1 rounded-full">
            {movements.length} {movements.length === 1 ? 'movimiento' : 'movimientos'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#faf6ee] border-b border-[#ddc9a3]">
              <tr>
                <th className="px-6 py-3 text-xs font-bold text-[#7a6552] uppercase">Tipo</th>
                <th className="px-6 py-3 text-xs font-bold text-[#7a6552] uppercase">Fecha</th>
                <th className="px-6 py-3 text-xs font-bold text-[#7a6552] uppercase">Descripción</th>
                <th className="px-6 py-3 text-xs font-bold text-[#7a6552] uppercase">Detalle</th>
                <th className="px-6 py-3 text-xs font-bold text-[#7a6552] uppercase text-right">Monto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#efe1c4]">
              {movements.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-sm text-[#7a6552]">
                    No hay movimientos registrados en este período.
                  </td>
                </tr>
              )}
              {movements.map((m) => (
                <tr key={`${m.tipo}-${m.id}`} className="hover:bg-[#faf6ee]">
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 text-[10px] uppercase font-bold px-2.5 py-1 rounded-lg ${
                      m.tipo === 'ingreso' ? 'bg-[#e3e0bd] text-[#3d3f10]' : 'bg-[#ffdad6] text-[#7a0d0a]'
                    }`}>
                      {m.tipo === 'ingreso' ? <ArrowUpCircle className="w-3 h-3" /> : <ArrowDownCircle className="w-3 h-3" />}
                      {m.tipo === 'ingreso' ? 'Entrada' : 'Salida'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-500">
                    {m.fecha.toLocaleDateString('es-CO')} {m.fecha.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-[#2a1a12]">{m.descripcion}</td>
                  <td className="px-6 py-4 text-xs text-gray-500">{m.detalle}</td>
                  <td className={`px-6 py-4 text-right font-bold text-sm ${m.tipo === 'ingreso' ? 'text-[#3d3f10]' : 'text-[#7a0d0a]'}`}>
                    {m.tipo === 'ingreso' ? '+' : '-'}${m.monto.toLocaleString('es-CO')}
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
