import React, { useState } from 'react';
import { usePOS } from '../../context/POSContext';
import { Scale, Check, X, RefreshCw } from 'lucide-react';

export const GrameraModal: React.FC = () => {
  const { weighingProduct, closeGramera, addToCart } = usePOS();
  const [customWeightGrams, setCustomWeightGrams] = useState<number>(345); // default 345 grams (0.345 kg) as seen in screenshot

  if (!weighingProduct) return null;

  const weightInKg = Number((customWeightGrams / 1000).toFixed(3));
  const estimatedPrice = Math.round(weightInKg * weighingProduct.price);

  const handleConfirmWeight = () => {
    addToCart(weighingProduct, weightInKg);
    closeGramera();
  };

  const presetWeights = [100, 150, 250, 345, 500, 1000];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-[#dfbfba] overflow-hidden">
        {/* Top bar */}
        <div className="bg-[#131d21] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#9f3023] flex items-center justify-center">
              <Scale className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base">Gramera Digital RS232</h3>
              <p className="text-[11px] text-gray-300">Conectada al Punto de Venta • Canal 1</p>
            </div>
          </div>
          <button
            onClick={closeGramera}
            className="p-1 rounded-full hover:bg-white/10 transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Product display */}
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4 p-3 bg-[#f8fafb] rounded-2xl border border-[#dfbfba]">
            <img
              src={weighingProduct.imageUrl}
              alt={weighingProduct.name}
              className="w-14 h-14 rounded-xl object-cover"
            />
            <div>
              <p className="font-bold text-[#131d21]">{weighingProduct.name}</p>
              <p className="text-xs text-gray-500">
                Precio base: <span className="font-bold text-[#9f3023]">${weighingProduct.price.toLocaleString('es-CO')} / Kg</span>
              </p>
            </div>
          </div>

          {/* LCD Weight Screen */}
          <div className="bg-[#1e293b] rounded-2xl p-5 border-4 border-gray-300 shadow-inner text-center relative overflow-hidden">
            <span className="absolute top-2 left-3 text-[10px] text-emerald-400 font-mono tracking-widest uppercase">
              PESO ESTABLE [ST]
            </span>
            <div className="text-5xl font-mono font-black text-emerald-400 tracking-wider py-2">
              {weightInKg.toFixed(3)}
              <span className="text-lg ml-1 text-emerald-300">KG</span>
            </div>
            <div className="text-xs text-gray-400 border-t border-gray-700 pt-2 flex justify-between">
              <span>Tara: 0.000 kg</span>
              <span className="text-emerald-400 font-bold">
                Valor Total: ${estimatedPrice.toLocaleString('es-CO')}
              </span>
            </div>
          </div>

          {/* Preset Buttons */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
              Pesos Rápidos / Frecuentes en Gramos:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {presetWeights.map(grams => (
                <button
                  key={grams}
                  type="button"
                  onClick={() => setCustomWeightGrams(grams)}
                  className={`py-2 rounded-xl border text-xs font-bold transition-all ${
                    customWeightGrams === grams
                      ? 'bg-[#9f3023] text-white border-[#9f3023] shadow-xs'
                      : 'bg-white text-[#131d21] border-[#dfbfba] hover:bg-[#fff2f0]'
                  }`}
                >
                  {grams}g ({grams / 1000} kg)
                </button>
              ))}
            </div>
          </div>

          {/* Custom Weight Range slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-gray-700">
              <span>Simular Peso Manual en Gramos:</span>
              <span className="text-[#9f3023]">{customWeightGrams} gramos</span>
            </div>
            <input
              type="range"
              min="20"
              max="2500"
              step="5"
              value={customWeightGrams}
              onChange={e => setCustomWeightGrams(Number(e.target.value))}
              className="w-full accent-[#9f3023]"
            />
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={() => setCustomWeightGrams(Math.floor(80 + Math.random() * 800))}
              className="py-3 px-4 rounded-xl border border-[#dfbfba] text-xs font-bold text-[#131d21] hover:bg-gray-100 flex items-center justify-center gap-1.5"
            >
              <RefreshCw className="w-4 h-4" />
              Simular Otra Báscula
            </button>

            <button
              type="button"
              onClick={handleConfirmWeight}
              className="py-3 px-4 rounded-xl bg-[#9f3023] hover:bg-[#881f14] text-white text-xs font-bold shadow-md flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              Enviar a POS (${estimatedPrice.toLocaleString('es-CO')})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
