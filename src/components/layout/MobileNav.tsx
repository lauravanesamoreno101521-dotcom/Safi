import React from 'react';
import { usePOS } from '../../context/POSContext';
import { LayoutDashboard, Barcode, Package, BarChart3, Users, Truck } from 'lucide-react';
import { TabType } from '../../types';

export const MobileNav: React.FC = () => {
  const { activeTab, setActiveTab } = usePOS();

  const navItems: { id: TabType; label: string; icon: React.ReactNode }[] = [
    {
      id: 'pos',
      label: 'POS',
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
      id: 'clientes',
      label: 'Clientes',
      icon: <Users className="w-5 h-5" />
    },
    {
      id: 'proveedores',
      label: 'Proveedores',
      icon: <Truck className="w-5 h-5" />
    }
  ];

  return (
    // overflow-x-auto es un respaldo: en pantallas muy angostas, si los 6
    // items no alcanzan a caber, la barra se desliza en vez de esconder items.
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#f3e7d0] flex items-center border-t border-[#ddc9a3] z-50 shadow-lg overflow-x-auto">
      {navItems.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex-1 min-w-[58px] shrink-0 flex flex-col items-center justify-center gap-1 cursor-pointer h-full px-1 transition-colors ${
              isActive ? 'text-[#7a0d0a] font-bold' : 'text-[#7a6552]'
            }`}
          >
            {item.icon}
            <span className="text-[9px] leading-none">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
