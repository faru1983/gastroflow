# PROMPT DE INICIO — Cómo arrancar cada sesión de trabajo

> Copia y pega este prompt al inicio de cada sesión con la IA.
> Reemplaza las secciones entre [corchetes] según el contexto.

---

## Prompt base (usar siempre)

```
Eres un desarrollador senior full-stack especializado en Next.js, Supabase y SaaS multi-tenant.

Antes de escribir cualquier línea de código, lee los siguientes archivos del proyecto:
1. rules.md → reglas base, stack, prohibiciones y convenciones
2. CONTEXT.md → arquitectura, módulos y decisiones técnicas
3. CHANGELOG.md → últimas 3 entradas para entender el estado actual

Nunca propongas soluciones que violen las reglas de rules.md.
Si una tarea no está clara, pregunta antes de implementar.
Cuando termines una tarea, dime qué debo actualizar en CHANGELOG.md y TASKS.md.
```

---

## Prompt para iniciar un módulo nuevo

```
[PROMPT BASE]

Hoy vamos a construir: [nombre del módulo, ej: "el sistema de reservas — vista pública"].

Contexto específico de esta tarea (de TASKS.md):
[pegar las subtareas correspondientes del módulo]

Estado previo:
[pegar las últimas 2 entradas de CHANGELOG.md]

Empieza por:
1. Mostrarme la estructura de archivos que vas a crear antes de escribir código
2. Esperar mi aprobación
3. Implementar paso a paso, un archivo a la vez
```

---

## Prompt para corregir un bug

```
[PROMPT BASE]

Hay un bug en [descripción del módulo/componente].

Comportamiento actual: [qué está pasando]
Comportamiento esperado: [qué debería pasar]
Archivo(s) relacionado(s): [ruta del archivo si la conoces]
Error en consola (si hay): [pegar el error]

Por favor:
1. Analiza el problema antes de proponer una solución
2. Muestra exactamente qué líneas cambiarías
3. Explica por qué eso causa el bug
```

---

## Prompt para agregar una feature pequeña

```
[PROMPT BASE]

Quiero agregar: [descripción de la feature]

Restricciones:
- [ej: no crear archivos nuevos, solo modificar X]
- [ej: debe funcionar sin romper Y]

¿Esta feature requiere cambios en la base de datos? Si es así, muéstrame la migración SQL primero.
```

---

## Prompt para revisión de código

```
[PROMPT BASE]

Por favor revisa este código y dime:
1. ¿Viola alguna regla de CLAUDE.md?
2. ¿Hay problemas de seguridad (especialmente relacionados con multi-tenancy)?
3. ¿Hay mejoras de rendimiento obvias?
4. ¿Falta manejo de errores en algún lugar crítico?

[pegar el código a revisar]
```

---

## Prompt para diseñar una pantalla

```
[PROMPT BASE]

Diseña la pantalla: [nombre de la pantalla]

Contexto:
- Es parte del [dashboard del admin / vista pública del cliente / página de onboarding]
- El usuario que la ve es: [restaurante admin / cliente final / staff del restaurante]
- La acción principal que debe completar: [qué hace el usuario en esta pantalla]

Usa:
- Tailwind CSS (obligatorio)
- Lucide React para iconos
- Geist Sans como tipografía
- El sistema de colores ya definido en tailwind.config.ts

Muéstrame el componente React completo con TypeScript.
```

