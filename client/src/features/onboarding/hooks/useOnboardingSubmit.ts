import { useState } from 'react';
import { completeProfile } from '../../../api/profile';
import { transformOnboardingData } from '../services/profileDataMapper';
import type { OnboardingState } from '../Onboarding';

export interface UseOnboardingSubmitReturn {
  isLoading: boolean;
  error: string | null;
  isSuccess: boolean;
  submit: (stepData: OnboardingState['stepData']) => Promise<void>;
}

/**
 * Hook to handle onboarding profile completion submission
 * Transforms step data and calls backend API
 * Prevents duplicate submissions by checking isLoading state
 */
export const useOnboardingSubmit = (): UseOnboardingSubmitReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const submit = async (stepData: OnboardingState['stepData']) => {
    console.log('🔵 useOnboardingSubmit.submit() called');
    // Prevent duplicate submissions
    if (isLoading) {
      console.log('⚠️ Submission already in progress, ignoring duplicate request');
      return;
    }

    try {
      console.log('🔄 Setting isLoading = true');
      setIsLoading(true);
      setError(null);

      // Transform frontend data to backend payload
      console.log('🔄 Transforming onboarding data...');
      const payload = transformOnboardingData(stepData);
      console.log('✅ Payload created:', {
        first_name: payload.first_name,
        last_name: payload.last_name,
        gender: payload.gender,
        location: payload.location,
        school: payload.school,
        program: payload.program,
        interests_count: payload.interests.length,
        music_count: payload.music.length,
        has_profile_picture: !!payload.profile_picture,
        has_cover_picture: !!payload.cover_picture,
        album_photos_count: payload.album_photos.length,
      });

      // Call backend API
      console.log('📤 Calling completeProfile API...');
      const response = await completeProfile(payload);
      console.log('📥 API Response:', response);

      if (!response.success) {
        throw new Error(response.message || 'Failed to complete profile');
      }

      console.log('✅ Profile submission successful!');
      setIsSuccess(true);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      console.error('❌ Onboarding submission error:', err);
      console.error('❌ Error details:', JSON.stringify(err, null, 2));
    } finally {
      console.log('🔄 Setting isLoading = false');
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    isSuccess,
    submit,
  };
};
