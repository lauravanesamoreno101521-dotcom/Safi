import React from 'react';
import { usePOS } from '../../context/POSContext';
import { 
  ShoppingCart, 
  Trash2, 
  UserPlus, 
  Minus, 
  Plus, 
  Printer, 
  Pause, 
  FileText, 
  CheckCircle2, 
  CreditCard, 
  QrCode, 
  Banknote, 
  Scale, 
  Sparkles, 
  ChevronRight,
  Egg,
  Wine,
  Utensils,
  Sandwich,
  Fish,
  Edit3
} from 'lucide-react';
import { Product } from '../../types';

export const POSScreen: React.FC = () => {
  const {
    products,
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    tax,
    total,
    paymentMethod,
    setPaymentMethod,
    cashReceived,
    setCashReceived,
    change,
    selectedCustomer,
    setIsCustomerModalOpen,
    completeSale,
    suspendCurrentSale,
    generateQuotation,
    openGrameraForProduct
  } = usePOS();

  // Favorite cards matching the 6 items in the screenshot bento
  const favoriteItems: { id: string; name: string; code: string; icon: React.ReactNode }[] = [
    {
      id: 'fav-1',
      name: 'Queso Campesino',
      code: 'QC-1105',
      icon: <Edit3 className="w-7 h-7 text-[#9f3023]" />
    },
    {
      id: 'fav-2',
      name: 'Jamón Serrano',
      code: 'JS-4022',
      icon: <Sandwich className="w-7 h-7 text-[#9f3023]" />
    },
    {
      id: 'fav-3',
      name: 'Salame Milano',
      code: 'SM-9901',
      icon: <Utensils className="w-7 h-7 text-[#9f3023]" />
    },
    {
      id: 'fav-4',
      name: 'Pan Artesanal',
      code: 'PA-5503',
      icon: <Sandwich className="w-7 h-7 text-[#9f3023]" />
    },
    {
      id: 'fav-5',
      name: 'Vino Tinto',
      code: 'VT-8802',
      icon: <Wine className="w-7 h-7 text-[#9f3023]" />
    },
    {
      id: 'fav-6',
      name: 'Huevos AA',
      code: 'HU-2201',
      icon: <Egg className="w-7 h-7 text-[#9f3023]" />
    }
  ];

  const handleSelectFavorite = (code: string) => {
    const found = products.find(p => p.code === code);
    if (found) {
      addToCart(found);
    }
  };

  const totalItemsCount = cart.reduce((acc, item) => {
    return acc + (item.product.unit === 'unid' ? item.quantity : 1);
  }, 0);

  return (
    <div className="flex-1 flex flex-col md:flex-row bg-[#f1fbff] p-4 gap-4 overflow-hidden">
      {/* Left Side: Cart and Favorites */}
      <div className="flex-1 flex flex-col gap-4 min-w-0 overflow-hidden">
        {/* Quick Access Favorites (Bento Style from screenshot) */}
        <section className="bg-white rounded-2xl shadow-xs border border-[#dfbfba] p-4 shrink-0 overflow-x-auto">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-xs text-[#586062] uppercase tracking-wider">
              Favoritos Rápidos
            </h3>
            <span className="text-[#9f3023] text-[10px] font-bold tracking-wider flex items-center gap-1 cursor-pointer hover:underline">
              DESLIZA PARA VER MÁS →
            </span>
          </div>
          <div className="flex gap-4 pb-1">
            {favoriteItems.map((fav) => {
              const prod = products.find(p => p.code === fav.code);
              return (
                <button
                  key={fav.id}
                  onClick={() => handleSelectFavorite(fav.code)}
                  className="flex flex-col items-center justify-center gap-2 p-3 bg-[#e4f0f4] hover:bg-[#c04838] hover:text-white transition-all rounded-xl min-w-[100px] group border border-transparent hover:border-[#9f3023] cursor-pointer shadow-xs active:scale-95"
                >
                  <span className="group-hover:scale-110 transition-transform">
                    {fav.icon}
                  </span>
                  <span className="text-xs font-bold text-center leading-tight">
                    {fav.name}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Active Cart Section */}
        <section className="flex-1 bg-white rounded-2xl shadow-xs border border-[#dfbfba] flex flex-col overflow-hidden">
          {/* Cart Header */}
          <div className="px-6 py-4 bg-[#dfeaef] border-b border-[#dfbfba] flex justify-between items-center shrink-0">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-6 h-6 text-[#9f3023]" />
              <h2 className="text-xl font-bold text-[#131d21]">Carrito Actual</h2>
            </div>
            <span className="bg-[#131d21] text-white px-3 py-1 rounded-full text-xs font-bold shadow-xs">
              {cart.length} {cart.length === 1 ? 'Ítem' : 'Ítems'}
            </span>
          </div>

          {/* Table Container */}
          <div className="flex-1 overflow-y-auto">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-gray-400 gap-3">
                <ShoppingCart className="w-16 h-16 stroke-1 text-gray-300" />
                <p className="text-base font-bold text-[#586062]">El carrito está vacío</p>
                <p className="text-xs max-w-sm">
                  Escanea un producto con código de barras, selecciónalo de los Favoritos Rápidos o búscalo por nombre.
                </p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-white z-10 border-b border-[#dfbfba]">
                  <tr>
                    <th className="px-6 py-3 text-xs font-bold text-[#586062] uppercase tracking-wider">
                      Producto
                    </th>
                    <th className="px-6 py-3 text-xs font-bold text-[#586062] uppercase tracking-wider">
                      Precio/Unid
                    </th>
                    <th className="px-6 py-3 text-xs font-bold text-[#586062] uppercase tracking-wider text-center">
                      Cantidad / Peso
                    </th>
                    <th className="px-6 py-3 text-xs font-bold text-[#586062] uppercase tracking-wider text-right">
                      Subtotal
                    </th>
                    <th className="px-6 py-3 w-12"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e4f0f4]">
                  {cart.map((item) => {
                    const isKg = item.product.unit === 'kg';
                    const step = isKg ? 0.050 : 1;
                    return (
                      <tr
                        key={item.product.id}
                        className="hover:bg-[#f8fafb] transition-colors group"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-[#e4f0f4] overflow-hidden shrink-0 border border-gray-200">
                              <img
                                src={item.product.imageUrl}
                                alt={item.product.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-bold text-[#131d21] text-sm md:text-base">
                                {item.product.name}
                              </p>
                              <p className="text-xs text-[#586062]">
                                ID: {item.product.code}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-[#58413e]">
                          ${item.product.price.toLocaleString('es-CO')} / {isKg ? 'Kg' : 'Unid'}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.product.id, item.quantity - step)}
                              className="w-8 h-8 rounded-full border border-[#dfbfba] flex items-center justify-center hover:bg-[#c04838] hover:text-white transition-all cursor-pointer"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>

                            {/* Click on weight badge opens Bluetooth scale simulator */}
                            <button
                              type="button"
                              onClick={() => {
                                if (isKg) {
                                  openGrameraForProduct(item.product);
                                }
                              }}
                              title={isKg ? "Haz clic para pesar en Gramera RS232" : "Unidades"}
                              className={`border font-bold px-4 py-1.5 rounded-xl text-base min-w-[110px] text-center transition-all flex items-center justify-center gap-1 ${
                                isKg
                                  ? 'bg-[#c04838]/10 border-[#9f3023] text-[#9f3023] hover:bg-[#c04838]/20 cursor-pointer'
                                  : 'bg-white border-[#dfbfba] text-[#131d21]'
                              }`}
                            >
                              <span>{item.quantity}</span>
                              <span className="text-xs font-normal">
                                {isKg ? 'kg' : 'uds'}
                              </span>
                              {isKg && <Scale className="w-3.5 h-3.5 ml-0.5 text-[#9f3023]" />}
                            </button>

                            <button
                              type="button"
                              onClick={() => updateQuantity(item.product.id, item.quantity + step)}
                              className="w-8 h-8 rounded-full border border-[#dfbfba] flex items-center justify-center hover:bg-[#c04838] hover:text-white transition-all cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-base text-[#131d21]">
                          ${item.subtotal.toLocaleString('es-CO')}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-[#dfbfba] hover:text-[#ba1a1a] transition-colors p-1.5 rounded-lg hover:bg-[#ffdad6]/50 cursor-pointer"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Cart Footer Actions */}
          <div className="p-4 border-t border-[#dfbfba] flex justify-between items-center bg-[#eaf5fa] shrink-0">
            <button
              type="button"
              onClick={() => {
                if (cart.length > 0 && confirm('¿Deseas vaciar todos los ítems del carrito?')) {
                  clearCart();
                }
              }}
              disabled={cart.length === 0}
              className="flex items-center gap-2 text-[#ba1a1a] font-bold hover:bg-[#ffdad6] px-4 py-2 rounded-xl transition-all disabled:opacity-40 cursor-pointer text-sm"
            >
              <Trash2 className="w-4 h-4" />
              <span>Vaciar Carrito</span>
            </button>

            <button
              type="button"
              onClick={() => setIsCustomerModalOpen(true)}
              className="flex items-center gap-2 text-[#586062] font-bold hover:bg-[#dae1e3] px-4 py-2 rounded-xl transition-all cursor-pointer text-sm bg-white border border-[#dfbfba] shadow-xs"
            >
              <UserPlus className="w-4 h-4 text-[#9f3023]" />
              <span>
                {selectedCustomer ? selectedCustomer.name : 'Asignar Cliente'}
              </span>
            </button>
          </div>
        </section>
      </div>

      {/* Right Side: Summary and Checkout */}
      <div className="w-full md:w-96 flex flex-col gap-4 shrink-0">
        {/* Summary Card (Dark Slate matching screenshot) */}
        <section className="bg-[#283236] text-white rounded-2xl shadow-lg p-6 flex flex-col gap-6">
          <div>
            <h3 className="text-[#dde4e6] text-xs uppercase tracking-widest font-bold mb-1">
              Resumen de Venta
            </h3>
            <div className="flex justify-between items-baseline">
              <span className="text-3xl font-black tracking-tight">
                ${total.toLocaleString('es-CO')}
              </span>
              <span className="text-[#dde4e6] font-medium text-sm">Pesos (COP)</span>
            </div>
          </div>

          <div className="space-y-3 border-t border-white/10 pt-4">
            <div className="flex justify-between text-sm text-[#dde4e6]">
              <span>Subtotal</span>
              <span>${subtotal.toLocaleString('es-CO')}</span>
            </div>
            <div className="flex justify-between text-sm text-[#dde4e6]">
              <span>IVA (19%)</span>
              <span>${tax.toLocaleString('es-CO')}</span>
            </div>
            <div className="flex justify-between font-bold text-xl text-white pt-2 border-t border-white/10">
              <span>TOTAL</span>
              <span>${total.toLocaleString('es-CO')}</span>
            </div>
          </div>
        </section>

        {/* Payment Methods Section */}
        <section className="bg-white rounded-2xl border border-[#dfbfba] p-6 flex flex-col gap-4 shadow-xs">
          <h3 className="font-bold text-xs text-[#131d21] uppercase tracking-wider">
            Método de Pago
          </h3>

          <div className="grid grid-cols-1 gap-2.5">
            {/* Efectivo */}
            <label
              onClick={() => setPaymentMethod('efectivo')}
              className={`relative flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                paymentMethod === 'efectivo'
                  ? 'border-[#9f3023] bg-[#c04838]/10 shadow-xs'
                  : 'border-[#dfbfba] hover:border-[#9f3023]/50'
              }`}
            >
              <Banknote
                className={`w-6 h-6 mr-4 ${
                  paymentMethod === 'efectivo' ? 'text-[#9f3023]' : 'text-gray-400'
                }`}
              />
              <div className="flex flex-col">
                <span className="font-bold text-sm text-[#131d21]">Efectivo</span>
                <span className="text-xs text-[#586062]">Pago manual en caja</span>
              </div>
              {paymentMethod === 'efectivo' && (
                <CheckCircle2 className="w-5 h-5 ml-auto text-[#9f3023] fill-[#9f3023]/10" />
              )}
            </label>

            {/* Tarjeta Débito/Crédito */}
            <label
              onClick={() => setPaymentMethod('tarjeta')}
              className={`relative flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                paymentMethod === 'tarjeta'
                  ? 'border-[#9f3023] bg-[#c04838]/10 shadow-xs'
                  : 'border-[#dfbfba] hover:border-[#9f3023]/50'
              }`}
            >
              <CreditCard
                className={`w-6 h-6 mr-4 ${
                  paymentMethod === 'tarjeta' ? 'text-[#9f3023]' : 'text-[#586062]'
                }`}
              />
              <div className="flex flex-col">
                <span className="font-bold text-sm text-[#131d21]">Tarjeta Débito/Crédito</span>
                <span className="text-xs text-[#586062]">Datafono conectado</span>
              </div>
              {paymentMethod === 'tarjeta' && (
                <CheckCircle2 className="w-5 h-5 ml-auto text-[#9f3023] fill-[#9f3023]/10" />
              )}
            </label>

            {/* Transferencia (QR) */}
            <label
              onClick={() => setPaymentMethod('transferencia')}
              className={`relative flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                paymentMethod === 'transferencia'
                  ? 'border-[#9f3023] bg-[#c04838]/10 shadow-xs'
                  : 'border-[#dfbfba] hover:border-[#9f3023]/50'
              }`}
            >
              <QrCode
                className={`w-6 h-6 mr-4 ${
                  paymentMethod === 'transferencia' ? 'text-[#9f3023]' : 'text-[#586062]'
                }`}
              />
              <div className="flex flex-col">
                <span className="font-bold text-sm text-[#131d21]">Transferencia (QR)</span>
                <span className="text-xs text-[#586062]">Nequi / Daviplata / Bancolombia</span>
              </div>
              {paymentMethod === 'transferencia' && (
                <CheckCircle2 className="w-5 h-5 ml-auto text-[#9f3023] fill-[#9f3023]/10" />
              )}
            </label>
          </div>

          {/* Recibido and Change (Efectivo mode) */}
          {paymentMethod === 'efectivo' && (
            <div className="mt-2 space-y-2">
              <label className="block text-xs font-bold text-[#586062] uppercase">
                Recibido (Efectivo)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">
                  $
                </span>
                <input
                  type="number"
                  value={cashReceived}
                  onChange={(e) => setCashReceived(Number(e.target.value))}
                  className="w-full bg-[#eaf5fa] border-2 border-[#dfbfba] rounded-xl py-3 pl-8 pr-4 focus:ring-2 focus:ring-[#9f3023] focus:border-[#9f3023] focus:bg-white font-bold text-lg text-[#131d21] outline-none"
                />
              </div>
              <div className="flex justify-between items-center px-1">
                <span className="text-xs text-[#586062] font-medium">Cambio:</span>
                <span className="text-sm font-bold text-[#9f3023]">
                  ${change.toLocaleString('es-CO')}
                </span>
              </div>
            </div>
          )}
        </section>

        {/* Final Action Buttons */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => {
              if (cart.length === 0) {
                alert('Agrega al menos un producto al carrito para facturar.');
                return;
              }
              completeSale();
            }}
            disabled={cart.length === 0}
            className="w-full py-5 bg-[#9f3023] hover:bg-[#881f14] text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl active:scale-[0.98] transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
          >
            <Printer className="w-6 h-6" />
            <span>Finalizar Venta e Imprimir</span>
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={suspendCurrentSale}
              className="py-3 bg-[#586062] hover:bg-[#464745] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
            >
              <Pause className="w-4 h-4" />
              <span>Suspender</span>
            </button>
            <button
              type="button"
              onClick={generateQuotation}
              className="py-3 bg-[#e4f0f4] hover:bg-[#dae1e3] text-[#58413e] border border-[#dfbfba] rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
            >
              <FileText className="w-4 h-4" />
              <span>Cotizar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
