import { z } from 'zod';

// Step 8 is a preview step, so it doesn't have form data to validate
// This schema is just for consistency with other steps
export const onboardingStepEightSchema = z.object({
  confirmed: z.boolean().default(true),
});

export type OnboardingStepEightFormData = z.infer<typeof onboardingStepEightSchema>;
