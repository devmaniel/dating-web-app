import { z } from 'zod';

export const onboardingStepSevenSchema = z.object({
  photos: z.array(z.instanceof(File))
    .min(2, 'Please upload at least 2 photos')
    .max(6, 'You can upload up to 6 photos'),
});

export type OnboardingStepSevenFormData = z.infer<typeof onboardingStepSevenSchema>;
