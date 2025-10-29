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
    .optional()
    .or(z.literal(''))
    .transform((val) => val || undefined),
  gender: z.enum(['male', 'female', 'nonbinary'], {
    required_error: 'Please select a gender',
    invalid_type_error: 'Please select a valid gender',
  }),
});

export type OnboardingStepOneFormData = z.infer<typeof onboardingStepOneSchema>;

