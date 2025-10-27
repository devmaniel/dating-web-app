# Folder Architecture

## Overview
Feature-based architecture with centralized shared utilities and isolated feature modules.

## Structure

```
src/
├── router/              # TanStack Router config & route guards
├── shared/              # Cross-feature reusable code
├── features/            # Feature-specific domain modules
└── App.tsx
```

## Detailed Breakdown

### `router/`
- Route configuration and definitions
- Route guards (e.g., `authGuard.ts` for `beforeLoad` checks)
- No business logic

### `shared/`
Reusable across all features:
- `components/` — UI components (Button, Card, Modal, etc.)
- `hooks/` — Custom hooks (useAuth, useFetch, etc.)
- `stores/` — Zustand stores for global state (authStore with token management)
- `utils/` — Helper functions (tokenUtils, formatters, etc.)
- `types/` — Global type definitions

### `features/`
Each feature is isolated with its own domain:
- `landing/`, `auth/`, `profile/`, etc.
- Each feature contains:
  - `components/` — Feature-specific components only
  - `hooks/` — Feature-specific hooks only
  - `pages/` — Page components
  - `types.ts` — Feature-specific types
  - `index.ts` — Barrel export

## Rules

- **No cross-feature imports** — Features don't import from each other
- **Shared first** — Check shared before creating feature-specific code
- **Token in shared** — All token logic lives in `shared/stores/authStore.ts` and `shared/hooks/useAuth.ts`
- **Barrel exports** — Each module exports via `index.ts`
- **Feature isolation** — Feature components/hooks are only used within that feature

## Example

Landing feature needs a custom hook → `features/landing/hooks/useLandingLogic.ts`
Multiple features need auth → `shared/hooks/useAuth.ts`
