# CONTEXT.md — Gastrolife

## Sesión: 13 de Abril, 2026

### Objetivo
Profesionalizar la personalización del Dashboard y Portal del Cliente, corrigiendo bugs de estabilidad y mejorando la UI/UX.

### Cambios realizados

#### 🔧 Estabilidad y Tipado (Engine)
- **Corrección de "Uncontrolled to Controlled"**: Se restauró el valor `primary_color` en el estado inicial del formulario de configuración.
- **Fix Tipado ThemeConfig**: Se agregó una index signature a la interfaz para compatibilidad con el tipo `Json` de Supabase.
- **Build Verification**: Se validó que el proyecto compila correctamente sin errores de TypeScript (`next build` exitoso).

#### 🎨 Sistema de Temas (Theme System)
- **Inyección de CSS Dinámico**: Se reescribió el layout del portal para inyectar variables de fuente y colores solo cuando están definidos, respetando la especificidad del modo claro/oscuro.
- **Carga de Fuentes**: Se implementó la carga real de 4 Google Fonts (`Inter`, `Roboto`, `Playfair Display`, `Montserrat`) mediante `next/font/google`.
- **Compatibilidad Tailwind v4**: Se revertieron los tokens `@theme inline` de radius a valores estáticos para asegurar estabilidad en el build.

#### 📱 UI/UX Portal del Cliente
- **Redes y Contacto**: Refactor completo del bar de iconos.
  - Diseño homogéneo con técnica de "Soft Tint" (10% opacidad del color de marca).
  - Animaciones de escala y sombras premium en hover.
  - Sincronización de pesos de línea y tamaños.
- **Horarios Claros**:
  - Los 7 días de la semana ahora son siempre visibles.
  - Los días cerrados muestran explícitamente el texto "Cerrado" en rojo sutil.

### Estado Actual
- **Dashboard**: Funcional y permite personalizar colores, fuentes y modos.
- **Portal**: Refleja dinámicamente los cambios del dashboard con una interfaz limpia y profesional.
- **Estabilidad**: Alta. Build pasando.

### Siguientes Pasos
1. **QA de Fuentes**: Verificar que la legibilidad sea óptima con Playfair Display en títulos de menú.
2. **Caché**: Implementar `unstable_cache` en las consultas del portal para optimizar el Free Tier de Supabase.
3. **Imágenes**: Validar el flujo de Sharp para el procesamiento de banners pesados.
