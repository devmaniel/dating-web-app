import { z } from 'zod';

export const onboardingStepThreeSchema = z.object({
  openForEveryone: z.boolean(),
  genderPreferences: z.array(z.enum(['male', 'female', 'nonbinary'])),
  purposes: z.array(z.enum(['study-buddy', 'date', 'bizz'])).min(1, 'Please select at least one purpose'),
  distanceMinKm: z.number().min(0, 'Minimum distance must be 0 or greater'),
  distanceMaxKm: z.number().min(1, 'Maximum distance must be at least 1km').max(1000, 'Maximum distance cannot exceed 1000km'),
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
).refine(
  (data) => {
    // Distance min must be less than distance max
    if (data.distanceMinKm >= data.distanceMaxKm) {
      return false;
    }
    return true;
  },
  {
    message: 'Minimum distance must be less than maximum distance',
    path: ['distanceMaxKm'],
  }
);

export type OnboardingStepThreeFormData = z.infer<typeof onboardingStepThreeSchema>;
