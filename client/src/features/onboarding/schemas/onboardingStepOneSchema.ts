import { z } from 'zod';

export const onboardingStepOneSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'First name can only contain letters, spaces, hyphens, and apostrophes')
    .trim(),
  middleName: z
    .string()
    .max(50, 'Middle name must be less than 50 characters')
    .regex(/^[a-zA-Z\s'-]*$/, 'Middle name can only contain letters, spaces, hyphens, and apostrophes')
    .optional()
    .or(z.literal(''))
    .transform((val) => val || undefined),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Last name can only contain letters, spaces, hyphens, and apostrophes')
    .trim(),
  birthdate: z
    .string()
    .min(1, 'Birthdate is required')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format')
    .refine((val) => {
      const date = new Date(val);
      const currentDate = new Date();
      const age = currentDate.getFullYear() - date.getFullYear();
      const monthDiff = currentDate.getMonth() - date.getMonth();
      const dayDiff = currentDate.getDate() - date.getDate();
      
      // Adjust age if birthday hasn't occurred this year
      const actualAge = monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;
      
      return actualAge >= 18;
    }, 'You must be at least 18 years old')
    .refine((val) => {
      const date = new Date(val);
      return !isNaN(date.getTime()) && date <= new Date();
    }, 'Invalid date'),
  gender: z.enum(['male', 'female', 'nonbinary'], {
    required_error: 'Please select a gender',
    invalid_type_error: 'Please select a valid gender',
  }),
});

export type OnboardingStepOneFormData = z.infer<typeof onboardingStepOneSchema>;

