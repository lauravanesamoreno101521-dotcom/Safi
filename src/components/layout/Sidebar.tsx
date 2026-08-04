import React, { useState } from 'react';
import { usePOS } from '../../context/POSContext';
import {
  Store,
  LayoutDashboard,
  Barcode,
  Package,
  BarChart3,
  Users,
  Truck,
  LogOut,
  Plus,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { TabType } from '../../types';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab } = usePOS();
  const [collapsed, setCollapsed] = useState(false);

  const navItems: { id: TabType; label: string; icon: React.ReactNode }[] = [
    {
      id: 'pos',
      label: 'Punto de Venta',
      icon: <Barcode className="w-5 h-5 shrink-0" />
    },
    {
      id: 'inventario',
      label: 'Inventario',
      icon: <Package className="w-5 h-5 shrink-0" />
    },
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-5 h-5 shrink-0" />
    },
    {
      id: 'reportes',
      label: 'Reportes',
      icon: <BarChart3 className="w-5 h-5 shrink-0" />
    },
    {
      id: 'clientes',
      label: 'Clientes',
      icon: <Users className="w-5 h-5 shrink-0" />
    },
    {
      id: 'proveedores',
      label: 'Proveedores',
      icon: <Truck className="w-5 h-5 shrink-0" />
    }
  ];

  return (
    <aside
      className={`hidden lg:flex flex-col h-full py-6 px-3 gap-2 bg-[#f3e7d0] border-r border-[#ddc9a3] shrink-0 shadow-xs z-30 select-none relative transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Botón para contraer / expandir el panel */}
      <button
        type="button"
        onClick={() => setCollapsed((c) => !c)}
        title={collapsed ? 'Expandir menú' : 'Contraer menú'}
        className="absolute top-7 -right-3 w-6 h-6 rounded-full bg-white border border-[#ddc9a3] flex items-center justify-center text-[#7a0d0a] shadow-xs hover:bg-[#f5e2da] cursor-pointer z-10"
      >
        {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>

      {/* Brand & Sede badge */}
      <div className={`flex items-center gap-3 mb-6 ${collapsed ? 'justify-center px-0' : 'px-3'}`}>
        <div className="w-10 h-10 rounded-xl bg-[#7a0d0a] text-white flex items-center justify-center shadow-md shrink-0">
          <Store className="w-6 h-6" />
        </div>
        {!collapsed && (
          <div>
            <p className="font-bold text-sm text-[#7a0d0a] leading-tight whitespace-nowrap">Caja Principal</p>
            <p className="text-[10px] text-[#7a6552] uppercase tracking-widest font-bold whitespace-nowrap">Sede Norte</p>
          </div>
        )}
      </div>

      {/* Primary Navigation */}
      <nav className="flex flex-col gap-1.5 flex-1">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              title={collapsed ? item.label : undefined}
              className={`flex items-center rounded-xl font-medium text-sm transition-all cursor-pointer w-full ${
                collapsed ? 'justify-center px-0 py-3' : 'gap-3 px-4 py-3 text-left'
              } ${
                isActive
                  ? 'bg-[#a83a2c] text-white font-bold shadow-sm'
                  : 'text-[#6b4a30] hover:bg-[#e6d8bc] hover:text-[#2a1a12]'
              }`}
            >
              {item.icon}
              {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Bottom actions matching both Dashboard and POS screenshots */}
      <div className="mt-auto pt-4 border-t border-[#ddc9a3] flex flex-col gap-2">
        <button
          onClick={() => {
            setActiveTab('pos');
            // Al hacer clic en nuevo pedido redirige al punto de venta con input enfocado
          }}
          title={collapsed ? 'Nuevo Pedido' : undefined}
          className="w-full py-2.5 bg-[#7a0d0a] text-white rounded-xl font-bold hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4 shrink-0" />
          {!collapsed && <span className="text-sm whitespace-nowrap">Nuevo Pedido</span>}
        </button>

        <button
          onClick={() => {
            if (confirm('¿Deseas cerrar el turno o sesión actual?')) {
              alert('Turno en Caja Sede Norte respaldado exitosamente.');
            }
          }}
          title={collapsed ? 'Cerrar Sesión' : undefined}
          className={`flex items-center text-[#ba1a1a] hover:bg-[#ffdad6] rounded-xl cursor-pointer transition-all w-full text-sm font-medium ${
            collapsed ? 'justify-center px-0 py-2.5' : 'gap-3 px-4 py-2.5 text-left'
          }`}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span className="whitespace-nowrap">Cerrar Sesión</span>}
        </button>
      </div>
    </aside>
  );
};
