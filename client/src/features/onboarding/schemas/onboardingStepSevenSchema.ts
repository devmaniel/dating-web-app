import { z } from 'zod';

export const onboardingStepSevenSchema = z.object({
  cardPreview: z.instanceof(File, { message: 'Card preview image is required' }),
  pfp: z.instanceof(File, { message: 'Profile picture is required' }),
  albums: z.array(z.instanceof(File))
    .max(6, 'You can upload up to 6 album photos')
    .optional()
    .default([]),
});

export type OnboardingStepSevenFormData = z.infer<typeof onboardingStepSevenSchema>;
