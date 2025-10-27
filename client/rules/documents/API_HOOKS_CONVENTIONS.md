# API & Hooks Conventions

## Axios Setup

- Use `apiClient` from `src/api/client.ts`
- All API endpoints defined in `src/api/endpoints.ts`
- Import endpoints: `import { API_ENDPOINTS } from '@/api'`

## API Hooks Pattern

### Rules
- Hooks contain **only business logic** — no JSX
- Hooks return **processed data and handlers**, never components
- Hooks use `apiClient` to fetch data
- Error handling in hook, not in component
- Return shape: `{ data, loading, error, handler }`

### Structure
```
features/xxx/hooks/useXxxLogic.ts
shared/hooks/useXxxLogic.ts
```

### Hook Pattern
- Initialize state for loading and error
- Create async function that calls `apiClient` with `API_ENDPOINTS`
- Handle errors and set error state
- Return object with handler function, loading, and error states

### Component Pattern
- Import hook and destructure data/handlers
- Use handlers in event listeners
- Render JSX with returned data and error states

## Key Points

- **Hooks**: Logic only, return data/handlers
- **Components**: Use hooks, render JSX
- **API calls**: Always use `apiClient` + `API_ENDPOINTS`
- **Error handling**: In hook, propagate to component
- **No JSX in hooks**: Keep separation of concerns
