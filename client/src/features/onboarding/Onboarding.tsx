import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { OnboardingStepZero } from './components/OnboardingStepZero';
import { OnboardingStepOne } from './components/step-1/OnboardingStepOne';
import { OnboardingStepTwo } from './components/step-2/OnboardingStepTwo';
import { OnboardingStepThree } from './components/step-3/OnboardingStepThree';
import { OnboardingStepFour } from './components/step-4/OnboardingStepFour';
import { OnboardingStepFive } from './components/step-5/OnboardingStepFive';
import { OnboardingStepSix } from './components/step-6/OnboardingStepSix';
import { OnboardingStepSeven } from './components/step-7/OnboardingStepSeven';
import { OnboardingStepEight } from './components/step-8/OnboardingStepEight';
import { OnboardingLoading } from './components/loading/OnboardingLoading';
import { useOnboardingSubmit } from './hooks/useOnboardingSubmit';
import { useUserProfileCached } from '@/shared/hooks/useUserProfileCached';
import { useUserProfileStore } from '@/shared/stores/userProfileStore';
import type { OnboardingStepOneFormData } from './schemas/onboardingStepOneSchema';
import type { OnboardingStepTwoFormData } from './schemas/onboardingStepTwoSchema';
import type { OnboardingStepThreeFormData } from './schemas/onboardingStepThreeSchema';
import type { OnboardingStepFourFormData } from './schemas/onboardingStepFourSchema';
import type { OnboardingStepFiveFormData } from './schemas/onboardingStepFiveSchema';
import type { OnboardingStepSixFormData } from './schemas/onboardingStepSixSchema';
import type { OnboardingStepSevenFormData } from './schemas/onboardingStepSevenSchema';
import type { OnboardingStepEightFormData } from './schemas/onboardingStepEightSchema';
import { philippineSchools, educationPrograms } from './schemas/onboardingStepTwoSchema';

export type OnboardingStep = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export interface OnboardingState {
  currentStep: OnboardingStep;
  stepData: {
    step1?: OnboardingStepOneFormData;
    step2?: OnboardingStepTwoFormData;
    step3?: OnboardingStepThreeFormData;
    step4?: OnboardingStepFourFormData;
    step5?: OnboardingStepFiveFormData;
    step6?: OnboardingStepSixFormData;
    step7?: OnboardingStepSevenFormData;
    step8?: OnboardingStepEightFormData;
  };
}

export function Onboarding() {
  const navigate = useNavigate();
  const { submit: submitProfile } = useOnboardingSubmit();
  const { profile, refetch: refetchProfile } = useUserProfileCached();
  const { setInitialized } = useUserProfileStore();
  const [state, setState] = useState<OnboardingState>({
    currentStep: 0,
    stepData: {},
  });

  // Helper function to calculate age from birthdate
  const calculateAge = (birthdate: string): number => {
    const today = new Date();
    const birth = new Date(birthdate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  // Helper functions to get full names
  const getFullSchoolName = (schoolValue?: string) => {
    if (!schoolValue) return '';
    const school = philippineSchools.find(s => s.value === schoolValue);
    return school ? school.label : schoolValue;
  };

  const getFullProgramName = (programValue?: string) => {
    if (!programValue) return '';
    const program = educationPrograms.find(p => p.value === programValue);
    return program ? program.label : programValue;
  };

  const handleStepZeroNext = () => {
    setState((prev) => ({
      ...prev,
      currentStep: 1,
    }));
  };

  const handleStepOneSubmit = (data: OnboardingStepOneFormData) => {
    setState((prev) => ({
      ...prev,
      stepData: {
        ...prev.stepData,
        step1: data,
      },
      currentStep: 2,
    }));
  };

  const handleStepTwoSubmit = (data: OnboardingStepTwoFormData) => {
    setState((prev) => ({
      ...prev,
      stepData: {
        ...prev.stepData,
        step2: data,
      },
      currentStep: 3,
    }));
  };

  const handleStepThreeSubmit = (data: OnboardingStepThreeFormData) => {
    setState((prev) => ({
      ...prev,
      stepData: {
        ...prev.stepData,
        step3: data,
      },
      currentStep: 4,
    }));
  };

  const handleStepFourSubmit = (data: OnboardingStepFourFormData) => {
    setState((prev) => ({
      ...prev,
      stepData: {
        ...prev.stepData,
        step4: data,
      },
      currentStep: 5,
    }));
  };

  const handleStepFiveSubmit = (data: OnboardingStepFiveFormData) => {
    setState((prev) => ({
      ...prev,
      stepData: {
        ...prev.stepData,
        step5: data,
      },
      currentStep: 6,
    }));
  };

  const handleStepSixSubmit = (data: OnboardingStepSixFormData) => {
    setState((prev) => ({
      ...prev,
      stepData: {
        ...prev.stepData,
        step6: data,
      },
      currentStep: 7,
    }));
  };

  const handleStepSevenSubmit = (data: OnboardingStepSevenFormData) => {
    setState((prev) => ({
      ...prev,
      stepData: {
        ...prev.stepData,
        step7: data,
      },
      currentStep: 8,
    }));
  };

  const handleStepEightSubmit = () => {
    console.log('🚀 Step 8 Submit - Moving to loading screen (step 9)');
    console.log('📦 Current stepData:', state.stepData);
    // Move to loading step before final submission
    setState((prev) => ({
      ...prev,
      currentStep: 9,
    }));
  };

  const handleLoadingComplete = async () => {
    console.log('⏰ Loading Complete - Starting profile submission');
    console.log('📦 Submitting stepData:', state.stepData);
    try {
      // Submit profile data to backend
      console.log('📤 Calling submitProfile...');
      await submitProfile(state.stepData);
      console.log('✅ Profile submitted successfully!');
      
      // Wait a moment for AWS uploads to complete, then refetch profile data
      console.log('⏳ Waiting for AWS uploads to complete...');
      await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay
      
      // Invalidate cache and refetch profile data to get latest data including AWS uploads
      console.log('🔄 Invalidating cache and refetching profile data...');
      setInitialized(false); // Force fresh fetch by invalidating cache
      await refetchProfile();
      console.log('✅ Profile data refetched successfully!');
      
      // Navigate to match page on success
      console.log('🔄 Navigating to /match');
      navigate({ to: '/match' });
    } catch (err) {
      console.error('❌ Failed to complete onboarding:', err);
      // Go back to step 8 on error
      setState((prev) => ({
        ...prev,
        currentStep: 8,
      }));
    }
  };

  const handlePreviousStep = () => {
    setState((prev) => ({
      ...prev,
      currentStep: Math.max(0, prev.currentStep - 1) as OnboardingStep,
    }));
  };

  const renderStep = () => {
    switch (state.currentStep) {
      case 0:
        return (
          <OnboardingStepZero 
            onNext={handleStepZeroNext}
          />
        );
      case 1:
        return (
          <OnboardingStepOne 
            onSubmit={handleStepOneSubmit}
            initialData={state.stepData.step1}
          />
        );
      case 2:
        return (
          <OnboardingStepTwo
            onSubmit={handleStepTwoSubmit}
            onBack={handlePreviousStep}
            initialData={state.stepData.step2}
          />
        );
      case 3:
        return (
          <OnboardingStepThree
            onSubmit={handleStepThreeSubmit}
            onBack={handlePreviousStep}
            initialData={state.stepData.step3}
          />
        );
      case 4:
        return (
          <OnboardingStepFour
            onSubmit={handleStepFourSubmit}
            onBack={handlePreviousStep}
            initialData={state.stepData.step4}
          />
        );
      case 5:
        return (
          <OnboardingStepFive
            onSubmit={handleStepFiveSubmit}
            onBack={handlePreviousStep}
            initialData={state.stepData.step5}
          />
        );
      case 6:
        return (
          <OnboardingStepSix
            onSubmit={handleStepSixSubmit}
            onBack={handlePreviousStep}
            initialData={state.stepData.step6}
          />
        );
      case 7:
        return (
          <OnboardingStepSeven
            onSubmit={handleStepSevenSubmit}
            onBack={handlePreviousStep}
            initialData={state.stepData.step7}
          />
        );
      case 8:
        return (
          <OnboardingStepEight
            onSubmit={handleStepEightSubmit}
            onBack={handlePreviousStep}
            profileData={{
              // Personal Information
              name: state.stepData.step1?.firstName,
              middleName: state.stepData.step1?.middleName,
              lastName: state.stepData.step1?.lastName,
              age: profile?.birthdate ? calculateAge(profile.birthdate) : undefined,
              gender: state.stepData.step1?.gender,
              
              // Location & Education
              location: state.stepData.step2?.location ? 
                (() => {
                  const parts = state.stepData.step2!.location!.split(',').map(part => part.trim());
                  // Extract just the city (first part) from location
                  // "Makati, Metro Manila, Philippines" → "Makati"
                  // "Quezon City, Metro Manila, Philippines" → "Quezon City"
                  return parts[0];
                })() 
                : undefined,
              school: getFullSchoolName(state.stepData.step2?.school),
              program: getFullProgramName(state.stepData.step2?.program),
              education: state.stepData.step2?.school && state.stepData.step2?.program 
                ? `${getFullProgramName(state.stepData.step2.program)} at ${getFullSchoolName(state.stepData.step2.school)}` 
                : undefined,
              
              // Preferences
              openForEveryone: state.stepData.step3?.openForEveryone,
              genderPreferences: state.stepData.step3?.genderPreferences,
              purposes: state.stepData.step3?.purposes,
              
              // Profile Content
              lookingFor: state.stepData.step4?.lookingFor,
              interests: state.stepData.step5?.interests,
              aboutMe: state.stepData.step2?.aboutMe,
              
              // Media
              cardPreviewUrl: state.stepData.step7?.cardPreview ? URL.createObjectURL(state.stepData.step7.cardPreview) : undefined,
              albumPhotos: state.stepData.step7?.albums?.map((file, index) => ({
                id: `album-${index}`,
                url: URL.createObjectURL(file),
                name: `Photo ${index + 1}`
              })),
              
              // Music
              musicGenres: state.stepData.step6?.favoriteSongs?.map(song => song.albumName) || [],
              musicArtists: state.stepData.step6?.favoriteSongs?.map(song => song.artists.map(a => a.name).join(', ')) || [],
              musicSongs: state.stepData.step6?.favoriteSongs?.map(song => song.name) || [],
              musicAlbumCovers: state.stepData.step6?.favoriteSongs?.map(song => song.albumCoverUrl) || []
            }}
          />
        );
      case 9:
        return (
          <OnboardingLoading
            onComplete={handleLoadingComplete}
            duration={5000}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen">
      {renderStep()}
    </div>
  );
}
