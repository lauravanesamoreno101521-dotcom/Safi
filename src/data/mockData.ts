import { Product, ActivityLogItem, WeeklySalesData, Customer, Sale, CartItem, PaymentMethodType, Gasto, GastoCategoria } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    code: 'JS-4022',
    name: 'Jamón Serrano Premium',
    category: 'jamones_embutidos',
    price: 45000,
    unit: 'kg',
    stock: 14.8,
    minStock: 3.0,
    isWeightBased: true,
    isFavorite: true,
    description: 'Jamón serrano artesanal madurado 18 meses, curación española.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAFiuuiXduEnNs5iyBadlv-A2vkJsYFKdpO3_zv9y_YpNxQQZVmDreSfUxkuPRyQwjvShZ_Q9bsRLi4yRFpz4DudQUuQt3ikwnJLeAqZR4ad1q1W9hQYXuNPV7A8N7lPSF3xBmIMwdI0-CLki4g6UUpiXXJ4oL0yBseGLh49tsXJ9uvkkSYrXTzf4SOX_wYrq1mZOzz775E-O5s_KH5MbMEkF1UROe0PD7xiTfZP0PKUCU31xv6YIeH'
  },
  {
    id: 'prod-2',
    code: 'QC-1105',
    name: 'Queso Campesino Bloque',
    category: 'quesos',
    price: 12000,
    unit: 'unid',
    stock: 42,
    minStock: 10,
    isWeightBased: false,
    isFavorite: true,
    description: 'Queso fresco campesino 500g, artesanal elaborado con leche entera.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD7WjjQPnufnpUTZiKE_vv_itdDaSMLQxYSfWmAgUKsVFc4QUE9nda3ddVz71WMLLTDX1jTnlfQ3vS6jDNP29GP_pmLLV-QI1I6q-PD1U0iULIkT1QzJNbyDCfaJnI_W8v5UbNV4IZsldxOW95p9mLD-4YuSAenLgZgA7y3bW3vYMFKcwAZyZBdjWpTMvM8-u4rrfxUjU3Lg-z-ixoQYCrglvYnt3yD-zpxCzVjncvg0hBiNtbvUTYG'
  },
  {
    id: 'prod-3',
    code: 'SM-9901',
    name: 'Salame Milano',
    category: 'jamones_embutidos',
    price: 38000,
    unit: 'kg',
    stock: 8.5,
    minStock: 2.5,
    isWeightBased: true,
    isFavorite: true,
    description: 'Salami tipo Milano con corteza fina tradicional y especias seleccionadas.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAUe93sXVxgpzqauR8TUddIeIw9wAoUMP6VapNHRU7wkQGLpeQFJQE4pBzobc1ABtF7tGV3t-2r0wQKvyps-ReetQEokFtUMCZv1jBQemJH1a2IZRmyv3vaQ23UjmgaSeJy6-WyBXxMhsn-nrkGe1KefmWwhKZ6wrSShrt0d3xgDcD3aCmtzT4Z1P02KBYWHennfcYHYslf4V-bxMC0O1ebmKOW7tHNKuFH2q_97dCYIqodlG3mmVrt'
  },
  {
    id: 'prod-4',
    code: 'PA-5503',
    name: 'Pan Artesanal Masa Madre',
    category: 'panaderia_gourmet',
    price: 8500,
    unit: 'unid',
    stock: 24,
    minStock: 5,
    isWeightBased: false,
    isFavorite: true,
    description: 'Hogaza rustica de masa madre fermentada 48 horas con costra crujiente.',
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'prod-5',
    code: 'VT-8802',
    name: 'Vino Tinto Malbec Reserva',
    category: 'vinos_licores',
    price: 65000,
    unit: 'unid',
    stock: 18,
    minStock: 4,
    isWeightBased: false,
    isFavorite: true,
    description: 'Vino tinto Malbec argentino reserva crianza 12 meses en roble.',
    imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'prod-6',
    code: 'HU-2201',
    name: 'Huevos AA Campesinos x30',
    category: 'huevos_lacteos',
    price: 18500,
    unit: 'unid',
    stock: 35,
    minStock: 8,
    isWeightBased: false,
    isFavorite: true,
    description: 'Panal de 30 huevos AA de gallina libre pastoreo frescos del día.',
    imageUrl: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'prod-7',
    code: 'SI-3301',
    name: 'Salami Italiano Premium',
    category: 'jamones_embutidos',
    price: 35000,
    unit: 'kg',
    stock: 1.8,
    minStock: 4.0, // Stock crítico en rojo para que coincida con el indicador de 14 alertas
    isWeightBased: true,
    isFavorite: false,
    description: 'Salami artesanal especiado con pimienta negra entera importado de Italia.',
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'prod-8',
    code: 'JS-4099',
    name: 'Jamón Serrano Reserva Ibérico',
    category: 'jamones_embutidos',
    price: 155000,
    unit: 'kg',
    stock: 2.1,
    minStock: 3.5,
    isWeightBased: true,
    isFavorite: false,
    description: 'Jamón 50% ibérico de cebo de campo curado con sal marina natural.',
    imageUrl: 'https://images.unsplash.com/photo-1514944298352-f4d732142f74?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'prod-9',
    code: 'QM-7704',
    name: 'Queso Manchego DOP Curing',
    category: 'quesos',
    price: 76900,
    unit: 'kg',
    stock: 6.2,
    minStock: 2.0,
    isWeightBased: true,
    isFavorite: false,
    description: 'Queso curado elaborada de leche de oveja raza manchega.',
    imageUrl: 'https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'prod-10',
    code: 'MP-1109',
    name: 'Mortadela Pistacho Bologna',
    category: 'jamones_embutidos',
    price: 15000,
    unit: 'kg',
    stock: 12.0,
    minStock: 3.0,
    isWeightBased: true,
    isFavorite: false,
    description: 'Mortadela tradicional estilo Bolonia con trozos de pistacho siciliano.',
    imageUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'prod-11',
    code: 'PP-6602',
    name: 'Pechuga de Pavo Ahumada',
    category: 'jamones_embutidos',
    price: 34000,
    unit: 'kg',
    stock: 9.5,
    minStock: 3.0,
    isWeightBased: true,
    isFavorite: false,
    description: 'Pavo ahumado bajo en grasa con hierbas finas.',
    imageUrl: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'prod-12',
    code: 'PD-9001',
    name: 'Prosciutto di Parma DOP',
    category: 'jamones_embutidos',
    price: 180000,
    unit: 'kg',
    stock: 3.4,
    minStock: 1.5,
    isWeightBased: true,
    isFavorite: false,
    description: 'Prosciutto importado curado al aire en las colinas de Parma.',
    imageUrl: 'https://images.unsplash.com/photo-1514944298352-f4d732142f74?auto=format&fit=crop&w=600&q=80'
  }
];

export const MOCK_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    name: 'Restaurante El Bistró S.A.S',
    document: '900.812.441-2',
    phone: '310 458 9021',
    type: 'empresa'
  },
  {
    id: 'cust-2',
    name: 'Carlos Mendoza',
    document: '1020.841.902',
    phone: '315 882 1104',
    type: 'frecuente'
  },
  {
    id: 'cust-3',
    name: 'María Fernanda Rojas',
    document: '52.441.802',
    phone: '320 901 3345',
    type: 'general'
  }
];

export const MOCK_ACTIVITY_LOGS: ActivityLogItem[] = [
  {
    id: 'act-1',
    productName: 'Salami Italiano Premium',
    quantityStr: '2.5 kg • Hace 10 min',
    amount: 87500,
    timeAgo: 'Hace 10 min'
  },
  {
    id: 'act-2',
    productName: 'Jamón Serrano Reserva',
    quantityStr: '0.8 kg • Hace 22 min',
    amount: 124000,
    timeAgo: 'Hace 22 min'
  },
  {
    id: 'act-3',
    productName: 'Queso Manchego DOP',
    quantityStr: '1.2 kg • Hace 45 min',
    amount: 92300,
    timeAgo: 'Hace 45 min'
  },
  {
    id: 'act-4',
    productName: 'Mortadela Pistacho',
    quantityStr: '3.0 kg • Hace 1 hora',
    amount: 45000,
    timeAgo: 'Hace 1 hora'
  }
];

export const MOCK_WEEKLY_SALES: WeeklySalesData[] = [
  { day: 'Lun', actual: 1850000, previous: 1540000 },
  { day: 'Mar', actual: 2420000, previous: 2100000 },
  { day: 'Mie', actual: 1620000, previous: 1980000 },
  { day: 'Jue', actual: 3100000, previous: 2200000 },
  { day: 'Vie', actual: 3850000, previous: 3100000 },
  { day: 'Sab', actual: 4420000, previous: 3950000 },
  { day: 'Dom', actual: 2100000, previous: 1450000 }
];

// --- Historial de ventas de ejemplo (~5 meses) ---
// Sirve para que el filtro de Día/Mes/Año/Rango del Dashboard tenga datos
// reales con qué trabajar desde ya. Cuando la app se conecte a las ventas
// reales guardadas en Supabase, esto se reemplaza por la consulta real y
// las ventas que se completen en la sesión seguirán sumándose igual.
function mulberry32(seed: number) {
  let state = seed;
  return function random() {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function generateMockSalesHistory(): Sale[] {
  const rand = mulberry32(20260803);
  const sales: Sale[] = [];
  const paymentMethods: PaymentMethodType[] = ['efectivo', 'tarjeta', 'transferencia'];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let saleCounter = 1;
  const daysBack = 150;

  for (let d = daysBack; d >= 1; d--) {
    const date = new Date(today);
    date.setDate(date.getDate() - d);
    const dayOfWeek = date.getDay(); // 0 = domingo, 6 = sábado
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const salesToday = Math.floor(rand() * (isWeekend ? 6 : 4)) + (isWeekend ? 2 : 1);

    for (let s = 0; s < salesToday; s++) {
      const itemCount = Math.floor(rand() * 3) + 1;
      const items: CartItem[] = [];
      const usedIds = new Set<string>();

      for (let i = 0; i < itemCount; i++) {
        const product = INITIAL_PRODUCTS[Math.floor(rand() * INITIAL_PRODUCTS.length)];
        if (usedIds.has(product.id)) continue;
        usedIds.add(product.id);

        const quantity = product.unit === 'kg'
          ? Number((0.15 + rand() * 1.2).toFixed(3))
          : Math.floor(rand() * 3) + 1;
        const subtotal = Math.round(quantity * product.price);
        items.push({ product, quantity, subtotal });
      }

      if (items.length === 0) continue;

      const subtotal = items.reduce((acc, it) => acc + it.subtotal, 0);
      const tax = Math.round(subtotal * 0.19);
      const total = subtotal + tax;
      const timestamp = new Date(date);
      timestamp.setHours(8 + Math.floor(rand() * 11), Math.floor(rand() * 60), 0, 0);

      // ~55% de las ventas quedan asociadas a un cliente registrado (el resto
      // son ventas de mostrador sin cliente asignado), para que el ranking de
      // clientes frecuentes tenga datos reales con qué trabajar desde ya.
      const customer = rand() < 0.55
        ? MOCK_CUSTOMERS[Math.floor(rand() * MOCK_CUSTOMERS.length)]
        : undefined;

      sales.push({
        id: `hist-sale-${saleCounter}`,
        receiptNumber: `TICK-${100000 + saleCounter}`,
        timestamp,
        items,
        subtotal,
        tax,
        total,
        paymentMethod: paymentMethods[Math.floor(rand() * paymentMethods.length)],
        customer,
        cashierName: 'Admin Salsamentaría'
      });
      saleCounter++;
    }
  }

  return sales.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

export const MOCK_SALES_HISTORY: Sale[] = generateMockSalesHistory();

// --- Historial de gastos/salidas de caja de ejemplo (~5 meses) ---
// Igual que con las ventas, esto es solo para que la pantalla de Gastos y
// Caja tenga datos reales con qué trabajar desde ya. No representa gastos
// reales del negocio todavía (eso llega cuando se conecte la info real).
const GASTO_CATEGORIAS: { categoria: GastoCategoria; descripciones: string[]; montoMin: number; montoMax: number }[] = [
  { categoria: 'compra_proveedor', descripciones: ['Compra de mercancía a proveedor', 'Reposición de inventario'], montoMin: 300000, montoMax: 2200000 },
  { categoria: 'servicios_publicos', descripciones: ['Pago de energía eléctrica', 'Pago de acueducto y aseo', 'Pago de internet y telefonía'], montoMin: 80000, montoMax: 420000 },
  { categoria: 'nomina', descripciones: ['Pago de nómina quincenal'], montoMin: 900000, montoMax: 1800000 },
  { categoria: 'transporte_domicilios', descripciones: ['Transporte de mercancía', 'Pago de domicilios'], montoMin: 20000, montoMax: 150000 },
  { categoria: 'arriendo', descripciones: ['Pago de arriendo del local'], montoMin: 1200000, montoMax: 1200000 },
  { categoria: 'mantenimiento', descripciones: ['Mantenimiento de neveras y vitrinas', 'Mantenimiento de gramera'], montoMin: 50000, montoMax: 350000 }
];

function generateMockGastosHistory(): Gasto[] {
  const rand = mulberry32(20260804);
  const gastos: Gasto[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let counter = 1;
  const daysBack = 150;

  for (let d = daysBack; d >= 1; d--) {
    const date = new Date(today);
    date.setDate(date.getDate() - d);
    const dayOfMonth = date.getDate();

    // Arriendo el día 5, nómina los días 15 y 30 de cada mes
    if (dayOfMonth === 5) {
      gastos.push(makeGasto(counter++, date, rand, GASTO_CATEGORIAS[4]));
    }
    if (dayOfMonth === 15 || dayOfMonth === 30) {
      gastos.push(makeGasto(counter++, date, rand, GASTO_CATEGORIAS[2]));
    }

    // Entre 0 y 2 gastos operativos adicionales por día (compras, servicios, transporte, mantenimiento)
    const extraCount = Math.floor(rand() * 3);
    for (let i = 0; i < extraCount; i++) {
      const pool = [GASTO_CATEGORIAS[0], GASTO_CATEGORIAS[1], GASTO_CATEGORIAS[3], GASTO_CATEGORIAS[5]];
      const cat = pool[Math.floor(rand() * pool.length)];
      gastos.push(makeGasto(counter++, date, rand, cat));
    }
  }

  return gastos.sort((a, b) => b.fecha.getTime() - a.fecha.getTime());
}

function makeGasto(
  id: number,
  date: Date,
  rand: () => number,
  cat: { categoria: GastoCategoria; descripciones: string[]; montoMin: number; montoMax: number }
): Gasto {
  const fecha = new Date(date);
  fecha.setHours(9 + Math.floor(rand() * 9), Math.floor(rand() * 60), 0, 0);
  const monto = Math.round((cat.montoMin + rand() * (cat.montoMax - cat.montoMin)) / 1000) * 1000;
  const descripcion = cat.descripciones[Math.floor(rand() * cat.descripciones.length)];
  return {
    id: `hist-gasto-${id}`,
    fecha,
    tipo: 'egreso',
    categoria: cat.categoria,
    descripcion,
    monto
  };
}

export const MOCK_GASTOS_HISTORY: Gasto[] = generateMockGastosHistory();

export const MOCK_SUPPLIERS = [
  {
    id: 'sup-1',
    name: 'Embutidos y Madurados Ibéricos S.L.',
    nit: '830.124.990-1',
    category: 'Jamones y Embutidos',
    contactPerson: 'Fernando Gómez',
    phone: '(601) 745-8820',
    status: 'activo',
    lastOrder: '2026-07-28'
  },
  {
    id: 'sup-2',
    name: 'Lácteos del Valle y Sabana',
    nit: '860.012.445-8',
    category: 'Quesos Artesanales',
    contactPerson: 'Helena Suárez',
    phone: '318 402 1199',
    status: 'activo',
    lastOrder: '2026-07-30'
  },
  {
    id: 'sup-3',
    name: 'Importadora de Vinos Med S.A.',
    nit: '900.412.332-5',
    category: 'Vinos y Licores',
    contactPerson: 'Alejandro Parra',
    phone: '(604) 310-9080',
    status: 'activo',
    lastOrder: '2026-07-22'
  },
  {
    id: 'sup-4',
    name: 'Avícola Santa Clara',
    nit: '890.311.200-4',
    category: 'Huevos y Aves',
    contactPerson: 'Rosaura Jiménez',
    phone: '311 890 2234',
    status: 'activo',
    lastOrder: '2026-08-01'
  }
];
