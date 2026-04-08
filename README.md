# 🍽️ Gastroflow — Gestión Inteligente para Restaurantes

**Gastroflow** es una plataforma SaaS multi-tenant diseñada para unificar la operación de restaurantes modernos en un solo ecosistema digital. Orientada a mejorar la experiencia del cliente y optimizar la gestión del Maitre.

[![Vercel Deployment](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://gastroflow-cl.vercel.app)

---

## 🚀 Características Principales

- **Carta QR Inmersiva:** Menú digital de alta velocidad optimizado para móviles con sistema de alérgenos y precios de oferta.
- **Gestión de Reservas:** Sistema de disponibilidad en tiempo real con validación automática de slots y capacidad de mesa.
- **Club de Fidelización:** Billetera digital para clientes, acumulación de puntos por visita y escáner QR dinámico para el administrador.
- **Dashboard Multi-tenant:** Panel administrativo independiente para cada restaurante con analíticas, gestión de menú y control de reservas.
- **Seguridad de Grado Bancario:** Aislamiento total entre restaurantes mediante Row Level Security (RLS) en el nivel de base de datos.

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología |
|---|---|
| **Framework** | Next.js 16+ (App Router) + Turbopack |
| **Backend** | Supabase (PostgreSQL, Auth, Storage, Edge Functions) |
| **Estilos** | Tailwind CSS v4 (Liquid Design System) |
| **Validación** | Zod (Cliente & Servidor) |
| **Caché** | React Query + Next.js Static Data Fetching (unstable_cache) |
| **Imágenes** | Sharp (Optimización on-the-fly) |
| **Email** | Resend |

---

## 🔒 Derechos de Autor y Licencia

**© 2024 Felipe Ramírez (faru1983). Todos los derechos reservados.**

Este proyecto es de **propiedad privada**. Queda estrictamente prohibida la copia, reproducción, distribución, modificación o uso comercial de cualquier parte de este código fuente sin el permiso expreso y por escrito del autor. 

El código se mantiene público exclusivamente con fines de portafolio y demostración de arquitectura, pero no se otorga ninguna licencia de uso gratuito (No-License).

---

## 📋 Requisitos e Instalación

1. Clonar el repositorio.
2. Instalar dependencias: `npm install`.
3. Configurar variables de entorno en `.env.local` (Supabase URL, Anon Key, Service Role).
4. Ejecutar entorno de desarrollo: `npm run dev`.

---

> Desarrollado con tecnología de punta para el mercado gastronómico chileno e internacional.
