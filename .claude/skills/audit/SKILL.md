---
name: audit
description: Audita el código del proyecto buscando problemas de calidad, mejores prácticas y anti-patrones. Usa este skill cuando quieras verificar la salud del código o antes de hacer un release.
allowed-tools: Bash(npx eslint *), Bash(npx prettier *), Read, Grep, Glob
---

# Auditoría de Código - PixelFlow

Realiza una auditoría completa del proyecto. Sigue TODOS los pasos en orden y genera un reporte final.

## Paso 1: Lint y Formato

Ejecuta las herramientas automáticas y captura los resultados:

```bash
npx eslint src/ --ext .js,.jsx --format stylish 2>&1 || true
```

```bash
npx prettier --check 'src/**/*.{js,jsx,css,json}' 2>&1 || true
```

Registra el número total de errores y warnings de cada herramienta.

## Paso 2: Análisis de Patrones Problemáticos

Usa Grep para buscar cada uno de estos patrones en `src/` (excluyendo node_modules):

### Críticos
1. **console.log/warn/error en producción**: Busca `console\.(log|warn|error|debug|info)` en archivos `.js` y `.jsx`
2. **Debugger statements**: Busca `debugger` en archivos `.js` y `.jsx`
3. **Secrets/API keys hardcodeadas**: Busca patrones como `apiKey`, `secret`, `password`, `token` asignados a strings literales

### Warnings
4. **TODO/FIXME/HACK pendientes**: Busca `TODO|FIXME|HACK|XXX` en el código
5. **Inline styles**: Busca `style={{` en archivos `.jsx` — cada ocurrencia es un candidato para extraer a CSS
6. **Magic numbers**: Busca números literales en lógica (no en JSX props como width/height) que deberían ser constantes con nombre
7. **Funciones largas**: Lee los archivos en `src/hooks/` y `src/utils/` y identifica funciones con más de 50 líneas
8. **Componentes sin PropTypes**: Usa Glob para listar todos los `.jsx` en `src/components/`, lee cada uno y verifica si tienen PropTypes o validación de props definida

### Info
9. **Archivos duplicados**: Usa Glob para buscar archivos con el mismo nombre pero diferente extensión (ej: `App.js` y `App.jsx`)
10. **Dependencias no usadas**: Lee `package.json` para obtener las dependencias, luego usa Grep para verificar si cada una se importa en algún archivo de `src/`
11. **Imports no usados en archivos individuales**: Revisa los archivos principales buscando imports que no se referencian en el resto del archivo
12. **Archivos de componentes que existen pero no se importan en ningún lado**: Busca cada componente con Grep para ver si se importa en otros archivos

## Paso 3: Métricas del Proyecto

Recopila:
- Total de archivos JS/JSX en src/
- Total de archivos de test (*.test.js, *.test.jsx)
- Porcentaje estimado de cobertura de tests (archivos con test / archivos totales)
- Número de componentes React
- Número de custom hooks
- Número de archivos de utilidades

## Paso 4: Generar Reporte

Presenta los resultados en este formato exacto:

```
═══════════════════════════════════════════════
  REPORTE DE AUDITORÍA - PixelFlow
  Fecha: [fecha actual]
═══════════════════════════════════════════════

📊 MÉTRICAS DEL PROYECTO
──────────────────────────
- Archivos fuente: X
- Componentes: X
- Custom hooks: X
- Utilidades: X
- Tests: X (X% cobertura)

🔴 ERRORES CRÍTICOS (X encontrados)
──────────────────────────
[Lista cada problema con archivo:línea y descripción]

🟡 WARNINGS (X encontrados)
──────────────────────────
[Lista cada problema con archivo:línea y descripción]

🔵 INFO (X encontrados)
──────────────────────────
[Lista cada problema con archivo:línea y descripción]

📋 RESUMEN ESLINT
──────────────────────────
- Errores: X
- Warnings: X

📋 RESUMEN PRETTIER
──────────────────────────
- Archivos sin formatear: X

🛠️ CORRECCIONES SUGERIDAS
──────────────────────────
[Para cada problema crítico y warning, sugiere la corrección específica]

Para corregir automáticamente lint y formato:
  npm run lint:fix && npm run format
═══════════════════════════════════════════════
```
