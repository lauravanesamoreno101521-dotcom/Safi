import React, { useRef, useState } from 'react';
import { usePOS } from '../../context/POSContext';
import { Printer, CheckCircle2, X, MessageCircle, FileCheck2, Loader2 } from 'lucide-react';
import { getInvoiceWhatsAppLink, buildInvoiceShareCaption } from '../../lib/whatsapp';
import { issueElectronicInvoice, ElectronicInvoiceResult } from '../../lib/electronicInvoice';

export const ReceiptModal: React.FC = () => {
  const { isReceiptModalOpen, setIsReceiptModalOpen, lastCompletedSale } = usePOS();
  const [isIssuing, setIsIssuing] = useState(false);
  const [invoiceResult, setInvoiceResult] = useState<ElectronicInvoiceResult | null>(null);
  const [invoiceResultSaleId, setInvoiceResultSaleId] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [imageFallbackNotice, setImageFallbackNotice] = useState(false);
  const ticketRef = useRef<HTMLDivElement>(null);

  if (!isReceiptModalOpen || !lastCompletedSale) return null;

  // El resultado de la factura electrónica es por venta: si se abre el
  // recibo de una venta distinta a la que quedó simulada, se limpia el aviso.
  if (invoiceResultSaleId && invoiceResultSaleId !== lastCompletedSale.id && invoiceResult) {
    setInvoiceResult(null);
    setInvoiceResultSaleId(null);
  }

  const handlePrint = () => {
    window.print();
  };

  const whatsappLink = getInvoiceWhatsAppLink(lastCompletedSale);

  /**
   * Envía la factura por WhatsApp tal como se ve en pantalla (imagen tipo
   * ticket), no como texto plano: se renderiza el recibo a una imagen PNG
   * con html2canvas y se comparte con la Web Share API (nativa en celulares
   * con WhatsApp instalado) para que llegue como una foto adjunta real.
   *
   * Limitación real: WhatsApp Click-to-Chat (wa.me) no permite adjuntar
   * archivos por enlace, solo texto — eso requeriría la API oficial de
   * WhatsApp Business. Por eso en computadores (donde no existe "compartir
   * archivo" del sistema) se descarga la imagen de la factura y se abre el
   * chat de WhatsApp para adjuntarla manualmente con un clic.
   */
  const handleSendWhatsApp = async () => {
    const node = ticketRef.current;
    if (!node) {
      if (whatsappLink) window.open(whatsappLink, '_blank');
      return;
    }

    setIsGeneratingImage(true);
    setImageFallbackNotice(false);

    // Se quita temporalmente el recorte con scroll para que la imagen
    // capture el recibo completo, no solo la parte visible.
    const prevMaxHeight = node.style.maxHeight;
    const prevOverflowY = node.style.overflowY;
    node.style.maxHeight = 'none';
    node.style.overflowY = 'visible';

    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(node, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true
      });

      const blob: Blob | null = await new Promise((resolve) =>
        canvas.toBlob((b) => resolve(b), 'image/png')
      );
      if (!blob) throw new Error('No se pudo generar la imagen de la factura.');

      const fileName = `factura-${lastCompletedSale.receiptNumber}.png`;
      const file = new File([blob], fileName, { type: 'image/png' });
      const caption = buildInvoiceShareCaption(lastCompletedSale);

      const nav = navigator as Navigator & { canShare?: (data?: ShareData) => boolean };
      if (nav.canShare && nav.canShare({ files: [file] }) && navigator.share) {
        await navigator.share({
          files: [file],
          title: `Factura ${lastCompletedSale.receiptNumber}`,
          text: caption
        });
      } else {
        // Escritorio: no hay share sheet nativo con archivos, así que se
        // descarga la imagen y se abre el chat con el texto ya redactado.
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        if (whatsappLink) window.open(whatsappLink, '_blank');
        setImageFallbackNotice(true);
      }
    } catch (err) {
      // Si algo falla generando la imagen, no se deja a la cajera sin poder
      // enviar nada: se cae al enlace de texto de siempre.
      console.error('No se pudo generar la imagen de la factura para WhatsApp:', err);
      if (whatsappLink) window.open(whatsappLink, '_blank');
    } finally {
      node.style.maxHeight = prevMaxHeight;
      node.style.overflowY = prevOverflowY;
      setIsGeneratingImage(false);
    }
  };

  const handleIssueElectronicInvoice = async () => {
    setIsIssuing(true);
    const result = await issueElectronicInvoice(lastCompletedSale);
    setInvoiceResult(result);
    setInvoiceResultSaleId(lastCompletedSale.id);
    setIsIssuing(false);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center z-50 p-4 print:p-0 print:bg-white">
      <div className="bg-white rounded-3xl max-w-sm w-full shadow-2xl border border-gray-300 overflow-hidden flex flex-col print:border-none print:shadow-none print:max-w-full">
        {/* Modal Header */}
        <div className="bg-[#7a0d0a] text-white p-4 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#d4c77a]" />
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
        <div
          ref={ticketRef}
          className="p-6 font-mono text-xs text-[#2a1a12] space-y-4 max-h-[70vh] overflow-y-auto bg-white"
        >
          {/* Header info */}
          <div className="text-center space-y-1 pb-3 border-b border-dashed border-gray-400">
            <h2 className="text-base font-bold tracking-tight uppercase">Salsamentaría Safi</h2>
            <p className="text-[11px] text-gray-600">NIT: 900.812.441-8 • Régimen Común</p>
            <p className="text-[11px] text-gray-600">Bucaramanga, Santander</p>
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
                <div className="font-bold text-[#2a1a12]">{item.product.name}</div>
                <div className="flex justify-between text-gray-600">
                  <span>
                    {item.quantity} {item.product.unit} x ${item.product.price.toLocaleString('es-CO')}
                  </span>
                  <span className="font-bold text-[#2a1a12]">
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
            <div className="flex justify-between font-bold text-sm text-[#2a1a12] pt-1 border-t">
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
            <p className="text-[9px]">Salsamentaría Safi ERP v2.4 • Gramera Certificada</p>
          </div>
        </div>

        {imageFallbackNotice && (
          <div className="mx-4 mb-2 px-3 py-2 rounded-xl bg-[#e3f0e3] border border-[#a8cfa8] text-[11px] text-[#1f4a1f] print:hidden">
            <span className="font-bold">Imagen de la factura descargada.</span> Se abrió WhatsApp: adjunta la imagen descargada en el chat con el botón de clip 📎.
          </div>
        )}

        {/* Facturación electrónica DIAN (enchufe listo, simulada hasta elegir proveedor) */}
        {invoiceResult && (
          <div className="mx-4 mb-2 px-3 py-2 rounded-xl bg-[#f1f0dc] border border-[#d6d19a] text-[11px] text-[#4a4a1f] print:hidden">
            <span className="font-bold">Factura electrónica simulada.</span> CUFE: {invoiceResult.cufe}
            <br />
            <span className="text-[10px] text-[#7a6552]">Falta conectar el proveedor DIAN real para que sea válida ante la ley.</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="p-4 bg-gray-50 border-t flex flex-col gap-2 print:hidden">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="flex-1 py-3 bg-[#7a0d0a] hover:bg-[#4f0906] text-white font-bold rounded-xl text-sm shadow-md flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Imprimir
            </button>
            <button
              type="button"
              onClick={handleSendWhatsApp}
              disabled={!whatsappLink || isGeneratingImage}
              title={whatsappLink ? 'Enviar factura por WhatsApp' : 'Asigna un cliente con teléfono registrado para enviarla por WhatsApp'}
              className="flex-1 py-3 bg-[#3d3f10] hover:brightness-110 text-white font-bold rounded-xl text-sm shadow-md flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isGeneratingImage ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <MessageCircle className="w-4 h-4" />
              )}
              {isGeneratingImage ? 'Generando factura...' : 'WhatsApp'}
            </button>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleIssueElectronicInvoice}
              disabled={isIssuing}
              className="flex-1 py-2.5 bg-white border-2 border-[#ddc9a3] hover:bg-[#f5efdf] text-[#2a1a12] font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-60"
            >
              {isIssuing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileCheck2 className="w-3.5 h-3.5" />}
              {isIssuing ? 'Emitiendo factura DIAN...' : 'Emitir Factura Electrónica (DIAN)'}
            </button>
            <button
              type="button"
              onClick={() => setIsReceiptModalOpen(false)}
              className="px-5 py-2.5 bg-gray-200 hover:bg-gray-300 text-[#2a1a12] font-bold rounded-xl text-xs transition-colors cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
