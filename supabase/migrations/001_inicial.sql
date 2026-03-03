create extension if not exists pgcrypto;

create table if not exists perfiles (
  id uuid primary key default auth.uid(),
  nombre text not null,
  moneda_base text not null default 'ARS',
  idioma text not null default 'es',
  tema text not null default 'sistema',
  plan_suscripcion text not null default 'free',
  es_superusuario boolean not null default false,
  preferencias_notificacion jsonb not null default '{"email": true, "push": true}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists categorias (
  id uuid primary key default gen_random_uuid(),
  perfil_id uuid not null references perfiles(id) on delete cascade,
  nombre text not null,
  emoticon text not null default '💼',
  tipo text not null check (tipo in ('ingreso', 'egreso')),
  techo_presupuesto numeric(14,2),
  created_at timestamptz not null default now()
);

create table if not exists cuentas (
  id uuid primary key default gen_random_uuid(),
  perfil_id uuid not null references perfiles(id) on delete cascade,
  nombre_entidad text not null,
  saldo_actual numeric(14,2) not null default 0,
  moneda text not null default 'ARS',
  tipo text not null check (tipo in ('Banco', 'Billetera Virtual')),
  created_at timestamptz not null default now()
);

create table if not exists tarjetas (
  id uuid primary key default gen_random_uuid(),
  perfil_id uuid not null references perfiles(id) on delete cascade,
  nombre text not null,
  banco_entidad text not null,
  marca text not null check (marca in ('Visa', 'Master', 'Amex', 'Otra')),
  dia_cierre int not null check (dia_cierre between 1 and 31),
  dia_vencimiento int not null check (dia_vencimiento between 1 and 31),
  created_at timestamptz not null default now()
);

create table if not exists prestamos (
  id uuid primary key default gen_random_uuid(),
  perfil_id uuid not null references perfiles(id) on delete cascade,
  tipo text not null check (tipo in ('pedido', 'otorgado')),
  modalidad text not null check (modalidad in ('UVA', 'Tasa Fija', 'Tercero Dolarizado')),
  entidad_id uuid references cuentas(id) on delete set null,
  monto_original_moneda numeric(14,2) not null,
  moneda_contrato text not null,
  tasa_interes_anual numeric(8,3) not null default 0,
  valor_uva_origen numeric(12,4),
  cuotas_totales int not null default 1,
  cuotas_pagadas int not null default 0,
  fecha_inicio date not null,
  created_at timestamptz not null default now()
);

create table if not exists bienes (
  id uuid primary key default gen_random_uuid(),
  perfil_id uuid not null references perfiles(id) on delete cascade,
  tipo text not null check (tipo in ('Auto', 'Inmueble', 'Otro')),
  descripcion text not null,
  operacion text not null check (operacion in ('Compra', 'Venta')),
  comprador text not null,
  vendedor text not null,
  monto_total numeric(14,2) not null,
  moneda text not null default 'ARS',
  cuotas_totales int not null default 1,
  cuotas_pagadas int not null default 0,
  fecha_operacion date not null,
  created_at timestamptz not null default now()
);

create table if not exists gastos (
  id uuid primary key default gen_random_uuid(),
  perfil_id uuid not null references perfiles(id) on delete cascade,
  monto numeric(14,2) not null,
  moneda text not null default 'ARS',
  categoria_id uuid references categorias(id) on delete set null,
  fecha_compra date not null,
  fecha_pago_real date,
  cuota_n int default 1,
  cuotas_totales int default 1,
  gasto_raiz_id uuid,
  tarjeta_id uuid references tarjetas(id) on delete set null,
  prestamo_id uuid references prestamos(id) on delete set null,
  es_ajuste_manual boolean not null default false,
  es_gasto_fijo boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists ingresos (
  id uuid primary key default gen_random_uuid(),
  perfil_id uuid not null references perfiles(id) on delete cascade,
  monto numeric(14,2) not null,
  moneda text not null default 'ARS',
  fuente text not null,
  propietario_id uuid references perfiles(id) on delete set null,
  es_fijo boolean not null default false,
  mes_ajuste date,
  destino text not null check (destino in ('ahorro', 'gasto', 'cambio_a_pesos_tasa')),
  bien_id uuid references bienes(id) on delete set null,
  es_cobro_real boolean not null default true,
  created_at timestamptz not null default now()
);

alter table perfiles enable row level security;
alter table categorias enable row level security;
alter table cuentas enable row level security;
alter table tarjetas enable row level security;
alter table gastos enable row level security;
alter table ingresos enable row level security;
alter table prestamos enable row level security;
alter table bienes enable row level security;

create policy if not exists perfiles_propios on perfiles
  for all using (auth.uid() = id) with check (auth.uid() = id);
create policy if not exists categorias_propias on categorias
  for all using (auth.uid() = perfil_id) with check (auth.uid() = perfil_id);
create policy if not exists cuentas_propias on cuentas
  for all using (auth.uid() = perfil_id) with check (auth.uid() = perfil_id);
create policy if not exists tarjetas_propias on tarjetas
  for all using (auth.uid() = perfil_id) with check (auth.uid() = perfil_id);
create policy if not exists gastos_propios on gastos
  for all using (auth.uid() = perfil_id) with check (auth.uid() = perfil_id);
create policy if not exists ingresos_propios on ingresos
  for all using (auth.uid() = perfil_id) with check (auth.uid() = perfil_id);
create policy if not exists prestamos_propios on prestamos
  for all using (auth.uid() = perfil_id) with check (auth.uid() = perfil_id);
create policy if not exists bienes_propios on bienes
  for all using (auth.uid() = perfil_id) with check (auth.uid() = perfil_id);
