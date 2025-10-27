# Forms Conventions

## Setup

1. Define Zod schema in `schemas/` directory
2. Use `z.infer` to extract TypeScript type from schema
3. Pass schema to `useForm` with `zodResolver`
4. Register inputs and handle errors from `formState`

## Best Practices

| Rule | Details |
|------|---------|
| Schema files | Store in `schemas/xxxSchema.ts` |
| Type extraction | Use `z.infer<typeof schema>` for form data type |
| Resolver | Always use `zodResolver(schema)` |
| Error handling | Access errors via `formState.errors` |
| Loading state | Use `isSubmitting` to disable button during submission |
| Validation timing | Set `mode: 'onBlur'` or `'onChange'` as needed |
| Field registration | Use `register('fieldName')` on inputs |
| Error display | Show `errors.fieldName?.message` conditionally |
