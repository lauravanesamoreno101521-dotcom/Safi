import React, { useState } from 'react';
import { usePOS } from '../../context/POSContext';
import { 
  Package, 
  Search, 
  Filter, 
  AlertTriangle, 
  Plus, 
  ShoppingCart, 
  Scale, 
  Check, 
  Edit, 
  Layers 
} from 'lucide-react';
import { Product } from '../../types';

export const InventoryScreen: React.FC = () => {
  const { products, addToCart, setActiveTab, openGrameraForProduct } = usePOS();
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [search, setSearch] = useState<string>('');
  const [showOnlyCritical, setShowOnlyCritical] = useState<boolean>(false);

  const categories = [
    { id: 'all', name: 'Todos los Productos' },
    { id: 'jamones_embutidos', name: 'Jamones y Embutidos' },
    { id: 'quesos', name: 'Quesos Artesanales' },
    { id: 'panaderia_gourmet', name: 'Panadería Gourmet' },
    { id: 'vinos_licores', name: 'Vinos y Licores' },
    { id: 'huevos_lacteos', name: 'Huevos y Lácteos' }
  ];

  const filteredProducts = products.filter(p => {
    const matchesCategory = filterCategory === 'all' || p.category === filterCategory;
    const matchesSearch = 
      p.name.toLowerCase().includes(search.toLowerCase()) || 
      p.code.toLowerCase().includes(search.toLowerCase());
    const matchesCritical = showOnlyCritical ? p.stock <= p.minStock : true;
    return matchesCategory && matchesSearch && matchesCritical;
  });

  const totalStockItems = products.reduce((acc, p) => acc + p.stock, 0);
  const criticalCount = products.filter(p => p.stock <= p.minStock).length;

  return (
    <div className="flex-1 p-6 lg:p-8 flex flex-col gap-6 overflow-y-auto bg-[#faf3e6]">
      {/* Top Header & Metrics */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#2a1a12]">Inventario y Catálogo</h2>
          <p className="text-sm text-[#7a6552]">
            Gestión en tiempo real de productos de mostrador y madurados
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowOnlyCritical(!showOnlyCritical)}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
              showOnlyCritical
                ? 'bg-[#ba1a1a] text-white shadow-md'
                : 'bg-[#ffdad6] text-[#93000a] hover:bg-[#ffdad6]/80'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Alerta Crítica ({criticalCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('pos')}
            className="px-4 py-2.5 bg-[#7a0d0a] hover:bg-[#4f0906] text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-2 cursor-pointer transition-colors"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Volver a Punto de Venta</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-xs border border-[#ddc9a3] flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por código o nombre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#f3e7d0] border border-[#ddc9a3] rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#7a0d0a]"
          />
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                filterCategory === cat.id
                  ? 'bg-[#2a1a12] text-white'
                  : 'bg-[#efe1c4] text-[#7a6552] hover:bg-[#e6d6b8]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredProducts.map((p) => {
          const isCritical = p.stock <= p.minStock;
          const isKg = p.unit === 'kg';

          return (
            <div
              key={p.id}
              className={`bg-white rounded-2xl border transition-all hover:shadow-md flex flex-col overflow-hidden ${
                isCritical
                  ? 'border-2 border-[#ba1a1a] shadow-xs'
                  : 'border-[#ddc9a3]'
              }`}
            >
              {/* Product Image */}
              <div className="h-44 bg-[#efe1c4] relative overflow-hidden group">
                <img
                  src={p.imageUrl}
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 bg-black/70 backdrop-blur-xs text-white text-[10px] font-mono rounded-lg font-bold">
                  {p.code}
                </span>

                {isCritical && (
                  <span className="absolute top-3 right-3 px-2.5 py-1 bg-[#ba1a1a] text-white text-[10px] font-bold rounded-lg flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    Bajo Stock
                  </span>
                )}
              </div>

              {/* Product Details */}
              <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                <div>
                  <h3 className="font-bold text-base text-[#2a1a12] leading-tight">
                    {p.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                    {p.description || 'Producto artesanal seleccionado para charcutería.'}
                  </p>
                </div>

                <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-gray-400 block">Precio de Venta</span>
                    <span className="font-bold text-base text-[#7a0d0a]">
                      ${p.price.toLocaleString('es-CO')} / {p.unit}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-gray-400 block">Stock actual</span>
                    <span
                      className={`font-mono font-bold text-sm ${
                        isCritical ? 'text-[#ba1a1a]' : 'text-[#2a1a12]'
                      }`}
                    >
                      {p.stock} {p.unit}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    onClick={() => {
                      if (isKg) {
                        openGrameraForProduct(p);
                      } else {
                        addToCart(p, 1);
                      }
                      setActiveTab('pos');
                    }}
                    className="py-2 bg-[#7a0d0a] hover:bg-[#4f0906] text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    {isKg ? <Scale className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                    <span>{isKg ? 'Pesar en POS' : '+1 a Caja'}</span>
                  </button>

                  <button
                    onClick={() => {
                      alert(`Mostrando ficha técnica y lote de curación para: ${p.name}`);
                    }}
                    className="py-2 bg-[#efe1c4] hover:bg-[#e6d6b8] text-[#6b4a30] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Lotes</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
