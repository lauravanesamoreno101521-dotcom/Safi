export type TabType = 'dashboard' | 'pos' | 'inventario' | 'reportes' | 'gastos' | 'clientes' | 'proveedores';

export type PricingUnit = 'kg' | 'unid' | 'gramo';

export interface Product {
  id: string;
  code: string;
  name: string;
  category: 'jamones_embutidos' | 'quesos' | 'panaderia_gourmet' | 'vinos_licores' | 'abarrotes' | 'huevos_lacteos' | 'bebidas' | 'desechables';
  price: number; // Precio por kg o unidad según unit
  unit: PricingUnit;
  stock: number; // En kg o unidades
  minStock: number;
  imageUrl: string;
  isFavorite?: boolean;
  description?: string;
  isWeightBased: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number; // Si es 'kg', representa kg (ej. 0.345 kg = 345g), si es 'unid', representa unidades
  subtotal: number;
}

export type PaymentMethodType = 'efectivo' | 'tarjeta' | 'transferencia';

export interface Customer {
  id: string;
  name: string;
  document: string; // NIT o CC
  phone?: string;
  type: 'general' | 'empresa' | 'frecuente';
}

export interface Sale {
  id: string;
  receiptNumber: string;
  timestamp: Date;
  items: CartItem[];
  subtotal: number;
  tax: number; // 19% IVA
  total: number;
  paymentMethod: PaymentMethodType;
  cashReceived?: number;
  change?: number;
  customer?: Customer;
  cashierName: string;
}

// Categorías de SALIDA (egreso/gasto)
export type GastoEgresoCategoria =
  | 'compra_proveedor'
  | 'servicios_publicos'
  | 'nomina'
  | 'transporte_domicilios'
  | 'arriendo'
  | 'mantenimiento'
  | 'otro_egreso';

// Categorías de ENTRADA manual (ingreso que no es una venta de mostrador)
export type GastoIngresoCategoria =
  | 'abono_cliente'
  | 'capital_socio'
  | 'devolucion_proveedor'
  | 'otro_ingreso';

export type GastoCategoria = GastoEgresoCategoria | GastoIngresoCategoria;

/**
 * Movimiento manual de caja que NO es una venta: una salida (gasto/egreso,
 * ej. pago a proveedor, servicios, nómina) o un ingreso manual (ej. un abono
 * o un ingreso distinto a una venta de mostrador). Junto con las ventas
 * (que ya son "entradas" por naturaleza), alimenta la pantalla de Gastos y
 * Caja para tener un balance de entradas y salidas coherente.
 */
export interface Gasto {
  id: string;
  fecha: Date;
  tipo: 'ingreso' | 'egreso';
  categoria: GastoCategoria;
  descripcion: string;
  monto: number;
}

export interface ActivityLogItem {
  id: string;
  productName: string;
  quantityStr: string;
  amount: number;
  timeAgo: string;
}

export interface WeeklySalesData {
  day: 'Lun' | 'Mar' | 'Mie' | 'Jue' | 'Vie' | 'Sab' | 'Dom';
  actual: number;
  previous: number;
}
