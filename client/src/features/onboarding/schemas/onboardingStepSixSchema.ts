import { z } from 'zod';

export const selectedSongSchema = z.object({
  id: z.string(),
  name: z.string(),
  artists: z.array(z.object({ name: z.string() })),
  albumCoverUrl: z.string(),
  albumName: z.string(),
});

export const onboardingStepSixSchema = z.object({
  favoriteSongs: z.array(selectedSongSchema).max(6, 'You can select up to 6 songs'),
});

export type SelectedSong = z.infer<typeof selectedSongSchema>;
export type OnboardingStepSixFormData = z.infer<typeof onboardingStepSixSchema>;
