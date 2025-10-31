import type { ProfileCompletePayload } from '../../../api/profile';
import type { OnboardingStepOneFormData } from '../schemas/onboardingStepOneSchema';
import type { OnboardingStepTwoFormData } from '../schemas/onboardingStepTwoSchema';
import type { OnboardingStepThreeFormData } from '../schemas/onboardingStepThreeSchema';
import type { OnboardingStepFourFormData } from '../schemas/onboardingStepFourSchema';
import type { OnboardingStepFiveFormData } from '../schemas/onboardingStepFiveSchema';
import type { OnboardingStepSixFormData } from '../schemas/onboardingStepSixSchema';
import type { OnboardingStepSevenFormData } from '../schemas/onboardingStepSevenSchema';
import { philippineSchools, educationPrograms } from '../schemas/onboardingStepTwoSchema';

interface OnboardingStepData {
  step1?: OnboardingStepOneFormData;
  step2?: OnboardingStepTwoFormData;
  step3?: OnboardingStepThreeFormData;
  step4?: OnboardingStepFourFormData;
  step5?: OnboardingStepFiveFormData;
  step6?: OnboardingStepSixFormData;
  step7?: OnboardingStepSevenFormData;
}

/**
 * Extracts full school name from school value
 */
const getFullSchoolName = (schoolValue?: string): string => {
  if (!schoolValue) return '';
  const school = philippineSchools.find(s => s.value === schoolValue);
  return school ? school.label : schoolValue;
};

/**
 * Extracts full program name from program value
 */
const getFullProgramName = (programValue?: string): string => {
  if (!programValue) return '';
  const program = educationPrograms.find(p => p.value === programValue);
  return program ? program.label : programValue;
};

/**
 * Parses location string to extract city name
 * Handles formats like "Forbes Park, Makati, Metro Manila" → "Makati"
 */
const parseLocationCity = (location?: string): string => {
  if (!location) return '';
  const parts = location.split(',').map(part => part.trim());
  // For locations like "Forbes Park, Makati, Metro Manila", we want "Makati"
  // For locations like "Makati, Metro Manila", we want "Makati"
  // For locations like "Makati", we want "Makati"
  return parts.length >= 2 ? parts[parts.length - 2] : parts[0];
};

/**
 * Transforms onboarding step data into profile completion payload
 * Maps frontend form data to backend database fields
 */
export const transformOnboardingData = (
  stepData: OnboardingStepData
): ProfileCompletePayload => {
  const step1 = stepData.step1;
  const step2 = stepData.step2;
  const step3 = stepData.step3;
  const step4 = stepData.step4;
  const step5 = stepData.step5;
  const step6 = stepData.step6;
  const step7 = stepData.step7;

  // Validate required fields
  if (!step1 || !step2 || !step3 || !step4 || !step5 || !step6 || !step7) {
    throw new Error('Incomplete onboarding data');
  }

  return {
    // Personal Information (Step 1)
    first_name: step1.firstName,
    middle_name: step1.middleName,
    last_name: step1.lastName,
    gender: step1.gender,

    // Location & Education (Step 2)
    location: parseLocationCity(step2.location),
    school: getFullSchoolName(step2.school),
    program: getFullProgramName(step2.program),
    about_me: step2.aboutMe || null,

    // Looking For (Step 4)
    looking_for: step4.lookingFor,

    // Interests (Step 5)
    interests: step5.interests,

    // Music (Step 6)
    music: step6.favoriteSongs.map(song => ({
      name: song.name,
      artists: song.artists,
      albumName: song.albumName,
      albumCoverUrl: song.albumCoverUrl,
    })),

    // Pictures (Step 7) - File objects for S3 upload
    profile_picture: step7.pfp,
    cover_picture: step7.cardPreview,
    // Filter out PFP and cover picture from albums to prevent duplicates
    album_photos: (step7.albums || []).filter(album => 
      album !== step7.pfp && album !== step7.cardPreview
    ),

    // Matching Preferences (Step 3)
    matching_prefs: {
      open_for_everyone: step3.openForEveryone,
      gender_preferences: step3.genderPreferences,
      purpose_preference: step3.purposes,
      distance_min_km: step3.distanceMinKm,
      distance_max_km: step3.distanceMaxKm,
    },
  };
};
