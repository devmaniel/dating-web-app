import { z } from 'zod';

// Password strength regex: at least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
const passwordStrengthRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;

export const signUpSchema = z
  .object({
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Invalid email address')
      .trim(),
    username: z
      .string()
      .min(3, 'Username must be at least 3 characters')
      .max(20, 'Username must be less than 20 characters')
      .regex(/^[a-zA-Z0-9._]+$/, 'Username can only contain letters, numbers, dots, and underscores')
      .trim(),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        passwordStrengthRegex,
        'Password must contain uppercase, lowercase, number, and special character (@$!%*?&)'
      )
      .trim(),
    confirmPassword: z
      .string()
      .min(1, 'Please confirm your password')
      .trim(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type SignUpFormData = z.infer<typeof signUpSchema>;

