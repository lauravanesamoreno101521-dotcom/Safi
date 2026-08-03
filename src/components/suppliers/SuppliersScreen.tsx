import React from 'react';
import { MOCK_SUPPLIERS } from '../../data/mockData';
import { Truck, Phone, User, Calendar, Plus, ExternalLink } from 'lucide-react';

export const SuppliersScreen: React.FC = () => {
  return (
    <div className="flex-1 p-6 lg:p-8 flex flex-col gap-6 overflow-y-auto bg-[#faf3e6]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#2a1a12]">Directorio de Proveedores</h2>
          <p className="text-sm text-[#7a6552]">
            Madurados ibéricos, quesos artesanales y abarrotes gourmet
          </p>
        </div>

        <button
          onClick={() => alert('Formulario para registrar nuevo proveedor o pedido mayorista.')}
          className="px-4 py-2.5 bg-[#7a0d0a] hover:bg-[#4f0906] text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 cursor-pointer transition-colors w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>+ Nuevo Proveedor</span>
        </button>
      </div>

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_SUPPLIERS.map((sup) => (
          <div
            key={sup.id}
            className="bg-white rounded-2xl p-6 border border-[#ddc9a3] shadow-xs flex flex-col justify-between gap-4"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-[#f5e2da] text-[#7a0d0a] flex items-center justify-center">
                    <Truck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-[#2a1a12]">{sup.name}</h3>
                    <p className="text-xs text-gray-400">NIT: {sup.nit}</p>
                  </div>
                </div>
                <span className="text-[10px] bg-[#e3e0bd] text-[#3f3d15] font-bold px-2 py-0.5 rounded-full uppercase">
                  {sup.status}
                </span>
              </div>

              <div className="mt-4 space-y-2 border-t border-gray-100 pt-3">
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <span className="font-bold text-gray-400 w-24">Categoría:</span>
                  <span className="font-medium text-[#2a1a12]">{sup.category}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <span className="font-bold text-gray-400 w-24">Contacto:</span>
                  <span>{sup.contactPerson}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <span className="font-bold text-gray-400 w-24">Teléfono:</span>
                  <span className="font-mono">{sup.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <span className="font-bold text-gray-400 w-24">Último Pedido:</span>
                  <span>{sup.lastOrder}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
              <button
                onClick={() => alert(`Llamando o contactando a: ${sup.contactPerson} - ${sup.phone}`)}
                className="px-3 py-1.5 bg-[#efe1c4] hover:bg-[#e6d6b8] text-[#2a1a12] rounded-lg text-xs font-bold transition-colors"
              >
                Llamar
              </button>
              <button
                onClick={() => alert(`Generando orden de compra hacia ${sup.name}...`)}
                className="px-3 py-1.5 bg-[#f5e2da] hover:bg-[#a83a2c] hover:text-white text-[#7a0d0a] rounded-lg text-xs font-bold transition-colors"
              >
                Pedir Stock
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
