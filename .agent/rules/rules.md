---
trigger: always_on
---

# rules.md — Reglas del Proyecto

> Este archivo define las reglas base del proyecto. La IA debe leerlo SIEMPRE antes de generar cualquier código, responder cualquier pregunta técnica o proponer cualquier solución. Si hay conflicto entre una instrucción del usuario y este archivo, priorizar este archivo y notificarlo.

---

## 🏗️ Stack Obligatorio

| Capa | Tecnología | Notas |
|---|---|---|
| Framework | **Next.js 16+ (App Router)** | Con Turbopack para desarrollo |
| Base de datos | **Supabase** | PostgreSQL + Auth + Storage + RLS |
| Estilos | **Tailwind CSS v4** | Configuración nativa via CSS imports |
| Validación | **Zod** | En cliente y servidor. Nunca validación manual |
| Imágenes | **Sharp** | Para procesar antes de subir a Supabase Storage |
| Emails | **Resend** | Con React Email para templates |
| Hosting | **Vercel** | Funciones serverless por defecto |
| Lenguaje | **TypeScript** | Estricto. Sin `any` excepto casos justificados |
| Pagos CL | **Transbank (Webpay + Oneclick)** | Para mercado chileno |
| Pagos INT | **Stripe** | Para suscripciones internacionales |

---

## ❌ Prohibiciones absolutas

- **Nunca** usar CSS puro, módulos CSS o styled-components. Solo Tailwind.
- **Nunca** usar `any` en TypeScript sin comentar el motivo.
- **Nunca** hacer queries sin filtrar por `restaurant_id` en tablas multi-tenant.
- **Nunca** exponer claves de API en el cliente (`NEXT_PUBLIC_` solo para claves públicas).
- **Nunca** usar el directorio `/pages`. Solo `/app`.
- **Nunca** omitir validación Zod en endpoints de API.
- **Nunca** hacer lógica de negocio dentro de componentes React. Va en `/services`.
- **Nunca** subir imágenes sin procesar con Sharp primero.
- **Nunca** usar `useEffect` para fetch de datos. Usar Server Components o React Query.
- **Nunca** omitir caché estática (ej. `unstable_cache`) en consultas públicas (menú, perfil) para no agotar el Free Tier de Vercel/Supabase.
- **Nunca** usar `SUPABASE_SERVICE_ROLE_KEY` (admin client) para lecturas públicas. Usar siempre el cliente anónimo para respetar políticas RLS.

---

## ✅ Convenciones de código

### Estructura de archivos
```
/app
  /(auth)/          # rutas públicas (login, register)
  /(dashboard)/     # rutas protegidas del restaurante
  /api/             # API routes (Route Handlers)
/components
  /ui/              # componentes genéricos (Button, Input, Modal)
  /[modulo]/        # componentes específicos de cada módulo
/services
  /[modulo].ts      # lógica de negocio por módulo
/lib
  /supabase/        # cliente Supabase (server y client)
  /validations/     # schemas Zod
/types
  /database.ts      # tipos generados desde Supabase
  /[modulo].ts      # tipos de negocio
/utils
  /[funcion].ts     # helpers puros sin side effects
```

### Naming
- Componentes: `PascalCase` → `ReservationCard.tsx`
- Servicios y utils: `camelCase` → `getAvailableSlots.ts`
- Variables y funciones: `camelCase`
- Constantes: `UPPER_SNAKE_CASE`
- Tipos e interfaces: `PascalCase` con prefijo descriptivo → `ReservationFormData`
- Tablas Supabase: `snake_case` plural → `reservations`, `menu_items`

### Componentes
- Preferir Server Components por defecto
- Agregar `"use client"` solo cuando sea necesario (eventos, estado local, hooks)
- Props siempre tipadas con interfaces nombradas, nunca inline
- Un componente = un archivo = una responsabilidad

### API Routes
- Siempre validar body/params con Zod antes de cualquier lógica
- Siempre verificar sesión antes de acceder a datos
- Respuestas consistentes: `{ data, error }` o `{ success, message }`
- Usar códigos HTTP correctos (201 para create, 400 para validación, 401/403 para auth)

---

## 🔒 Seguridad — Multi-Tenant

Este es un sistema multi-tenant. Cada restaurante es un tenant independiente.

### Reglas de oro:
1. **Toda** query a la base de datos debe incluir `restaurant_id` del usuario autenticado
2. **Nunca** confiar en el `restaurant_id` que viene del cliente. Siempre obtenerlo desde la sesión
3. Row Level Security (RLS) está activo en **todas** las tablas. No desactivarlo nunca
4. Verificar siempre que el recurso solicitado pertenece al tenant del usuario autenticado
5. Para consultas públicas o cacheadas, usar `supabaseAnon` para respetar RLS (ej: `active = true`) y nunca el service role key.

```typescript
// ✅ CORRECTO
const { data: session } = await supabase.auth.getSession()
const restaurantId = session.user.user_metadata.restaurant_id // desde sesión
const items = await supabase.from('menu_items').select('*').eq('restaurant_id', restaurantId)

// ❌ INCORRECTO
const { restaurantId } = await request.json() // nunca del cliente
```

---

## 🎨 Design System — "Teal & Ember"

### Filosofía
- **Mobile-first**: cada pixel cuenta en pantalla pequeña
- **Compacto**: spacing reducido (8-12px gaps), padding ajustado
- **Tonal Depth**: profundidad via capas de superficie, no sombras pesadas
- **"No-Line Rule"**: separar secciones con cambio de fondo, no con bordes

### Modos de Color
- **Dark mode**: Landing restaurante, carta, dashboard, super admin
- **Light mode**: Solo la landing SaaS (venta del servicio)

### Paleta de Colores (CSS Variables en `globals.css` + Tailwind tokens)

| Token | Dark Mode | Light Mode | Uso |
|---|---|---|---|
| `--primary` | `#6BD8CB` | `#29A195` | Acciones, links, iconos activos |
| `--primary-container` | `#29A195` | `#E0F7F5` | Botones CTA (gradiente), badges |
| `--on-primary-container` | `#00302B` | `#00201D` | Texto sobre primary-container |
| `--tertiary` | `#FFB95F` | `#CA8100` | Precios, alertas, acentos cálidos |
| `--tertiary-container` | `#CA8100` | `#FEF3C7` | CTAs secundarios ámbar |
| `--surface` | `#0F1413` | `#F8FAFC` | Background principal |
| `--surface-container-low` | `#171D1C` | `#F0F4F3` | Secciones alternas |
| `--surface-container` | `#1B2120` | `#FFFFFF` | Cards, contenedores |
| `--surface-container-high` | `#262B2A` | `#E4EAE8` | Hover, inputs |
| `--surface-container-highest` | `#303635` | `#D5DCDA` | Elementos elevados |
| `--surface-bright` | `#353A39` | `#FFFFFF` | Nav flotante (con blur) |
| `--on-surface` | `#DEE4E1` | `#0F1413` | Texto principal |
| `--on-surface-variant` | `#BCC9C6` | `#3D4947` | Texto secundario |
| `--outline` | `#879391` | `#879391` | Bordes visibles |
| `--outline-variant` | `#3D4947` | `#E2E8F0` | Bordes sutiles |
| `--secondary` | `#A6CFC8` | `#274D48` | Elementos secundarios |
| `--secondary-container` | `#274D48` | `#C2EBE3` | Chips, tags |
| `--error` | `#FFB4AB` | `#EF4444` | Errores |
| `--success` | `#6BD8CB` | `#10B981` | Éxito |

### Tipografía
- **Font**: `Inter` para todo (headlines, body, labels)
- **Escala compacta**:
  - `text-xs`: 12px (labels, captions)
  - `text-sm`: 13-14px (body, menu items)
  - `text-base`: 16px (subtítulos)
  - `text-lg`: 20px (títulos de sección)
  - `text-xl`: 24px (títulos de página)
  - `text-2xl`: 28px (hero headlines)
- **Weights**: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)
- **Letter spacing**: `-0.02em` en headlines para feel editorial

### Espaciado y Dimensiones
- **Base unit**: 4px
- **Component padding**: 8-12px
- **Section gaps**: 12-16px
- **Card padding**: 12-16px
- **Input height**: 40px
- **Button height**: 36-40px
- **Bottom nav height**: 56px (con backdrop-blur)
- **Border radius**: 8px (cards, inputs, botones), 99px (chips, badges)

### Componentes Clave
- **Botones Primary**: Gradiente `linear-gradient(135deg, primary-container, primary)`
- **Cards**: Background `surface-container`, sin sombras, borde sutil si es necesario
- **Chips/Tags**: `secondary-container` con border-radius `99px`
- **Inputs**: Background `surface-container-high`, sin borde inferior, estilo "tray"
- **Bottom Nav**: `surface-bright` al 70% opacity + `backdrop-blur(24px)`
- **Glass effects**: Para overlays y navs flotantes

### Iconos
- **Librería**: `lucide-react` únicamente
- **Tamaño**: 18-20px (nunca 24px)
- **Stroke**: 1.5

### Animaciones
- **Transiciones**: 150ms ease
- **Hover scale**: 1.02 (sutil)
- **Nunca**: bounce, spring, o efectos exagerados

### Reglas Visuales Absolutas
- **Nunca** usar negro puro (#000). Siempre `surface` (#0F1413)
- **Nunca** usar sombras pesadas tipo Material. Usar capas tonales
- **Nunca** usar texto blanco puro para body. Usar `on-surface-variant`
- **Precios siempre** en color `tertiary` (ámbar)
- **Loading states** con skeleton, nunca spinners en toda la pantalla
- **Feedback** de acciones con toast notifications (sonner)
- **Componentes de UI base** en `/components/ui/`

---

## 📦 Gestión de dependencias

- Antes de instalar una librería, evaluar si Supabase o Next.js ya lo resuelven nativamente
- Documentar en `CONTEXT.md` cualquier librería agregada con su justificación
- No instalar librerías de fecha distintas a `date-fns`
- Gestión de estado del servidor: React Query (`@tanstack/react-query`) o Server Actions
- Gestión de estado del cliente (si es necesario): Zustand (liviano, no Redux)

---

## 🔄 Git

- Branch `main`: solo código de producción estable
- Branch `dev`: integración. Todo PR va aquí primero
- Commits en español, formato: `tipo(scope): descripción`
  - tipos: `feat`, `fix`, `refactor`, `docs`, `chore`, `style`
  - ejemplo: `feat(reservas): agregar validacion de cupos por horario`
- Un PR = una funcionalidad. No mezclar cambios no relacionados
