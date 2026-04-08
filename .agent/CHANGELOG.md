# CHANGELOG.md — Historial de cambios

> Actualizar este archivo después de cada sesión de trabajo o PR mergeado.
> La IA debe leer las últimas 3 entradas antes de comenzar a trabajar.
> Formato: `## [fecha] — Descripción breve`

---

## [TEMPLATE — copiar para cada entrada]

```
## [YYYY-MM-DD] — Título del cambio

### ✅ Completado
- Lista de lo que se construyó o arregló

### 🔄 En progreso
- Lo que quedó a medias y cómo está

### ⚠️ Decisiones tomadas
- Decisiones importantes que afectan el código futuro

### 🐛 Bugs conocidos
- Bugs encontrados, no resueltos aún

### 📋 Próximo paso
- Qué debe hacerse en la siguiente sesión (ser específico)
```

---

## [2026-04-07] — FASE 0: Fundaciones y Core UI

### ✅ Completado
- Inicialización del proyecto con **Next.js 16.2.2** y **Tailwind v4**.
- Implementación completa del **Design System "Teal & Ember"** en `globals.css` via `@theme`.
- Configuración de **Supabase Auth** (Middleware, Browser/Server Clients).
- Desarrollo de componentes UI base: `Button`, `Input`, `Card`, `Badge`, `Modal`, `Skeleton`.
- Creación de páginas core verificadas:
  - **Landing SaaS (/)**: Light mode, responsive.
  - **Login (/login)**: Dark mode, validación, feedback con Sonner.
  - **Register (/register)**: Creación de restaurant tenant integrada con Auth.
- Migración BD: Tabla `super_admins` y campos de perfil en `restaurants`.
- **Limpieza**: Movidos `AGENTS.md` y `CLAUDE.md` a la carpeta `.agent/` para centralizar la configuración.

### ⚠️ Decisiones tomadas
- Se usará un **login unificado**: `/login` detecta si es `super_admin` o `restaurant_owner`.
- El diseño es estrictamente **Mobile-First** con tonal depth (no bordes pesados).
- Se implementó un guard clause en el middleware para evitar crashes si las variables de entorno no están presentes.

### 📋 Próximo paso
- FASE 1: Implementar **Landing del Restaurante** (`/[slug]`) y **Carta Digital QR**.
- Generar tipos automáticos de Supabase para TypeScript.

