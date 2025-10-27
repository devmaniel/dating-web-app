import { z } from 'zod';

export const onboardingStepThreeSchema = z.object({
  openForEveryone: z.boolean(),
  genderPreferences: z.array(z.enum(['male', 'female', 'nonbinary'])),
  purposes: z.array(z.enum(['study-buddy', 'date', 'bizz'])).min(1, 'Please select at least one purpose'),
}).refine(
  (data) => {
    // If not open for everyone, must select at least one gender preference
    if (!data.openForEveryone && data.genderPreferences.length === 0) {
      return false;
    }
    return true;
  },
  {
    message: 'Please select at least one gender preference or enable "open for everyone"',
    path: ['genderPreferences'],
  }
);

export type OnboardingStepThreeFormData = z.infer<typeof onboardingStepThreeSchema>;
