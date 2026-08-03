import React from 'react';
import { POSProvider, usePOS } from './context/POSContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { POSScreen } from './components/pos/POSScreen';
import { DashboardScreen } from './components/dashboard/DashboardScreen';
import { InventoryScreen } from './components/inventory/InventoryScreen';
import { ReportsScreen } from './components/reports/ReportsScreen';
import { SuppliersScreen } from './components/suppliers/SuppliersScreen';
import { CustomerModal } from './components/modals/CustomerModal';
import { GrameraModal } from './components/modals/GrameraModal';
import { ReceiptModal } from './components/modals/ReceiptModal';

const AppContent: React.FC = () => {
  const { activeTab } = usePOS();

  return (
    <div className="bg-[#f1fbff] text-[#131d21] font-sans overflow-hidden h-screen flex flex-col select-none">
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
