import { z } from 'zod';

export const onboardingStepFiveSchema = z.object({
  interests: z.array(z.string()).min(1, 'Please select at least one interest'),
});

export type OnboardingStepFiveFormData = z.infer<typeof onboardingStepFiveSchema>;
