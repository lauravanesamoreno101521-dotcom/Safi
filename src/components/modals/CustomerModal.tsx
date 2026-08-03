import React, { useState } from 'react';
import { usePOS } from '../../context/POSContext';
import { Customer } from '../../types';
import { X, UserPlus, Check, Building2, User, Award } from 'lucide-react';

export const CustomerModal: React.FC = () => {
  const {
    isCustomerModalOpen,
    setIsCustomerModalOpen,
    selectedCustomer,
    setSelectedCustomer,
    customers,
    addCustomer
  } = usePOS();

  const [search, setSearch] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    document: '',
    phone: '',
    type: 'general' as Customer['type']
  });

  if (!isCustomerModalOpen) return null;

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.document.includes(search)
  );

  const handleCreateNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomer.name || !newCustomer.document) return;
    const created: Customer = {
      id: `cust-${Date.now()}`,
      name: newCustomer.name,
      document: newCustomer.document,
      phone: newCustomer.phone,
      type: newCustomer.type
    };
    addCustomer(created);
    setSelectedCustomer(created);
    setIsCustomerModalOpen(false);
    setIsCreating(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-[#ddc9a3] overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-[#f3e7d0] border-b border-[#ddc9a3] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-[#7a0d0a]" />
            <h3 className="font-bold text-lg text-[#2a1a12]">Asignar Cliente a Ticket</h3>
          </div>
          <button
            onClick={() => setIsCustomerModalOpen(false)}
            className="p-1 rounded-full hover:bg-gray-200 transition-colors text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {!isCreating ? (
            <>
              <div>
                <input
                  type="text"
                  placeholder="Buscar por nombre, NIT o cédula..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full px-4 py-3 bg-[#faf3e6] border border-[#ddc9a3] rounded-xl text-sm focus:ring-2 focus:ring-[#7a0d0a] outline-none"
                />
              </div>

              {selectedCustomer && (
                <div className="p-3 bg-[#f5e2da] border border-[#7a0d0a] rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-[#7a0d0a] uppercase">Cliente actualmente asignado:</span>
                    <p className="font-bold text-sm text-[#2a1a12]">{selectedCustomer.name}</p>
                    <p className="text-xs text-gray-600">NIT/CC: {selectedCustomer.document}</p>
                  </div>
                  <button
                    onClick={() => setSelectedCustomer(null)}
                    className="text-xs text-[#ba1a1a] font-bold underline hover:opacity-80"
                  >
                    Desasignar
                  </button>
                </div>
              )}

              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                <p className="text-xs font-bold text-gray-500 uppercase">Clientes Registrados:</p>
                {filtered.map((cust) => {
                  const isSelected = selectedCustomer?.id === cust.id;
                  return (
                    <div
                      key={cust.id}
                      onClick={() => {
                        setSelectedCustomer(cust);
                        setIsCustomerModalOpen(false);
                      }}
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        isSelected
                          ? 'border-[#7a0d0a] bg-[#f5e2da]'
                          : 'border-[#ddc9a3] hover:bg-[#f3e7d0]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-white border border-[#ddc9a3] flex items-center justify-center text-[#7a0d0a]">
                          {cust.type === 'empresa' ? (
                            <Building2 className="w-5 h-5" />
                          ) : cust.type === 'frecuente' ? (
                            <Award className="w-5 h-5" />
                          ) : (
                            <User className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#2a1a12]">{cust.name}</p>
                          <p className="text-xs text-gray-500">
                            NIT/CC: {cust.document} {cust.phone && `• ${cust.phone}`}
                          </p>
                        </div>
                      </div>
                      {isSelected && <Check className="w-5 h-5 text-[#7a0d0a]" />}
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 border-t border-gray-100 flex justify-between items-center">
                <span className="text-xs text-gray-500">¿El cliente no está registrado?</span>
                <button
                  onClick={() => setIsCreating(true)}
                  className="px-4 py-2 bg-[#2a1a12] text-white rounded-xl text-xs font-bold hover:bg-gray-800 transition-colors"
                >
                  + Crear Nuevo Cliente
                </button>
              </div>
            </>
          ) : (
            <form onSubmit={handleCreateNew} className="space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-sm font-bold text-[#2a1a12]">Nuevo Registro de Cliente</span>
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="text-xs text-[#7a0d0a] underline font-bold"
                >
                  ← Volver a lista
                </button>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Nombre o Razón Social *</label>
                <input
                  required
                  type="text"
                  placeholder="Ej. Restaurante Gourmet S.A.S"
                  value={newCustomer.name}
                  onChange={e => setNewCustomer({ ...newCustomer, name: e.target.value })}
                  className="w-full px-3 py-2 border border-[#ddc9a3] rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">NIT o Cédula *</label>
                <input
                  required
                  type="text"
                  placeholder="Ej. 900.412.332-1"
                  value={newCustomer.document}
                  onChange={e => setNewCustomer({ ...newCustomer, document: e.target.value })}
                  className="w-full px-3 py-2 border border-[#ddc9a3] rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Teléfono</label>
                <input
                  type="text"
                  placeholder="Ej. 310 458 9021"
                  value={newCustomer.phone}
                  onChange={e => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-[#ddc9a3] rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Tipo de Cliente</label>
                <select
                  value={newCustomer.type}
                  onChange={e => setNewCustomer({ ...newCustomer, type: e.target.value as any })}
                  className="w-full px-3 py-2 border border-[#ddc9a3] rounded-lg text-sm"
                >
                  <option value="general">Cliente General / Mostrador</option>
                  <option value="empresa">Empresa / Restaurante (Factura Electrónica)</option>
                  <option value="frecuente">Cliente Frecuente (VIP)</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-[#7a0d0a] text-white font-bold rounded-xl text-sm shadow-md hover:bg-[#4f0906]"
              >
                Guardar y Asignar a Venta
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
