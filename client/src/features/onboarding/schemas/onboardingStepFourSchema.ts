import { z } from 'zod';

export const onboardingStepFourSchema = z.object({
  lookingFor: z.string(),
});

export type OnboardingStepFourFormData = z.infer<typeof onboardingStepFourSchema>;
