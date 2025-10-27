# Variable Naming Convention

## Basic Rules

| Type | Format | Examples |
|------|--------|----------|
| Variables | `camelCase` | `userName`, `isLoading`, `userCount` |
| Constants | `UPPER_SNAKE_CASE` | `MAX_RETRIES`, `API_BASE_URL` |
| Booleans | `is/has/can + Noun` | `isLoading`, `hasError`, `canSubmit` |
| Arrays | `plural` | `users`, `items`, `messages` |
| Objects | `singular` | `user`, `config`, `settings` |
| Functions | `camelCase` | `handleClick`, `fetchUsers`, `formatDate` |
| React State | `camelCase` | `count`, `name`, `isOpen` |
| React Setters | `set + PascalCase` | `setCount`, `setName`, `setIsOpen` |

## React-Specific

| Pattern | Use | Example |
|---------|-----|---------|
| `useXxx` | Custom hooks | `useAuth`, `useForm`, `useFetch` |
| `handleXxx` | Event handlers | `handleClick`, `handleSubmit`, `handleChange` |
| `onXxx` | Callback props | `onClick`, `onChange`, `onSubmit` |
| `xxxStore` | Zustand store | `authStore`, `userStore` |

## Quick Reference

- **Variables**: `camelCase`
- **Constants**: `UPPER_SNAKE_CASE`
- **Booleans**: `isXxx`, `hasXxx`, `canXxx`
- **Arrays**: plural names
- **Functions**: `camelCase` with verb prefix
- **React State**: `camelCase` + `setXxx` for setters
