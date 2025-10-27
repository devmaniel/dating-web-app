# TypeScript Conventions

## Avoid `any`

| ❌ Don't | ✅ Do |
|----------|--------|
| `const data: any = response;` | `const data: User = response;` |
| `function process(x: any) {}` | `function process(x: User) {}` |
| `let value: any;` | `let value: string \| null = null;` |

## Create Necessary Types

```typescript
// Define types for your data
type User = {
  id: string;
  name: string;
  email: string;
  age?: number;
};

interface AuthResponse {
  token: string;
  user: User;
}

// Use union types for multiple possibilities
type Status = 'loading' | 'success' | 'error';
```

## Use `as const` for Literals

```typescript
// ✅ Immutable literal types
const API_ENDPOINTS = {
  users: '/api/users',
  posts: '/api/posts',
} as const;

const ROLES = ['admin', 'user', 'guest'] as const;
type Role = typeof ROLES[number]; // 'admin' | 'user' | 'guest'

const MAX_RETRIES = 3 as const;
```

## Quick Rules

- Never use `any` — define proper types instead
- Use `unknown` if type is truly unknown, then narrow it
- Use `as const` for literal values that don't change
- Export types from `types.ts` files
- Use `type` for unions/literals, `interface` for objects
