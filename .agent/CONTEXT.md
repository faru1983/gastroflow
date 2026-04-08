# CONTEXT.md — Contexto del Proyecto

> Resumen técnico y funcional del sistema. Actualizar este archivo cada vez que se tome una decisión arquitectónica relevante o se agregue una dependencia nueva.

---

## ¿Qué es este proyecto?

**Plataforma SaaS multi-tenant para restaurantes.**
Permite a cada restaurante gestionar en un solo sistema: menú digital con QR, reservas, fidelización de clientes, analítica y marketing.

**Problema que resuelve:** Los restaurantes hoy pagan múltiples servicios SaaS desintegrados (carta digital, reservas, fidelización). Esta plataforma los unifica en uno solo, más barato y coherente.

**Mercado objetivo inicial:** Chile (con soporte Transbank). Diseñado para escalar internacionalmente.

---

## Arquitectura general

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENTE (Browser)                     │
│         Next.js — App Router — React Components          │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────┐
│                  SERVIDOR (Vercel)                        │
│         Server Components · API Routes · Middleware       │
│         Auth check · Zod validation · Business logic      │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────┐
│                    SUPABASE                              │
│   PostgreSQL · Row Level Security · Auth · Storage        │
└─────────────────────────────────────────────────────────┘
```

---

## Multi-Tenancy

Cada restaurante es un **tenant independiente**. El aislamiento se logra mediante:

1. Columna `restaurant_id` (UUID) en **todas** las tablas con datos de negocio
2. Row Level Security (RLS) en Supabase que filtra automáticamente por `restaurant_id`
3. El `restaurant_id` del usuario autenticado vive en `user_metadata` de Supabase Auth
4. **Nunca** se acepta `restaurant_id` desde el cliente

---

## Modelo de datos (tablas principales)

```sql
-- Tenant raíz
restaurants          (id, name, slug, plan, subscription_status, trial_ends_at, ...)

-- Menú
menu_categories      (id, restaurant_id, name, order, active)
menu_items           (id, restaurant_id, category_id, name, description, price, 
                      sale_price, image_url, active, order)

-- Reservas
reservation_slots    (id, restaurant_id, time, max_capacity, day_of_week)
reservations         (id, restaurant_id, slot_id, customer_id, date, party_size, status)

-- Clientes y fidelización
customers            (id, restaurant_id, name, email, phone, qr_code)
loyalty_visits       (id, restaurant_id, customer_id, amount, party_size, points, created_at)
loyalty_rewards      (id, restaurant_id, name, points_required, active)

-- Suscripciones
subscriptions        (id, restaurant_id, plan, status, payment_provider, 
                      current_period_start, current_period_end)
```

---

## Módulos del sistema

| # | Módulo | Estado | Descripción |
|---|--------|--------|-------------|
| # | Módulo | Estado | Descripción |
|---|--------|--------|-------------|
| 1 | **Auth / Onboarding** | ✅ Completo | Registro, login, creación de tenant, trial |
| 2 | **Dashboard** | ✅ Completo | Shell, Sidebar funcional, resumen de estados |
| 3 | **Carta Digital** | ✅ Completo | CRUD real, Vista Pública (QR) y Gestión UI |
| 4 | **Reservas** | ✅ Completo | Formulario público, Gestión Dashboard y Filtros |
| 5 | **Fidelización** | ✅ Completo | Perfil socio, QR dinámico, registro de visitas |
| 6 | **Mi Perfil (Cliente)** | ✅ Completo | Billetera digital en `/[slug]/perfil` |
| 7 | **Panel Fidelidad (Admin)** | ✅ Completo | Ranking, rescate de clientes y configuración |
| 8 | **Notificaciones / Mail** | 🔄 En progreso | Resend, confirmaciones de reserva |
| 9 | **Pagos / Suscripción** | 🔲 Pendiente | Stripe + Transbank, gestión de plan |

Estados: 🔲 Pendiente · 🔄 En progreso · ✅ Completo · 🐛 Con bugs

---

## Estrategias de renderizado por vista

| Vista | Estrategia | Motivo |
|---|---|---|
| Carta QR (pública) | SSR / ISR | Datos reales del menú con SEO dinámico |
| Disponibilidad reservas | Server Actions | Validación en tiempo real de slots |
| Dashboard métricas | SSR | Siempre actualizado |
| Lista de platos (admin) | Server Component | Acceso directo a DB, SEO no necesario |
| Formularios (reservar, menú) | Client Component | Interactividad y feedback inmediato |

---

## Variables de entorno necesarias

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=       # solo server-side

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# Transbank
TRANSBANK_COMMERCE_CODE=
TRANSBANK_API_KEY=
TRANSBANK_ENVIRONMENT=           # integration | production

# Resend
RESEND_API_KEY=
RESEND_FROM_EMAIL=

# App
NEXT_PUBLIC_APP_URL=
```

---

## Decisiones técnicas tomadas

| Fecha | Decisión | Motivo |
|---|---|---|
| Inicio | Next.js 16+ App Router | Server Components, Turbopack, mejor DX |
| Inicio | Supabase (no Firebase) | PostgreSQL con RLS es ideal para multi-tenant |
| Inicio | Tailwind CSS v4 | Configuración moderna via CSS, zero-runtime tokens |
| Inicio | Zod en servidor Y cliente | Single source of truth para validaciones |
| 08/04/24 | Generación de Tipos Supabase | Eliminar errores de tipado y mejorar autocompletado |
| 08/04/24 | Fix Radix Slot Button | Resolver error de "single child" en estados de carga |
| 08/04/24 | qrcode.react (SVG) | Generar QRs de alta calidad con logo centralizado |
| 08/04/24 | Caché estática (unstable_cache) | Reducir llamadas a Supabase Free Tier en rutas públicas (Menú, Perfil). |
| 08/04/24 | Anon Client Server-side | Aplicar RLS correcto en lectura pública, sin depender de cookies() para caché. |
| 08/04/24 | Revalidate Path Global | Invalida caché de la carta QR y el perfil ante cualquier cambio de menú. |
| 08/04/24 | TypeScript Vercel Fixes | Resolución de import names (Case Sensitivity) de Windows a Linux. |
| 08/04/24 | Suspense Boundary Login | Requerimiento de Next.js para rutas con `useSearchParams` estáticas. |
| 08/04/24 | Llaves estáticas Multi-tenant | Identificadores únicos (`"menu-items", id`) en caché para aislar restaurantes. |
| 08/04/24 | Admin Fallback | Si `unstable_cache` rompe fetch anónimo, se fuerza AdminClient para no vaciar la carta. |
| 08/04/24 | Purga rutas Zombie | Borrado de `/carta/[slug]` falso positivo que arrojaba `typecheck` erróneos. |

---

## Librerías instaladas

| Librería | Versión | Motivo |
|---|---------|--------|
| @supabase/ssr | ^0.10.0 | Auth y data fetch desde Server Components |
| @supabase/supabase-js | ^2.102.1 | Cliente oficial de Supabase |
| zod | ^4.3.6 | Validación de esquemas estricta |
| lucide-react | ^1.7.0 | Iconografía consistente |
| date-fns | ^4.1.0 | Manipulación de fechas |
| sonner | ^2.0.7 | Notificaciones toast responsivas |
| sharp | ^0.34.5 | Procesamiento de imágenes (resize/webp) |
| @tanstack/react-query | ^5.96.2 | Gestión de estado asíncrono y cache |
| tailwindcss | ^4 | Estilos via hooks de CSS nativos |
| qrcode.react | ^5.0.1 | Generación de QRs premium para locales |
| html5-qrcode | ^2.3.8 | Escaneo de QR vía cámara en navegador |
| uuid | ^11.0.0 | Generación de IDs únicos para sesiones de mesa |

