import React, { useEffect } from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';
import { supabase } from './lib/supabaseClient';
import { POSProvider, usePOS } from './context/POSContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { POSScreen } from './components/pos/POSScreen';
import { DashboardScreen } from './components/dashboard/DashboardScreen';
import { InventoryScreen } from './components/inventory/InventoryScreen';
import { ReportsScreen } from './components/reports/ReportsScreen';
import { SuppliersScreen } from './components/suppliers/SuppliersScreen';
import { ClientsScreen } from './components/clients/ClientsScreen';
import { GastosScreen } from './components/gastos/GastosScreen';
import { CustomerModal } from './components/modals/CustomerModal';
import { GrameraModal } from './components/modals/GrameraModal';
import { ReceiptModal } from './components/modals/ReceiptModal';

const AppContent: React.FC = () => {
  const { activeTab, isOnline, pendingSyncCount } = usePOS();

  // Prueba temporal de conexión a Supabase: revisa la consola del navegador (F12).
  // Se puede borrar este bloque una vez confirmemos que la conexión funciona.
  useEffect(() => {
    supabase
      .from('categorias')
      .select('*')
      .then(({ data, error }) => {
        if (error) {
          console.error('[Supabase] Error de conexión:', error.message);
        } else {
          console.log('[Supabase] Conexión exitosa. Categorías encontradas:', data);
        }
      });
  }, []);

  return (
    <div className="bg-[#faf3e6] text-[#2a1a12] font-sans overflow-hidden h-[100dvh] flex flex-col select-none">
      {/* Aviso de conexión: se guardan las ventas localmente sin internet y
          se sincronizan solas en cuanto vuelve la señal, para no perder
          trazabilidad. */}
      {(!isOnline || pendingSyncCount > 0) && (
        <div
          className={`shrink-0 flex items-center justify-center gap-2 py-1.5 px-3 text-[11px] font-bold text-white ${
            !isOnline ? 'bg-[#7a0d0a]' : 'bg-amber-600'
          }`}
        >
          {!isOnline ? (
            <>
              <WifiOff className="w-3.5 h-3.5" />
              <span>
                Sin conexión a internet — las ventas se están guardando localmente
                {pendingSyncCount > 0 ? ` (${pendingSyncCount} pendiente${pendingSyncCount === 1 ? '' : 's'})` : ''}.
              </span>
            </>
          ) : (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Sincronizando {pendingSyncCount} venta{pendingSyncCount === 1 ? '' : 's'} pendiente{pendingSyncCount === 1 ? '' : 's'}...</span>
            </>
          )}
        </div>
      )}

      {/* Top Header */}
      <Header />

      {/* Main Body */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Sidebar */}
        <Sidebar />

        {/* Dynamic Screen View based on activeTab */}
        <main className="flex-1 flex flex-col overflow-hidden pb-16 md:pb-0">
          {activeTab === 'pos' && <POSScreen />}
          {activeTab === 'dashboard' && <DashboardScreen />}
          {activeTab === 'inventario' && <InventoryScreen />}
          {activeTab === 'reportes' && <ReportsScreen />}
          {activeTab === 'gastos' && <GastosScreen />}
          {activeTab === 'clientes' && <ClientsScreen />}
          {activeTab === 'proveedores' && <SuppliersScreen />}
        </main>
      </div>

      {/* Mobile Navigation for smaller screens */}
      <MobileNav />

      {/* Modals */}
      <CustomerModal />
      <GrameraModal />
      <ReceiptModal />
    </div>
  );
};

export default function App() {
  return (
    <POSProvider>
      <AppContent />
    </POSProvider>
  );
}
