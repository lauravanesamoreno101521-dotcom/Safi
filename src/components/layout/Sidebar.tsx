import React from 'react';
import { usePOS } from '../../context/POSContext';
import { 
  Store, 
  LayoutDashboard, 
  Barcode, 
  Package, 
  BarChart3, 
  Truck, 
  LogOut, 
  Plus 
} from 'lucide-react';
import { TabType } from '../../types';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab } = usePOS();

  const navItems: { id: TabType; label: string; icon: React.ReactNode }[] = [
    {
      id: 'pos',
      label: 'Punto de Venta',
      icon: <Barcode className="w-5 h-5" />
    },
    {
      id: 'inventario',
      label: 'Inventario',
      icon: <Package className="w-5 h-5" />
    },
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />
    },
    {
      id: 'reportes',
      label: 'Reportes',
      icon: <BarChart3 className="w-5 h-5" />
    },
    {
      id: 'proveedores',
      label: 'Proveedores',
      icon: <Truck className="w-5 h-5" />
    }
  ];

  return (
    <aside className="hidden lg:flex flex-col h-full py-6 px-3 gap-2 bg-[#eaf5fa] border-r border-[#dfbfba] w-64 shrink-0 shadow-xs z-30 select-none">
      {/* Brand & Sede badge */}
      <div className="flex flex-col gap-1 mb-6 px-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#9f3023] text-white flex items-center justify-center shadow-md">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <p className="font-bold text-sm text-[#9f3023] leading-tight">Caja Principal</p>
            <p className="text-[10px] text-[#586062] uppercase tracking-widest font-bold">Sede Norte</p>
          </div>
        </div>
      </div>

      {/* Primary Navigation */}
      <nav className="flex flex-col gap-1.5 flex-1">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all cursor-pointer w-full text-left ${
                isActive
                  ? 'bg-[#c04838] text-white font-bold shadow-sm'
                  : 'text-[#58413e] hover:bg-[#d9e4e9] hover:text-[#131d21]'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom actions matching both Dashboard and POS screenshots */}
      <div className="mt-auto pt-4 border-t border-[#dfbfba] flex flex-col gap-2">
        <button
          onClick={() => {
            setActiveTab('pos');
            // Al hacer clic en nuevo pedido redirige al punto de venta con input enfocado
          }}
          className="w-full py-2.5 bg-[#9f3023] text-white rounded-xl font-bold hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm">Nuevo Pedido</span>
        </button>

        <button
          onClick={() => {
            if (confirm('¿Deseas cerrar el turno o sesión actual?')) {
              alert('Turno en Caja Sede Norte respaldado exitosamente.');
            }
          }}
          className="flex items-center gap-3 px-4 py-2.5 text-[#ba1a1a] hover:bg-[#ffdad6] rounded-xl cursor-pointer transition-all w-full text-left text-sm font-medium"
        >
          <LogOut className="w-5 h-5" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
};
