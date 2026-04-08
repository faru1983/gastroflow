-- =============================================
-- EXTENSIONES
-- =============================================
create extension if not exists "uuid-ossp";

-- =============================================
-- FUNCIONES GLOBALES
-- =============================================

-- trigger para actualizar el campo updated_at automáticamente
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- =============================================
-- RESTAURANTS (tabla raíz de cada tenant)
-- =============================================
create table restaurants (
  id                  uuid primary key default uuid_generate_v4(),
  name                text not null,
  slug                text not null unique,        -- URL pública: /menu/[slug]
  owner_id            uuid references auth.users(id) on delete cascade,
  plan                text not null default 'trial' check (plan in ('trial','basic','pro')),
  subscription_status text not null default 'trial' check (
    subscription_status in ('trial','active','past_due','suspended','cancelled')
  ),
  trial_ends_at       timestamptz default (now() + interval '30 days'),
  address             text,
  phone               text,
  logo_url            text,
  primary_color       text default '#000000',
  created_at          timestamptz default now(),
  updated_at          timestamptz default now()
);

create trigger update_restaurants_updated_at 
    before update on restaurants 
    for each row execute function update_updated_at_column();

-- =============================================
-- MENU CATEGORIES
-- =============================================
create table menu_categories (
  id            uuid primary key default uuid_generate_v4(),
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  name          text not null,
  "order"       integer not null default 0,
  active        boolean not null default true,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

create trigger update_menu_categories_updated_at 
    before update on menu_categories 
    for each row execute function update_updated_at_column();

-- =============================================
-- MENU ITEMS
-- =============================================
create table menu_items (
  id            uuid primary key default uuid_generate_v4(),
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  category_id   uuid references menu_categories(id) on delete set null,
  name          text not null,
  description   text,
  price         numeric(10,2) not null,
  sale_price    numeric(10,2),
  image_url     text,
  active        boolean not null default true,
  "order"       integer not null default 0,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

create trigger update_menu_items_updated_at 
    before update on menu_items 
    for each row execute function update_updated_at_column();

-- =============================================
-- RESERVATION SLOTS (configuración de horarios)
-- =============================================
create table reservation_slots (
  id            uuid primary key default uuid_generate_v4(),
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  day_of_week   integer not null check (day_of_week between 0 and 6), -- 0=dom, 6=sab
  time          time not null,
  max_capacity  integer not null default 10,
  active        boolean not null default true,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

create trigger update_reservation_slots_updated_at 
    before update on reservation_slots 
    for each row execute function update_updated_at_column();

-- =============================================
-- CUSTOMERS
-- =============================================
create table customers (
  id            uuid primary key default uuid_generate_v4(),
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  name          text not null,
  email         text not null,
  phone         text,
  qr_token      text not null unique default encode(gen_random_bytes(16), 'hex'),
  total_points  integer not null default 0,
  total_visits  integer not null default 0,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now(),
  unique (restaurant_id, email)
);

create trigger update_customers_updated_at 
    before update on customers 
    for each row execute function update_updated_at_column();

-- =============================================
-- RESERVATIONS
-- =============================================
create table reservations (
  id            uuid primary key default uuid_generate_v4(),
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  slot_id       uuid references reservation_slots(id) on delete set null,
  customer_id   uuid references customers(id) on delete set null, -- Mejora: vínculo con fidelización
  customer_name text not null,
  customer_email text,
  customer_phone text,
  date          date not null,
  time          time not null,
  party_size    integer not null,
  status        text not null default 'pending' check (
    status in ('pending','confirmed','cancelled','completed','no_show')
  ),
  notes         text,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

create trigger update_reservations_updated_at 
    before update on reservations 
    for each row execute function update_updated_at_column();

-- =============================================
-- LOYALTY VISITS (registro de visitas con puntos)
-- =============================================
create table loyalty_visits (
  id            uuid primary key default uuid_generate_v4(),
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  customer_id   uuid not null references customers(id) on delete cascade,
  amount        numeric(10,2) not null,
  party_size    integer not null default 1,
  points_earned integer not null default 0,
  registered_by uuid references auth.users(id), -- staff que escaneó
  created_at    timestamptz default now()
);

-- =============================================
-- LOYALTY CONFIG (reglas de puntos por restaurante)
-- =============================================
create table loyalty_config (
  id              uuid primary key default uuid_generate_v4(),
  restaurant_id   uuid not null unique references restaurants(id) on delete cascade,
  points_per_amount integer not null default 1, -- X puntos
  amount_divisor    numeric(10,2) not null default 1000, -- por cada $Y
  updated_at        timestamptz default now()
);

-- =============================================
-- LOYALTY REWARDS (catálogo de recompensas)
-- =============================================
create table loyalty_rewards (
  id              uuid primary key default uuid_generate_v4(),
  restaurant_id   uuid not null references restaurants(id) on delete cascade,
  name            text not null,
  points_required integer not null,
  active          boolean not null default true,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

create trigger update_loyalty_rewards_updated_at 
    before update on loyalty_rewards 
    for each row execute function update_updated_at_column();

-- =============================================
-- SUBSCRIPTIONS
-- =============================================
create table subscriptions (
  id                    uuid primary key default uuid_generate_v4(),
  restaurant_id         uuid not null unique references restaurants(id) on delete cascade,
  plan                  text not null,
  status                text not null,
  payment_provider      text check (payment_provider in ('stripe','transbank')),
  external_id           text,                     -- ID en Stripe o Transbank
  current_period_start  timestamptz,
  current_period_end    timestamptz,
  created_at            timestamptz default now(),
  updated_at            timestamptz default now()
);

-- =============================================
-- ÍNDICES
-- =============================================
create index on menu_categories (restaurant_id, "order");
create index on menu_items (restaurant_id, category_id, active);
create index on reservation_slots (restaurant_id, day_of_week, active);
create index on reservations (restaurant_id, date, status);
create index on reservations (customer_id); -- Índice para búsqueda por cliente
create index on customers (restaurant_id, email);
create index on loyalty_visits (restaurant_id, customer_id, created_at);

-- =============================================
-- RLS: activar en todas las tablas
-- =============================================
alter table restaurants         enable row level security;
alter table menu_categories     enable row level security;
alter table menu_items          enable row level security;
alter table reservation_slots   enable row level security;
alter table reservations        enable row level security;
alter table customers           enable row level security;
alter table loyalty_visits      enable row level security;
alter table loyalty_config      enable row level security;
alter table loyalty_rewards     enable row level security;
alter table subscriptions       enable row level security;

-- =============================================
-- FUNCIÓN helper: obtener restaurant_id del usuario autenticado
-- =============================================
create or replace function get_my_restaurant_id()
returns uuid
language sql stable
as $$
  select (raw_user_meta_data->>'restaurant_id')::uuid
  from auth.users
  where id = auth.uid()
$$;

-- =============================================
-- POLÍTICAS RLS
-- =============================================

-- restaurants: el dueño solo ve y edita su propio restaurante
create policy "owner sees own restaurant"
  on restaurants for all
  using (owner_id = auth.uid());

-- Para las demás tablas: patrón repetido por restaurant_id
create policy "tenant isolation menu_categories" on menu_categories for all using (restaurant_id = get_my_restaurant_id());
create policy "tenant isolation menu_items" on menu_items for all using (restaurant_id = get_my_restaurant_id());
create policy "tenant isolation reservation_slots" on reservation_slots for all using (restaurant_id = get_my_restaurant_id());
create policy "tenant isolation reservations" on reservations for all using (restaurant_id = get_my_restaurant_id());
create policy "tenant isolation customers" on customers for all using (restaurant_id = get_my_restaurant_id());
create policy "tenant isolation loyalty_visits" on loyalty_visits for all using (restaurant_id = get_my_restaurant_id());
create policy "tenant isolation loyalty_config" on loyalty_config for all using (restaurant_id = get_my_restaurant_id());
create policy "tenant isolation loyalty_rewards" on loyalty_rewards for all using (restaurant_id = get_my_restaurant_id());
create policy "tenant isolation subscriptions" on subscriptions for all using (restaurant_id = get_my_restaurant_id());

-- Carta pública: cualquiera puede ver items activos de un restaurante (sin auth)
create policy "public menu read items"
  on menu_items for select
  using (active = true);

create policy "public menu read categories"
  on menu_categories for select
  using (active = true);

create policy "public restaurant read"
  on restaurants for select
  using (true);

-- =============================================
-- SEED DATA (DATOS DE EJEMPLO)
-- =============================================

-- 1. Insertar un restaurante de prueba
insert into restaurants (id, name, slug, address, phone, primary_color)
values ('550e8400-e29b-41d4-a716-446655440000', 'Gastro Bistro', 'gastro-bistro', 'Av. Vitacura 1234, Santiago', '+56912345678', '#E11D48');

-- 2. Categorías
insert into menu_categories (id, restaurant_id, name, "order")
values 
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'Entradas', 1),
('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', 'Fondos', 2),
('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440000', 'Postres', 3);

-- 3. Productos (con imágenes placeholder)
insert into menu_items (restaurant_id, category_id, name, description, price, image_url)
values 
('550e8400-e29b-41d4-a716-446655440000', '660e8400-e29b-41d4-a716-446655440001', 'Ceviche de Reineta', 'Fresco ceviche con leche de tigre y camote.', 8900, 'https://images.unsplash.com/photo-1534422298391-e4f8c170db06'),
('550e8400-e29b-41d4-a716-446655440000', '660e8400-e29b-41d4-a716-446655440002', 'Lomo Saltado', 'Clásico lomo salteado al wok con papas fritas y arroz.', 12500, 'https://images.unsplash.com/photo-1626777553732-28df52834407'),
('550e8400-e29b-41d4-a716-446655440000', '660e8400-e29b-41d4-a716-446655440003', 'Suspiro Limeño', 'Tradicional postre cremoso de leche condensada y merengue.', 4500, 'https://images.unsplash.com/photo-1551024506-0bccd828d307');

-- 4. Slots de Reserva
insert into reservation_slots (restaurant_id, day_of_week, time, max_capacity)
values 
('550e8400-e29b-41d4-a716-446655440000', 1, '13:00', 15),
('550e8400-e29b-41d4-a716-446655440000', 1, '20:00', 20),
('550e8400-e29b-41d4-a716-446655440000', 2, '13:00', 15),
('550e8400-e29b-41d4-a716-446655440000', 2, '20:00', 20);

-- 5. Cliente de prueba
insert into customers (id, restaurant_id, name, email, phone, total_points, total_visits)
values ('770e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440000', 'Juan Pérez', 'juan@ejemplo.com', '+56900000001', 1500, 3);

-- 6. Configuración de Fidelización
insert into loyalty_config (restaurant_id, points_per_amount, amount_divisor)
values ('550e8400-e29b-41d4-a716-446655440000', 10, 1000); -- 10 puntos por cada $1000

-- 7. Reserva de prueba
insert into reservations (restaurant_id, customer_id, customer_name, customer_email, date, time, party_size, status)
values ('550e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440004', 'Juan Pérez', 'juan@ejemplo.com', current_date + interval '1 day', '20:00', 4, 'confirmed');

