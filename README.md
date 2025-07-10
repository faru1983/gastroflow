#  gastronflow

Bienvenido a GastroFlow, la solución digital todo en uno diseñada para revolucionar la gestión y la experiencia del cliente en restaurantes. Este proyecto ha sido desarrollado con tecnologías web modernas para ofrecer una plataforma rápida, interactiva y escalable.

## ✨ Características Principales

GastroFlow ofrece una suite completa de herramientas tanto para los clientes del restaurante como para sus administradores:

*   **Menú Digital Interactivo:** Una carta digital elegante donde los clientes pueden explorar productos, ver detalles, precios e imágenes, con filtros por categorías.
*   **Sistema de Reservas:** Un flujo de reservas intuitivo que permite a los clientes asegurar su mesa en pocos pasos.
*   **Programa de Fidelización por QR:** Un sistema de lealtad donde los clientes registran sus visitas escaneando un código QR para acumular puntos y obtener beneficios exclusivos.
*   **Perfil de Usuario Personalizado:** Los clientes pueden gestionar su información, ver su historial de visitas, reservas y acceder a sus beneficios acumulados.
*   **Resumen de Reseñas con IA:** Utiliza un modelo de lenguaje para analizar y resumir las reseñas de clientes, destacando los puntos positivos para atraer a nuevos comensales.

## 🚀 Pila Tecnológica (Tech Stack)

Este proyecto está construido sobre una base moderna y robusta, enfocada en el rendimiento y la experiencia de desarrollo:

*   **Framework:** [Next.js](https://nextjs.org/) (App Router)
*   **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
*   **UI/Componentes:** [React](https://react.dev/), [ShadCN UI](https://ui.shadcn.com/)
*   **Estilos:** [Tailwind CSS](https://tailwindcss.com/)
*   **Inteligencia Artificial:** [Google AI & Genkit](https://firebase.google.com/docs/genkit)
*   **Formularios:** [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)

## 🛠️ Cómo Empezar

Sigue estos pasos para levantar el proyecto en un entorno de desarrollo local.

### Prerrequisitos

*   Node.js (versión 18 o superior)
*   npm, pnpm o yarn

### Instalación

1.  Clona el repositorio en tu máquina local:
    ```bash
    git clone https://github.com/tu-usuario/gastroflow.git
    cd gastroflow
    ```

2.  Instala las dependencias del proyecto:
    ```bash
    npm install
    ```

### Ejecución

1.  **Variables de Entorno:**
    Para utilizar las funcionalidades de IA, necesitarás una clave de API de Google AI Studio. Renombra el archivo `.env.example` a `.env` y añade tu clave:
    ```
    GEMINI_API_KEY=TU_API_KEY_AQUI
    ```

2.  **Iniciar el Servidor de Desarrollo:**
    Para correr la aplicación Next.js y el servidor de Genkit (para la IA) simultáneamente, puedes usar dos terminales:

    *   En la primera terminal, inicia la aplicación web:
        ```bash
        npm run dev
        ```
        La aplicación estará disponible en `http://localhost:3000`.

    *   En la segunda terminal, inicia los flujos de Genkit:
        ```bash
        npm run genkit:watch
        ```

¡Y listo! Ahora tienes el proyecto GastroFlow corriendo localmente.

## 📂 Estructura del Proyecto

El proyecto sigue la estructura recomendada por Next.js App Router, organizando el código de forma modular y escalable:

```
src
├── ai/                # Flujos y configuración de Genkit para IA
├── app/               # Rutas de la aplicación (App Router)
│   ├── (main)/        # Grupo de rutas para la app principal
│   └── layout.tsx     # Layout raíz
├── components/        # Componentes reutilizables (UI, íconos)
├── contexts/          # Contextos de React (ej. AuthContext)
├── hooks/             # Hooks personalizados (ej. usePagination)
├── lib/               # Lógica auxiliar, tipos y datos estáticos
└── public/            # Archivos estáticos
```

## 🔮 Próximos Pasos

Este proyecto está diseñado para ser la base de una solución SaaS completa. Los próximos pasos en la hoja de ruta incluyen:

*   **Desarrollo del Backend:** Migrar la lógica de datos a **Firebase Firestore** para una gestión dinámica.
*   **Arquitectura Multi-Tenant:** Adaptar la base de datos para dar soporte a múltiples restaurantes.
*   **Panel de Administración:** Crear una interfaz de administrador para gestionar la carta, reservas y configuraciones.
*   **Sistema de Suscripciones:** Integrar **Stripe** para manejar los planes de pago de los restaurantes.
Hola!