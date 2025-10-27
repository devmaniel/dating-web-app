# Shadcn/UI Configuration Fix

## Problem
Components installed via `npx shadcn@latest add <component>` were generating incorrect import paths like:
```typescript
import { cn } from "src/shared/components/lib/utils"
```

This caused TypeScript errors because the path didn't exist.

## Root Cause
The `components.json` configuration wasn't properly aligned with your TypeScript path aliases and project structure.

## Solution Applied

### 1. Created Standard Utils Location
Created `src/lib/utils.ts` - the standard location shadcn expects for utility functions.

### 2. Updated `components.json`
```json
{
  "aliases": {
    "components": "@/shared/components",
    "utils": "@/lib/utils",
    "ui": "@/shared/components/ui",
    "lib": "@/lib"
  }
}
```

### 3. Updated TypeScript Config (`tsconfig.app.json`)
```json
{
  "paths": {
    "@components/*": ["./src/shared/components/*"],
    "@/*": ["./src/*"],
    "@/lib/*": ["./src/lib/*"]
  }
}
```

### 4. Updated Vite Config (`vite.config.ts`)
```typescript
{
  alias: {
    '@components': path.resolve(__dirname, './src/shared/components'),
    '@': path.resolve(__dirname, './src'),
    '@/lib': path.resolve(__dirname, './src/lib'),
  }
}
```

### 5. Maintained Backward Compatibility
Updated `src/shared/utils/index.ts` to re-export from the new location, so existing code using `@/shared/utils` continues to work.

## Going Forward

**All new shadcn components will now automatically use the correct import path:**
```typescript
import { cn } from "@/lib/utils"
```

No more manual fixes needed after running `npx shadcn@latest add <component>`!

## If You Still See Errors

1. Restart your TypeScript server in VS Code: `Ctrl+Shift+P` → "TypeScript: Restart TS Server"
2. If running a dev server, restart it to pick up the new Vite config
