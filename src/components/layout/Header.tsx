import React, { useState, useEffect, useRef } from 'react';
import { usePOS } from '../../context/POSContext';
import { Search, Barcode, Bell, Settings, Wifi, WifiOff, Leaf } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    products,
    addToCart,
    openGrameraForProduct,
    grameraStatus
  } = usePOS();

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [scanFeedback, setScanFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // F2 key shortcut to focus barcode scanner input (as in screenshot script)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F2') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Un lector de código de barras funciona como un teclado: "escribe" el
  // código muy rápido y termina con Enter. Por eso basta con mantener este
  // campo enfocado mientras se está en Punto de Venta (sin necesidad de
  // ningún driver ni configuración especial) para que el escaneo funcione
  // en cuanto se conecte un lector físico. Mientras tanto, escribir el
  // código o SKU a mano y presionar Enter hace exactamente lo mismo.
  useEffect(() => {
    if (activeTab === 'pos') {
      searchInputRef.current?.focus();
    }
  }, [activeTab]);

  useEffect(() => {
    if (!scanFeedback) return;
    const timer = setTimeout(() => setScanFeedback(null), 2200);
    return () => clearTimeout(timer);
  }, [scanFeedback]);

  const handleBarcodeKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return;
    const code = searchQuery.trim();
    if (!code) return;

    const found = products.find(p => p.code.toLowerCase() === code.toLowerCase());

    if (found) {
      if (found.isWeightBased) {
        openGrameraForProduct(found);
      } else {
        addToCart(found);
      }
      setScanFeedback({ type: 'success', message: `Agregado: ${found.name}` });
    } else {
      setScanFeedback({ type: 'error', message: `Código no encontrado: "${code}"` });
    }

    setSearchQuery('');
    setIsSearchFocused(false);
    // Deja el campo listo para el siguiente escaneo/código
    requestAnimationFrame(() => searchInputRef.current?.focus());
  };

  const filteredProducts = searchQuery.trim() === ''
    ? []
    : products.filter(
        p =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.code.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5);

  const handleSelectProduct = (product: typeof products[0]) => {
    addToCart(product);
    setSearchQuery('');
    setIsSearchFocused(false);
  };

  return (
    <header className="flex justify-between items-center w-full px-3 md:px-8 h-16 bg-white border-b border-[#ddc9a3] z-50 shrink-0 shadow-xs">
      <div className="flex items-center gap-2 sm:gap-6 shrink-0">
        <h1
          onClick={() => setActiveTab('pos')}
          className="text-xl md:text-2xl font-bold cursor-pointer hover:opacity-90 transition-opacity flex items-baseline whitespace-nowrap"
        >
          {activeTab === 'dashboard' ? (
            <span className="text-[#2a1a12]">Panel de Control</span>
          ) : (
            <>
              <span className="hidden sm:inline text-[#2a1a12]">Salsamentaría&nbsp;</span>
              <span className="relative inline-flex items-baseline text-[#7a0d0a]">
                Saf
                <span className="relative inline-block text-[#3d3f10]">
                  {/* "i" en verde oliva, igual que en el logo. Sin punto: el punto se reemplaza por la hoja */}
                  ı
                  <Leaf
                    className="absolute -top-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 md:w-3 md:h-3 text-[#3d3f10] rotate-[15deg]"
                    strokeWidth={2.5}
                  />
                </span>
              </span>
            </>
          )}
        </h1>

        {/* Horizontal Navigation inside top bar (as shown in Punto de Venta screenshot) */}
        <div className="hidden md:flex gap-1">
          <nav className="flex gap-2">
            <button
              onClick={() => setActiveTab('pos')}
              className={`font-medium text-sm px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'pos'
                  ? 'text-[#7a0d0a] font-bold border-b-2 border-[#7a0d0a] bg-[#f5e2da]'
                  : 'text-[#7a6552] hover:bg-[#e6d6b8]/40'
              }`}
            >
              Punto de Venta
            </button>
            <button
              onClick={() => setActiveTab('inventario')}
              className={`font-medium text-sm px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'inventario'
                  ? 'text-[#7a0d0a] font-bold border-b-2 border-[#7a0d0a] bg-[#f5e2da]'
                  : 'text-[#7a6552] hover:bg-[#e6d6b8]/40'
              }`}
            >
              Inventario
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`font-medium text-sm px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'text-[#7a0d0a] font-bold border-b-2 border-[#7a0d0a] bg-[#f5e2da]'
                  : 'text-[#7a6552] hover:bg-[#e6d6b8]/40'
              }`}
            >
              Dashboard
            </button>
          </nav>
        </div>
      </div>

      {/* Integrated Search/Barcode Field (Prominent in POS screen, compact in Dashboard) */}
      <div className="flex-1 max-w-2xl px-3 md:px-8 relative">
        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7a0d0a] pointer-events-none">
            {activeTab === 'pos' ? (
              <Barcode className="w-5 h-5 font-bold" />
            ) : (
              <Search className="w-5 h-5 text-gray-400" />
            )}
          </div>
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
            onKeyDown={handleBarcodeKeyDown}
            placeholder={
              activeTab === 'pos'
                ? 'Escanear código o buscar producto... [F2]'
                : 'Buscar productos o ventas...'
            }
            className="w-full bg-[#f3e7d0] border-2 border-[#ddc9a3] rounded-full py-2.5 pl-12 pr-14 sm:pr-36 focus:ring-2 focus:ring-[#7a0d0a] focus:border-[#7a0d0a] focus:bg-white transition-all text-sm text-[#2a1a12] outline-none"
          />

          <div className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
            <span
              className={`px-2 sm:px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                grameraStatus === 'receiving'
                  ? 'bg-amber-500 text-white animate-pulse'
                  : 'bg-[#7a0d0a] text-white shadow-xs'
              }`}
            >
              {grameraStatus === 'receiving' ? (
                <>
                  <WifiOff className="w-3 h-3 animate-spin" />
                  <span className="hidden sm:inline">Leyendo...</span>
                </>
              ) : (
                <>
                  <Wifi className="w-3 h-3" />
                  <span className="hidden sm:inline">Gramera Conectada</span>
                </>
              )}
            </span>
          </div>

          {/* Quick Search Dropdown */}
          {isSearchFocused && filteredProducts.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-[#ddc9a3] py-2 z-50 overflow-hidden">
              <div className="px-4 py-1.5 text-[11px] font-bold text-[#7a6552] uppercase tracking-wider bg-gray-50 border-b border-gray-100">
                Coincidencias en Catálogo (Haz clic para agregar a Caja)
              </div>
              {filteredProducts.map((p) => (
                <div
                  key={p.id}
                  onMouseDown={() => handleSelectProduct(p)}
                  className="flex items-center justify-between px-4 py-2.5 hover:bg-[#f5e2da] cursor-pointer transition-colors border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      className="w-10 h-10 rounded-lg object-cover bg-gray-100 shrink-0"
                    />
                    <div>
                      <p className="text-sm font-bold text-[#2a1a12]">{p.name}</p>
                      <p className="text-xs text-gray-500">
                        Código: <span className="font-mono font-medium">{p.code}</span> • {p.isWeightBased ? 'Por peso (Kg)' : 'Por unidad'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-[#7a0d0a] text-sm">
                      ${p.price.toLocaleString('es-CO')} / {p.unit}
                    </span>
                    <p className="text-[11px] text-gray-400">Stock: {p.stock} {p.unit}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Aviso de resultado al escanear/ingresar un código y presionar Enter */}
          {scanFeedback && (
            <div
              className={`absolute left-0 right-0 top-full mt-2 px-4 py-2.5 rounded-xl text-xs font-bold z-50 border ${
                scanFeedback.type === 'success'
                  ? 'bg-[#f1f0dc] text-[#4a4a1f] border-[#d6d19a]'
                  : 'bg-[#ffdad6] text-[#7a0d0a] border-[#7a0d0a]/30'
              }`}
            >
              {scanFeedback.message}
            </div>
          )}
        </div>
      </div>

      {/* Right User Actions */}
      <div className="flex items-center gap-1 sm:gap-3 shrink-0">
        <button 
          title="Notificaciones de Stock"
          onClick={() => setActiveTab('inventario')}
          className="p-2 text-[#7a6552] hover:bg-[#e6d6b8]/40 rounded-full cursor-pointer active:scale-95 transition-all relative"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-[#7a0d0a] rounded-full"></span>
        </button>
        <button 
          title="Configuración de Tienda"
          onClick={() => setActiveTab('reportes')}
          className="p-2 text-[#7a6552] hover:bg-[#e6d6b8]/40 rounded-full cursor-pointer active:scale-95 transition-all"
        >
          <Settings className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2 pl-3 border-l border-[#ddc9a3]">
          <div className="w-10 h-10 rounded-full bg-[#f0d6ce] flex items-center justify-center overflow-hidden border-2 border-[#7a0d0a] shadow-xs shrink-0">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuClUCWmHf_DzKQZCtPUfLtBnSQLrx-8aOk3fZkqHTIjPqDPyeIfqCSp_H4vdaJyImy_3lYmfVGGrzxa5dpWTU9Atzl6N61F1xDjm9Vh7-KXbtttlSYD6RHP2Ttzf7evXA757L-OpJraht82NcOZ6aGGAA8WXWIJT3JFFPnI2I6CNGaVBLmq02z4jJ6TrPANNzSEAmcrZweCLgBCfX__pbPhoggSc22X532MQYZ8u1g8YKGkfrcHWGvn"
              alt="Admin Salsamentaría"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="font-bold text-sm text-[#2a1a12] hidden lg:block">Admin Salsamentaría</span>
        </div>
      </div>
    </header>
  );
};
