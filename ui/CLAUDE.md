# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the React frontend for [karma](https://github.com/prymitive/karma), an alert dashboard for Prometheus Alertmanager. The UI is built with React 19, TypeScript, MobX for state management, and Vite as the build tool. The built output is embedded into the Go backend via `embed.go`.

## Commands

- **Dev server:** `npm start` (runs on port 3000, proxies to backend at `localhost:8080`)
- **Build:** `npm run build` (runs `tsc && vite build`, output in `dist/`)
- **Run all tests:** `npm test`
- **Run a single test:** `npx jest path/to/file.test.tsx`
- **Run tests with coverage:** `CI=true npm test -- --coverage`
- **Update snapshots:** `CI=true npm test -- -u`
- **Format:** `npx prettier --write 'src/**/*.ts' 'src/**/*.tsx'`
- **Type check:** `npx tsc --noEmit`
- **Full build via Make:** `make build` (also generates `BootstrapRoot.scss` from Bootstrap sources)

## Architecture

### State Management (MobX)

Three core stores are instantiated in `App.tsx` and passed as props throughout:

- **`AlertStore`** (`Stores/AlertStore.ts`) — central store managing alert data, filters, API responses, connection status, and settings from the backend. Contains observable sub-objects for `data`, `info`, `filters`, `status`, and `settings`.
- **`Settings`** (`Stores/Settings.ts`) — user preferences persisted to localStorage (theme, sort order, grid layout, filter bar, saved filters).
- **`SilenceFormStore`** (`Stores/SilenceFormStore.ts`) — manages silence creation/editing form state.

MobX is configured with `enforceActions: "always"` — all state mutations must happen inside actions.

### Import Paths

`tsconfig.json` sets `baseUrl: "src"`, so imports use absolute paths from `src/` (e.g., `import { AlertStore } from "Stores/AlertStore"`).

### Key Directories

- **`Models/`** — TypeScript types for API responses (`APITypes.ts`) and UI defaults (`UI.ts`). Not included in test coverage.
- **`Common/`** — Shared utilities (fetch helpers, color utils, query formatting).
- **`Hooks/`** — Custom React hooks (`useFetchGet`, `useFetchDelete`, `useGrid`, `useOnClickOutside`, etc.).
- **`Components/`** — React components organized by feature (Grid, NavBar, SilenceModal, MainModal, etc.).
- **`Stores/`** — MobX stores.
- **`Styles/`** — SCSS styles using Bootstrap/Bootswatch theming.
- **`__fixtures__/`** — Test fixtures and mock data (e.g., `useFetchGet` mock).

### Testing

- Jest with `ts-jest`, `@testing-library/react`, and Enzyme.
- `setupTests.ts` globally mocks `useFetchGet` and `react-intersection-observer`, configures MobX strict mode, and sets short retry timeouts.
- CSS/SCSS imports are mocked via `identity-obj-proxy`.
- Snapshot tests are used extensively — run `npm test -- -u` to update.

### Backend Integration

The UI communicates with the Go backend via relative URLs (formatted by `FormatBackendURI` in `AlertStore.ts` as `./<path>`). Filters are passed as `?q=` query parameters using `qs` library encoding. The `VITE_APP_BACKEND_URI` env var configures the backend URL during development.
