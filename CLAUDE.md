# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PixelFlow is a client-side React 19 single-page application for batch image processing (optimize, resize, crop, format convert, rename). Built with Create React App, Ant Design v4, and pure JavaScript (no TypeScript). All processing happens in the browser — there is no backend. The UI is in Spanish.

## Commands

- **Dev server:** `npm start` (localhost:3000)
- **Production build:** `npm build`
- **Tests:** `npm test` (Jest via react-scripts; `npm test -- --watchAll=false` for single run)
- **Run single test:** `npm test -- --testPathPattern=<pattern>`
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

## Architecture

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

- `antd` v4 — UI components (imports legacy CSS `antd/dist/antd.min.css`)
- `browser-image-compression` — image optimization
- `react-image-file-resizer` — image resizing
- `jszip` + `file-saver` — ZIP creation and download for batch export

### Batch Processing

Upload batches: 3 images at a time. Download batches: 5 at a time. Memory management utility at `src/utils/memoryManager.js` handles low-res previews, memory estimation, and URL.revokeObjectURL cleanup.

## Caveats

- Two App files exist: `App.js` (unused placeholder) and `App.jsx` (real entry). `index.js` imports `App.jsx`.
- `theme.js` is defined but never imported/used.
- `FormatTool.jsx`, `OptimizeTool.jsx`, `RenameOptions.jsx` exist as standalone components but are NOT used by their parent containers — the parents implement inline versions instead.
- Some utility functions are duplicated across `fileHelpers.js` and `fileValidation.js`.
- `pica` is listed as a dependency but is not imported anywhere in source code.
- Primary brand color is violet (`#a855f7`).
