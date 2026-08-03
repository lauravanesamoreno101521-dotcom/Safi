-- ============================================================
-- Salsamentaría Pro — Esquema de base de datos
-- Pegar y ejecutar completo en Supabase: SQL Editor > New query
-- ============================================================

-- Extensión necesaria para generar UUIDs
create extension if not exists "pgcrypto";

-- ------------------------------------------------------------
-- Usuarios (perfil extendido sobre auth.users de Supabase)
-- ------------------------------------------------------------
create table if not exists usuarios (
  id uuid primary key references auth.users(id) on delete cascade,
  nombre text not null,
  rol text not null default 'cajero' check (rol in ('admin', 'cajero')),
  activo boolean not null default true,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- Categorías y productos
-- ------------------------------------------------------------
create table if not exists categorias (
  id uuid primary key default gen_random_uuid(),
  nombre text not null unique
);

create table if not exists productos (
  id uuid primary key default gen_random_uuid(),
  codigo_barras text unique,
  nombre text not null,
  categoria_id uuid references categorias(id),
  precio numeric(12,2) not null default 0,
  unidad text not null default 'unid' check (unidad in ('kg', 'unid', 'gramo')),
  es_por_peso boolean not null default false,
  stock numeric(12,3) not null default 0,
  stock_minimo numeric(12,3) not null default 0,
  imagen_url text,
  descripcion text,
  activo boolean not null default true,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- Inventario: historial de movimientos (entradas, salidas, ajustes)
-- ------------------------------------------------------------
create table if not exists movimientos_inventario (
  id uuid primary key default gen_random_uuid(),
  producto_id uuid not null references productos(id),
  tipo text not null check (tipo in ('entrada', 'salida', 'ajuste')),
  cantidad numeric(12,3) not null,
  motivo text,
  venta_id uuid, -- se referencia más abajo, sin FK dura para evitar dependencia circular
  usuario_id uuid references usuarios(id),
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- Proveedores y solicitudes de stock
-- ------------------------------------------------------------
create table if not exists proveedores (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  nit text,
  telefono text,
  email text,
  direccion text,
  contacto text,
  activo boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists solicitudes_stock (
  id uuid primary key default gen_random_uuid(),
  proveedor_id uuid references proveedores(id),
  estado text not null default 'pendiente' check (estado in ('pendiente', 'enviada', 'recibida', 'cancelada')),
  fecha_solicitud timestamptz not null default now(),
  fecha_esperada date,
  notas text,
  usuario_id uuid references usuarios(id)
);

create table if not exists solicitud_stock_items (
  id uuid primary key default gen_random_uuid(),
  solicitud_id uuid not null references solicitudes_stock(id) on delete cascade,
  producto_id uuid not null references productos(id),
  cantidad_solicitada numeric(12,3) not null,
  cantidad_recibida numeric(12,3) not null default 0,
  costo_unitario numeric(12,2)
);

-- ------------------------------------------------------------
-- Clientes
-- ------------------------------------------------------------
create table if not exists clientes (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  documento text,
  telefono text,
  email text,
  tipo text not null default 'general' check (tipo in ('general', 'empresa', 'frecuente')),
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- Caja: apertura/cierre diario y movimientos (entradas/salidas de caja)
-- ------------------------------------------------------------
create table if not exists cajas (
  id uuid primary key default gen_random_uuid(),
  fecha_apertura timestamptz not null default now(),
  fecha_cierre timestamptz,
  monto_inicial numeric(12,2) not null default 0,
  monto_final_esperado numeric(12,2),
  monto_final_real numeric(12,2),
  estado text not null default 'abierta' check (estado in ('abierta', 'cerrada')),
  usuario_id uuid references usuarios(id)
);

create table if not exists movimientos_caja (
  id uuid primary key default gen_random_uuid(),
  caja_id uuid not null references cajas(id),
  tipo text not null check (tipo in ('ingreso', 'egreso')),
  categoria text, -- ej: 'venta', 'compra_proveedor', 'servicios', 'nomina', 'otro'
  monto numeric(12,2) not null,
  descripcion text,
  venta_id uuid, -- referenciado más abajo
  usuario_id uuid references usuarios(id),
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- Ventas
-- ------------------------------------------------------------
create table if not exists ventas (
  id uuid primary key default gen_random_uuid(),
  numero_recibo text unique not null,
  caja_id uuid references cajas(id),
  cliente_id uuid references clientes(id),
  subtotal numeric(12,2) not null,
  iva numeric(12,2) not null default 0,
  total numeric(12,2) not null,
  metodo_pago text not null check (metodo_pago in ('efectivo', 'tarjeta', 'transferencia')),
  efectivo_recibido numeric(12,2),
  cambio numeric(12,2),
  cajero_id uuid references usuarios(id),
  created_at timestamptz not null default now()
);

create table if not exists venta_items (
  id uuid primary key default gen_random_uuid(),
  venta_id uuid not null references ventas(id) on delete cascade,
  producto_id uuid not null references productos(id),
  cantidad numeric(12,3) not null,
  precio_unitario numeric(12,2) not null,
  subtotal numeric(12,2) not null
);

-- Ahora sí, agregamos las referencias a ventas que dejamos pendientes arriba
alter table movimientos_inventario add constraint fk_mov_inv_venta foreign key (venta_id) references ventas(id);
alter table movimientos_caja add constraint fk_mov_caja_venta foreign key (venta_id) references ventas(id);

-- ============================================================
-- Seguridad: Row Level Security (RLS)
-- Punto de partida simple: cualquier usuario autenticado puede
-- leer y escribir. Más adelante se puede restringir por rol
-- (ej: solo 'admin' ve reportes de caja y egresos).
-- ============================================================
alter table usuarios enable row level security;
alter table categorias enable row level security;
alter table productos enable row level security;
alter table movimientos_inventario enable row level security;
alter table proveedores enable row level security;
alter table solicitudes_stock enable row level security;
alter table solicitud_stock_items enable row level security;
alter table clientes enable row level security;
alter table cajas enable row level security;
alter table movimientos_caja enable row level security;
alter table ventas enable row level security;
alter table venta_items enable row level security;

create policy "usuarios autenticados leen todo" on usuarios for select using (auth.uid() is not null);
create policy "usuarios autenticados leen categorias" on categorias for select using (auth.uid() is not null);
create policy "usuarios autenticados escriben categorias" on categorias for all using (auth.uid() is not null);
create policy "usuarios autenticados leen productos" on productos for select using (auth.uid() is not null);
create policy "usuarios autenticados escriben productos" on productos for all using (auth.uid() is not null);
create policy "usuarios autenticados leen movimientos_inventario" on movimientos_inventario for select using (auth.uid() is not null);
create policy "usuarios autenticados escriben movimientos_inventario" on movimientos_inventario for all using (auth.uid() is not null);
create policy "usuarios autenticados leen proveedores" on proveedores for select using (auth.uid() is not null);
create policy "usuarios autenticados escriben proveedores" on proveedores for all using (auth.uid() is not null);
create policy "usuarios autenticados leen solicitudes_stock" on solicitudes_stock for select using (auth.uid() is not null);
create policy "usuarios autenticados escriben solicitudes_stock" on solicitudes_stock for all using (auth.uid() is not null);
create policy "usuarios autenticados leen solicitud_stock_items" on solicitud_stock_items for select using (auth.uid() is not null);
create policy "usuarios autenticados escriben solicitud_stock_items" on solicitud_stock_items for all using (auth.uid() is not null);
create policy "usuarios autenticados leen clientes" on clientes for select using (auth.uid() is not null);
create policy "usuarios autenticados escriben clientes" on clientes for all using (auth.uid() is not null);
create policy "usuarios autenticados leen cajas" on cajas for select using (auth.uid() is not null);
create policy "usuarios autenticados escriben cajas" on cajas for all using (auth.uid() is not null);
create policy "usuarios autenticados leen movimientos_caja" on movimientos_caja for select using (auth.uid() is not null);
create policy "usuarios autenticados escriben movimientos_caja" on movimientos_caja for all using (auth.uid() is not null);
create policy "usuarios autenticados leen ventas" on ventas for select using (auth.uid() is not null);
create policy "usuarios autenticados escriben ventas" on ventas for all using (auth.uid() is not null);
create policy "usuarios autenticados leen venta_items" on venta_items for select using (auth.uid() is not null);
create policy "usuarios autenticados escriben venta_items" on venta_items for all using (auth.uid() is not null);

-- ============================================================
-- Categorías iniciales (coinciden con las que ya usa la app)
-- ============================================================
insert into categorias (nombre) values
  ('jamones_embutidos'),
  ('quesos'),
  ('panaderia_gourmet'),
  ('vinos_licores'),
  ('abarrotes'),
  ('huevos_lacteos')
on conflict (nombre) do nothing;
