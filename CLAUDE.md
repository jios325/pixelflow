# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PixelFlow is a client-side React 19 single-page application for batch image processing (optimize, resize, crop, format convert, rename). Built with Next.js 16 (App Router, static export), Ant Design v5, and pure JavaScript (no TypeScript). All processing happens in the browser — there is no backend. The UI is in Spanish.

## Commands

- **Dev server:** `npm run dev` (localhost:3000, Turbopack)
- **Production build:** `npm run build` (static export to `build/`)
- **Start:** `npm start` (serves production build)
- **Lint:** `npm run lint` (ESLint with strict React rules)
- **Lint fix:** `npm run lint:fix`
- **Format check:** `npm run format:check` (Prettier)
- **Format fix:** `npm run format`
- **Full audit:** `npm run audit:code` (ESLint + Prettier combined)

## Custom Skills (Claude Code)

- **`/audit`** — Auditoría completa del código: ejecuta ESLint/Prettier, busca console.logs, archivos sin usar, componentes sin PropTypes, magic numbers, funciones largas, y genera un reporte categorizado.
- **`/migrate-nextjs`** — Guía paso a paso para migrar de CRA a Next.js 16 con App Router. Pide confirmación en cada etapa.

## Code Quality

- **ESLint:** `.eslintrc.json` extiende `react-app` + `prettier`. Reglas: warn en console, no unused vars, eqeqeq, prefer-const, no-magic-numbers, hooks rules.
- **Prettier:** `.prettierrc` — single quotes, semicolons, 2 spaces, trailing commas ES5, 100 char width.
- **Git hooks:** Husky pre-commit ejecuta lint-staged (ESLint fix + Prettier write en archivos staged).
- **PropTypes:** Todos los componentes en `src/components/` tienen validación de props con `prop-types`.
- **Logger:** `src/lib/logger.js` — logger condicional que solo imprime en desarrollo. Usar `logger.log/warn/error/info/debug` en vez de `console.*`.
- **Constants:** `src/lib/constants.js` — magic numbers extraídos a constantes con nombre (thresholds, batch sizes, quality values, dimensions).

## Import Aliases

El proyecto usa `@/` como alias para `./src/` (configurado en `jsconfig.json`). Next.js lo resuelve automáticamente.

```js
// Correcto
import UploadArea from '@/components/ImageUploader/UploadArea';
import logger from '@/lib/logger';
import { useBrand } from '@/context/BrandContext';

// Incorrecto — no usar paths relativos con ../
import UploadArea from '../../components/ImageUploader/UploadArea';
```

Excepciones: imports dentro del mismo directorio (`./sibling`) son aceptables en `src/lib/`.

## Architecture

### Folder Structure

```
app/                          # Next.js App Router (routing layer)
  layout.jsx                  # Root layout (metadata, global CSS)
  [[...slug]]/
    page.jsx                  # Catch-all route (static export)
    client.jsx                # 'use client' wrapper (BrandProvider + dynamic App)
src/                          # Application source code
  App.jsx                     # Main app component
  index.css                   # Global styles
  components/
    Common/                   # Shared UI (BrandConfigPanel, BrandLogo, ColorPicker)
    DownloadButton.jsx
    ImageProcessor/           # ProcessedImagesList
    ImageUploader/            # UploadArea, UploadedImagesList
    RenameTools/              # RenamePanel, AddTextRename, ReplaceTextRename, SequentialRename
    Tools/                    # ToolsPanel, ResizeTool, CropTool
  config/                     # App configuration (brandConfig)
  context/                    # React contexts (BrandContext)
  hooks/                      # Custom hooks (useImageUpload, useImageProcessor, useImageRename)
  lib/                        # Utilities (logger, constants, fileValidation, imageProcessing, memoryManager)
```

### State Management

No routing library — single view app. State is managed via custom hooks and React Context:

- **`BrandContext`** (`src/context/BrandContext.jsx`): Brand/theme settings persisted to `localStorage` key `pixelflow_brand_settings`. Access via `useBrand()` hook.
- **`useImageUpload`** (`src/hooks/useImageUpload.js`): Upload state, batch loading (3 at a time), large file detection (>10MB → low-res preview), memory cleanup.
- **`useImageProcessor`** (`src/hooks/useImageProcessor.js`): Processing settings and pipeline. Manual trigger via button. Operations applied in order: Optimization → Resize → Crop → Format conversion.
- **`useImageRename`** (`src/hooks/useImageRename.js`): Reactive renaming via `useEffect` (sequential, add text, replace text modes).

### Data Flow

```
uploadedImages (useImageUpload)
    → [manual trigger] → processedImages (useImageProcessor)
    → [reactive useEffect] → renamedImages (useImageRename)
    → ProcessedImagesList + DownloadButton
```

### Image Processing Pipeline (all client-side)

1. **Optimize:** `browser-image-compression` (max 1MB, max 1920px)
2. **Resize:** `react-image-file-resizer` (px/% units, aspect ratio preserved)
3. **Crop:** Custom canvas implementation with position support
4. **Format convert:** Custom canvas-based (`canvas.toBlob()`) — JPG, PNG, WEBP, GIF

### Key Libraries

- `next` v16 — framework (App Router, static export, Turbopack)
- `antd` v5 — UI components (CSS-in-JS, imports `antd/dist/reset.css` for CSS reset)
- `browser-image-compression` — image optimization
- `react-image-file-resizer` — image resizing
- `jszip` + `file-saver` — ZIP creation and download for batch export
- `prop-types` — runtime prop validation

### Batch Processing

Upload batches: 3 images at a time. Download batches: 5 at a time. Constants defined in `src/lib/constants.js`. Memory management utility at `src/lib/memoryManager.js` handles low-res previews, memory estimation, and URL.revokeObjectURL cleanup.

## Caveats

- Primary brand color is violet (`#a855f7`).
- The app runs as a SPA via Next.js static export (`output: 'export'` in `next.config.mjs`). The catch-all route `app/[[...slug]]/` renders the client-side App component with SSR disabled.
- Turbopack root is set to `__dirname` in `next.config.mjs` to avoid lockfile detection warnings.
