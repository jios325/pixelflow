---
name: migrate-nextjs
description: Migra el proyecto PixelFlow de Create React App a Next.js 16 con App Router. Guía paso a paso con confirmación del usuario en cada etapa.
disable-model-invocation: true
allowed-tools: Bash, Read, Write, Edit, Glob, Grep
---

# Migración de CRA a Next.js 16 - PixelFlow

Guía al usuario paso a paso para migrar de Create React App a Next.js 16 con App Router.

**IMPORTANTE**: No ejecutes todos los pasos de golpe. Presenta cada paso, explica qué hace, y pide confirmación antes de ejecutar. Si algo falla, diagnostica y resuelve antes de continuar.

## Pre-migración: Verificar estado actual

1. Ejecuta `git status` para asegurar que no hay cambios sin commitear
2. Si hay cambios pendientes, sugiere al usuario hacer commit primero
3. Lee `package.json` para confirmar las dependencias actuales
4. Lee `src/index.js` y `public/index.html` para entender el entry point actual

## Paso 1: Crear rama de migración

```bash
git checkout -b feature/migrate-to-nextjs
```

## Paso 2: Instalar Next.js

```bash
npm install next@latest
```

Verifica que React y React-DOM sean compatibles (>=19). Si no, actualiza:
```bash
npm install react@latest react-dom@latest
```

## Paso 3: Crear `next.config.mjs`

Crea el archivo en la raíz del proyecto:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // SPA mode — quitar después para habilitar SSR
  distDir: 'build',
};

export default nextConfig;
```

## Paso 4: Crear estructura de App Router

### 4.1 Crear `app/layout.jsx`

Lee `public/index.html` y migra los meta tags al Metadata API de Next.js. Importa los CSS globales aquí (como `antd/dist/antd.min.css` y el CSS del proyecto).

```jsx
import '../src/index.css';
import 'antd/dist/antd.min.css';

export const metadata = {
  title: 'PixelFlow',
  description: 'Herramienta de procesamiento de imágenes por lotes',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/logo192.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
```

### 4.2 Crear `app/[[...slug]]/page.jsx` (catch-all route)

```jsx
import Client from './client';

export default function Page() {
  return <Client />;
}
```

### 4.3 Crear `app/[[...slug]]/client.jsx`

```jsx
'use client';

import dynamic from 'next/dynamic';

const App = dynamic(() => import('../../src/App.jsx'), { ssr: false });

export default function Client() {
  return <App />;
}
```

## Paso 5: Migrar variables de entorno

Busca con Grep cualquier referencia a `REACT_APP_` en `src/` y renómbralas a `NEXT_PUBLIC_`. Verifica también archivos `.env*`.

## Paso 6: Actualizar imports de imágenes estáticas

En Next.js, `import logo from './logo.png'` devuelve un objeto, no un string. Busca todos los imports de imágenes en `src/` y verifica que se usen correctamente. Si se pasan a `<img src={...}>`, necesitan `.src`.

Busca patrones:
- `import.*from.*\.(png|jpg|jpeg|svg|gif|webp)`
- Verifica si se usan en `src={}` props

## Paso 7: Actualizar `package.json` scripts

```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint src/ app/ --ext .js,.jsx",
  "lint:fix": "eslint src/ app/ --ext .js,.jsx --fix",
  "format": "prettier --write '{src,app}/**/*.{js,jsx,css,json}'",
  "format:check": "prettier --check '{src,app}/**/*.{js,jsx,css,json}'"
}
```

Elimina los scripts de `react-scripts` (start, build, test, eject).

## Paso 8: Limpiar artefactos de CRA

Elimina estos archivos/dependencias que ya no se necesitan:
- `public/index.html` (reemplazado por `app/layout.jsx`)
- `src/index.js` (reemplazado por App Router entry point)
- `src/reportWebVitals.js` (Next.js tiene su propia métrica)
- `src/App.js` (archivo placeholder no usado, mantener `src/App.jsx`)
- Dependencia `react-scripts` del `package.json`
- Dependencia `web-vitals` (opcional, Next.js lo maneja internamente)

```bash
npm uninstall react-scripts web-vitals
```

## Paso 9: Agregar `.gitignore` entries para Next.js

Agrega al `.gitignore`:
```
# Next.js
.next/
out/
```

## Paso 10: Verificar la migración

```bash
npm run dev
```

Abre http://localhost:3000 y verifica:
- La app carga correctamente
- Las imágenes se suben y procesan
- La personalización de marca funciona
- La descarga ZIP funciona
- Los estilos se ven correctos (Ant Design CSS cargado)

Si hay errores, revisa la consola del navegador y los logs del servidor de desarrollo.

## Paso 11: Sugerencias post-migración

Una vez que la app funcione, sugiere al usuario estos pasos incrementales (NO ejecutar automáticamente):

1. **`next/image`**: Reemplazar `<img>` por `<Image>` de Next.js para optimización automática
2. **`next/font`**: Usar el sistema de fonts de Next.js para eliminar FOUT
3. **Server Components**: Mover lógica que no necesite interactividad a Server Components
4. **Quitar `output: 'export'`**: Para habilitar SSR/SSG si se despliega en Vercel u otro servidor Node
5. **App Router routing**: Si se necesitan rutas adicionales, usar el sistema de carpetas de Next.js en vez de un router de terceros
6. **TypeScript**: Considerar migrar a TypeScript incrementalmente (`npx next typescript`)
