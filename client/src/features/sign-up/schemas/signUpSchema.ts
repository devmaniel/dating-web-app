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
    birthdate: z
      .string()
      .min(1, 'Birthdate is required')
      .refine((date) => {
        const birthDate = new Date(date);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        const dayDiff = today.getDate() - birthDate.getDate();
        
        // Calculate exact age
        const exactAge = monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;
        
        return exactAge >= 18;
      }, 'You must be at least 18 years old'),
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

