# TASKS.md — Roadmap y Tareas Detalladas

> Lista ordenada de todo lo que hay que construir. La IA debe revisar este archivo para entender qué construir, en qué orden y con qué criterios.
> Marcar cada tarea con su estado al completarla.
> Estados: 🔲 Pendiente · 🔄 En progreso · ✅ Hecho · ⛔ Bloqueado

---

## FASE 0 — Fundaciones (hacer primero, todo lo demás depende de esto)

### 0.1 Base de datos
- ✅ Crear migración SQL con tablas base y perfil (creada super_admins)
- ✅ Activar RLS en todas las tablas
- ✅ Crear políticas RLS: un usuario solo lee/escribe sus propios datos (`restaurant_id`)
- 🔲 Crear tipos TypeScript desde Supabase (`supabase gen types typescript`)
- 🔲 Crear seed de datos de prueba para desarrollo

### 0.2 Autenticación y Onboarding
- ✅ Página de registro (`/register`): email + password + nombre del restaurante
- ✅ Al registrarse: crear fila en `restaurants`, guardar `restaurant_id` en `user_metadata`
- ✅ Activar trial de 30 días automáticamente al crear el tenant
- ✅ Página de login (`/login`)
- ✅ Middleware Next.js: proteger rutas `/dashboard/*` → redirigir a login si no hay sesión
- 🔲 Middleware: si suscripción expirada → redirigir a `/planes` (pendiente lógica billing)

### 0.3 Layout base del Dashboard
- 🔲 Sidebar de navegación con links a todos los módulos
- 🔲 Header con nombre del restaurante, plan activo y avatar del usuario
- 🔲 Banner de trial: "Te quedan X días de prueba" con CTA a planes
- 🔲 Layout responsive: sidebar colapsable en mobile

---

## FASE 1 — Módulos core (valor inmediato para el restaurante)

### 1.1 Carta Digital — Panel Admin
- 🔲 Página `/dashboard/menu` con listado de categorías y productos
- 🔲 CRUD de categorías (crear, editar, reordenar, activar/desactivar)
- 🔲 CRUD de productos:
  - Campos: nombre, descripción, precio, precio oferta, imagen, categoría, estado
  - Upload de imagen → procesar con Sharp (resize a 800px, convertir a webp, comprimir)
  - Guardar imagen en Supabase Storage bajo `/{restaurant_id}/menu/{item_id}.webp`
- 🔲 Toggle activo/inactivo sin eliminar (soft delete)
- 🔲 Drag & drop para reordenar productos dentro de una categoría

### 1.2 Carta Digital — Vista Pública (QR)
- ✅ Ruta pública: `/[slug]/menu` (Optimizado para mobile)
- ✅ Renderizar categorías y productos activos del restaurante
- ✅ Diseño responsive premium "Teal & Ember"
- ✅ Sin login requerido para el cliente
- 🔲 Página de generación del QR en el panel admin (`/dashboard/menu/qr`)

### 1.3 Sistema de Reservas — Configuración
- 🔲 Página `/dashboard/reservations/settings`
- 🔲 Crear slots de horario: día de la semana + hora + capacidad máxima
- 🔲 Activar/desactivar slots sin eliminarlos
- 🔲 Definir anticipación mínima y máxima para reservar (ej: mín 2h, máx 30 días)

### 1.4 Sistema de Reservas — Gestión
- 🔲 Página `/dashboard/reservations` con vista del día (por defecto hoy)
- 🔲 Filtrar por fecha
- 🔲 Acciones por reserva: confirmar, cancelar, marcar como llegó
- 🔲 Badge con estado de cada reserva (pendiente / confirmada / cancelada / completada)

### 1.5 Sistema de Reservas — Vista Pública
- ✅ Ruta pública: `/[slug]/reservar` (Modo oscuro, mobile-first)
- ✅ Formulario: fecha, hora (slots dinámicos), cantidad de personas, datos cliente
- ✅ Validar disponibilidad básica en tiempo real
- 🔲 Enviar email de confirmación al cliente con Resend
- 🔲 Enviar email de notificación al restaurante

---

## FASE 2 — Fidelización

### 2.1 Fidelización — Setup
- 🔲 Página `/dashboard/loyalty/settings`
- 🔲 Configurar regla de puntos: `X puntos por cada $Y gastados`
- 🔲 Crear catálogo de recompensas (nombre, puntos requeridos, activa)

### 2.2 Fidelización — Registro de clientes
- 🔲 Ruta pública: `/cliente/[slug]/registro`
- 🔲 Formulario: nombre, email, teléfono
- 🔲 Al registrarse: generar QR único para ese cliente en ese restaurante
- 🔲 Mostrar QR en pantalla + opción de enviar por email
- 🔲 Página del cliente: `/cliente/[slug]/[qr-token]` → ver puntos, historial, recompensas

### 2.3 Fidelización — Escaneo del garzón
- 🔲 Página protegida (solo staff): `/dashboard/loyalty/scan`
- 🔲 Input para ingresar QR del cliente (cámara o texto)
- 🔲 Formulario: monto total, cantidad de personas
- 🔲 Calcular y registrar puntos según la regla configurada
- 🔲 Mostrar resumen: cliente, visita #N, puntos ganados, total acumulado

---

## FASE 3 — Panel Admin y Analítica

### 3.1 Clientes
- 🔲 Página `/dashboard/customers` con tabla de todos los clientes
- 🔲 Búsqueda por nombre o email
- 🔲 Vista detalle de cliente: visitas, consumo total, puntos, reservas

### 3.2 Analítica
- 🔲 Página `/dashboard/analytics`
- 🔲 Métricas: ingresos estimados, ticket promedio, clientes nuevos vs recurrentes
- 🔲 Gráfico: reservas por día (últimos 30 días)
- 🔲 Top 5 productos más vendidos (si se registra consumo)
- 🔲 Días y horarios más concurridos

### 3.3 Marketing
- 🔲 Página `/dashboard/marketing`
- 🔲 Selector de segmento: todos los clientes / clientes sin visitar en X días / top clientes
- 🔲 Editor de email (asunto + cuerpo con preview)
- 🔲 Envío via Resend con tracking básico

---

## FASE 4 — Suscripciones y Pagos

### 4.1 Planes
- 🔲 Página pública `/planes` con comparativa de planes
- 🔲 Página `/dashboard/billing` con plan actual, próximo cobro, historial

### 4.2 Stripe (internacional)
- 🔲 Crear productos y precios en Stripe Dashboard
- 🔲 Checkout de Stripe al seleccionar plan
- 🔲 Webhook: actualizar `subscriptions` table al recibir eventos de Stripe
  - `checkout.session.completed` → activar suscripción
  - `invoice.payment_failed` → marcar como pago pendiente
  - `customer.subscription.deleted` → suspender

### 4.3 Transbank (Chile)
- 🔲 Integrar Webpay para cobro inicial
- 🔲 Integrar Oneclick para cobros recurrentes mensuales
- 🔲 Webhook equivalente para actualizar estado de suscripción

---

## FASE 5 — Pulido y lanzamiento

- 🔲 SEO básico en páginas públicas (metadata, og:image)
- 🔲 Error boundaries en todas las páginas del dashboard
- 🔲 Loading skeletons en todas las listas y tablas
- 🔲 Empty states diseñados (cuando no hay reservas, productos, etc.)
- 🔲 Onboarding checklist para restaurantes nuevos ("completa tu perfil", "crea tu primer plato"...)
- 🔲 Tests E2E de los flujos críticos (registro, reserva, escaneo fidelización)
- 🔲 Revisión de performance: Core Web Vitals en verde
- 🔲 Documentación de API interna

