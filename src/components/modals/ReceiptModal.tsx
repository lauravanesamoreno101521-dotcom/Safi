import React from 'react';
import { usePOS } from '../../context/POSContext';
import { Printer, CheckCircle2, X, Share2 } from 'lucide-react';

export const ReceiptModal: React.FC = () => {
  const { isReceiptModalOpen, setIsReceiptModalOpen, lastCompletedSale } = usePOS();

  if (!isReceiptModalOpen || !lastCompletedSale) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center z-50 p-4 print:p-0 print:bg-white">
      <div className="bg-white rounded-3xl max-w-sm w-full shadow-2xl border border-gray-300 overflow-hidden flex flex-col print:border-none print:shadow-none print:max-w-full">
        {/* Modal Header */}
        <div className="bg-[#9f3023] text-white p-4 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-300" />
            <span className="font-bold text-sm">Venta Exitosa #{lastCompletedSale.receiptNumber}</span>
          </div>
          <button
            onClick={() => setIsReceiptModalOpen(false)}
            className="p-1 rounded-full hover:bg-white/20 transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Thermal Ticket Format */}
        <div className="p-6 font-mono text-xs text-[#131d21] space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Header info */}
          <div className="text-center space-y-1 pb-3 border-b border-dashed border-gray-400">
            <h2 className="text-base font-bold tracking-tight uppercase">Salsamentaría Pro</h2>
            <p className="text-[11px] text-gray-600">NIT: 900.812.441-8 • Régimen Común</p>
            <p className="text-[11px] text-gray-600">Sede Norte • Bogotá D.C.</p>
            <p className="text-[11px] text-gray-600">Tel: (601) 745-9000 • POS Integrado</p>
          </div>

          {/* Ticket metadata */}
          <div className="space-y-1 text-[11px] border-b border-dashed border-gray-400 pb-3">
            <div className="flex justify-between">
              <span>Recibo N°:</span>
              <span className="font-bold">{lastCompletedSale.receiptNumber}</span>
            </div>
            <div className="flex justify-between">
              <span>Fecha:</span>
              <span>{new Date(lastCompletedSale.timestamp).toLocaleString('es-CO')}</span>
            </div>
            <div className="flex justify-between">
              <span>Cajero(a):</span>
              <span>{lastCompletedSale.cashierName}</span>
            </div>
            {lastCompletedSale.customer && (
              <div className="flex justify-between">
                <span>Cliente:</span>
                <span className="font-bold truncate max-w-[150px]">{lastCompletedSale.customer.name}</span>
              </div>
            )}
          </div>

          {/* Items Table */}
          <div className="space-y-2 border-b border-dashed border-gray-400 pb-3">
            <div className="flex justify-between font-bold text-[11px] uppercase border-b pb-1">
              <span>Desc.</span>
              <span>Cant. / Importe</span>
            </div>
            {lastCompletedSale.items.map((item, index) => (
              <div key={index} className="space-y-0.5">
                <div className="font-bold text-[#131d21]">{item.product.name}</div>
                <div className="flex justify-between text-gray-600">
                  <span>
                    {item.quantity} {item.product.unit} x ${item.product.price.toLocaleString('es-CO')}
                  </span>
                  <span className="font-bold text-[#131d21]">
                    ${item.subtotal.toLocaleString('es-CO')}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Totals Section */}
          <div className="space-y-1.5 border-b border-dashed border-gray-400 pb-3">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal:</span>
              <span>${lastCompletedSale.subtotal.toLocaleString('es-CO')}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>IVA (19%):</span>
              <span>${lastCompletedSale.tax.toLocaleString('es-CO')}</span>
            </div>
            <div className="flex justify-between font-bold text-sm text-[#131d21] pt-1 border-t">
              <span>TOTAL A PAGAR:</span>
              <span>${lastCompletedSale.total.toLocaleString('es-CO')} COP</span>
            </div>
          </div>

          {/* Payment method */}
          <div className="space-y-1 pb-3 border-b border-dashed border-gray-400">
            <div className="flex justify-between">
              <span>Método de Pago:</span>
              <span className="uppercase font-bold">{lastCompletedSale.paymentMethod}</span>
            </div>
            {lastCompletedSale.paymentMethod === 'efectivo' && (
              <>
                <div className="flex justify-between">
                  <span>Efectivo Recibido:</span>
                  <span>${(lastCompletedSale.cashReceived || 0).toLocaleString('es-CO')}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Cambio Entregado:</span>
                  <span>${(lastCompletedSale.change || 0).toLocaleString('es-CO')}</span>
                </div>
              </>
            )}
          </div>

          {/* Footer message */}
          <div className="text-center pt-1 space-y-1 text-[10px] text-gray-500">
            <p className="font-bold">¡Gracias por su compra!</p>
            <p>Conserve este ticket para cualquier cambio o reclamación.</p>
            <p className="text-[9px]">Salsamentaría Pro ERP v2.4 • Gramera Certificada</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-gray-50 border-t flex gap-2 print:hidden">
          <button
            type="button"
            onClick={handlePrint}
            className="flex-1 py-3 bg-[#9f3023] hover:bg-[#881f14] text-white font-bold rounded-xl text-sm shadow-md flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            Imprimir Ticket
          </button>
          <button
            type="button"
            onClick={() => setIsReceiptModalOpen(false)}
            className="px-5 py-3 bg-gray-200 hover:bg-gray-300 text-[#131d21] font-bold rounded-xl text-sm transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
