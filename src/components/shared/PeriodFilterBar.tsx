import React from 'react';
import { PeriodType } from '../../lib/salesAnalytics';

const PERIOD_LABELS: Record<PeriodType, string> = {
  dia: 'Día',
  mes: 'Mes',
  anio: 'Año',
  rango: 'Rango personalizado'
};

export function toDateInputValue(date: Date): string {
  return date.toISOString().slice(0, 10);
}

interface PeriodFilterBarProps {
  label?: string;
  periodType: PeriodType;
  onPeriodTypeChange: (type: PeriodType) => void;
  rangeStart: string;
  onRangeStartChange: (value: string) => void;
  rangeEnd: string;
  onRangeEndChange: (value: string) => void;
}

/** Barra de filtro Día / Mes / Año / Rango personalizado, compartida entre
 * Dashboard y Clientes (y cualquier otra pantalla de analítica futura). */
export const PeriodFilterBar: React.FC<PeriodFilterBarProps> = ({
  label = 'Ver por:',
  periodType,
  onPeriodTypeChange,
  rangeStart,
  onRangeStartChange,
  rangeEnd,
  onRangeEndChange
}) => {
  return (
    <div className="bg-white shadow-xs rounded-2xl border border-[#ddc9a3] p-4 flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
      <span className="text-xs font-bold text-[#7a6552] uppercase tracking-wider shrink-0">
        {label}
      </span>
      <div className="flex gap-2 flex-wrap">
        {(Object.keys(PERIOD_LABELS) as PeriodType[]).map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => onPeriodTypeChange(type)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              periodType === type
                ? 'bg-[#7a0d0a] text-white shadow-sm'
                : 'bg-[#f3e7d0] text-[#6b4a30] hover:bg-[#e6d6b8]'
            }`}
          >
            {PERIOD_LABELS[type]}
          </button>
        ))}
      </div>
      {periodType === 'rango' && (
        <div className="flex items-center gap-2 md:ml-auto flex-wrap">
          <input
            type="date"
            value={rangeStart}
            onChange={(e) => onRangeStartChange(e.target.value)}
            max={rangeEnd}
            className="text-xs font-medium border-2 border-[#ddc9a3] rounded-lg px-2 py-1.5 text-[#2a1a12] outline-none focus:border-[#7a0d0a] cursor-pointer"
          />
          <span className="text-xs text-[#7a6552]">a</span>
          <input
            type="date"
            value={rangeEnd}
            onChange={(e) => onRangeEndChange(e.target.value)}
            min={rangeStart}
            max={toDateInputValue(new Date())}
            className="text-xs font-medium border-2 border-[#ddc9a3] rounded-lg px-2 py-1.5 text-[#2a1a12] outline-none focus:border-[#7a0d0a] cursor-pointer"
          />
        </div>
      )}
    </div>
  );
};
