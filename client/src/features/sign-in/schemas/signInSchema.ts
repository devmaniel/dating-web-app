import { z } from 'zod';

export const signInSchema = z.object({
  usernameOrEmail: z
    .string()
    .min(1)
    .trim(),
  password: z
    .string()
    .min(6)
    .trim(),
});

export type SignInFormData = z.infer<typeof signInSchema>;

