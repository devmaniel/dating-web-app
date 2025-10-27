# File Naming Convention

## File Names

| Format | File Type | Examples |
|--------|-----------|----------|
| `PascalCase.tsx` | React components | `Button.tsx`, `UserCard.tsx`, `HomePage.tsx` |
| `camelCase.ts` | Functions, utilities, helpers | `formatDate.ts`, `api.ts`, `helpers.ts` |
| `useXxx.ts` | Custom hooks | `useAuth.ts`, `useForm.ts`, `useFetch.ts` |
| `xxxStore.ts` | Zustand stores | `authStore.ts`, `userStore.ts` |
| `xxxSchema.ts` | Zod schemas | `userSchema.ts`, `loginSchema.ts` |
| `index.ts` | Barrel exports | `src/components/index.ts` |
| `types.ts` | Type definitions | `types.ts` |
| `constants.ts` | Constants | `constants.ts` |
| `Component.module.css` | CSS modules | `Button.module.css` |
| `index.css` | Global styles | `index.css`, `globals.css` |
| `xxx.test.ts` | Unit tests | `formatDate.test.ts`, `api.test.ts` |

## Directory Names

| Format | Use | Examples |
|--------|-----|----------|
| `lowercase-kebab/` | Feature folders | `user-profile/`, `dating-feed/`, `auth/` |
| `lowercase/` | Type folders | `components/`, `hooks/`, `utils/`, `stores/` |

## Quick Reference

- **Components**: `PascalCase.tsx`
- **Functions/Utils**: `camelCase.ts`
- **Hooks**: `useXxx.ts`
- **Stores**: `xxxStore.ts`
- **Schemas**: `xxxSchema.ts`
- **Directories**: `lowercase-kebab/`
