import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MoveRight } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { onboardingStepThreeSchema, type OnboardingStepThreeFormData } from '../../schemas/onboardingStepThreeSchema';
import { PurposeCard, GenderPreferenceButton } from '.';
import { OnboardingLayout } from '..';

export interface OnboardingStepThreeFormProps {
  onSubmit?: (data: OnboardingStepThreeFormData) => void;
  onBack?: () => void;
  initialData?: OnboardingStepThreeFormData;
}

const purposeOptions = [
  {
    value: 'study-buddy' as const,
    title: 'Study Buddy',
    description: 'Find someone to ace those exams with. Late-night study sessions and coffee runs included.',
  },
  {
    value: 'date' as const,
    title: 'Dating',
    description: 'Looking for something real. Connect with people who share your vibe and values.',
  },
  {
    value: 'bizz' as const,
    title: 'Networking',
    description: 'Build your professional circle. Meet future collaborators, mentors, or co-founders.',
  },
];

const genderOptions = [
  { value: 'male' as const, label: 'Male' },
  { value: 'female' as const, label: 'Female' },
  { value: 'nonbinary' as const, label: 'Nonbinary' },
];

export function OnboardingStepThree({ onSubmit, onBack, initialData }: OnboardingStepThreeFormProps = {}) {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<OnboardingStepThreeFormData>({
    resolver: zodResolver(onboardingStepThreeSchema),
    mode: 'onChange',
    defaultValues: initialData || {
      openForEveryone: false,
      genderPreferences: [],
      purposes: [],
    },
  });

  const handleFormSubmit = async (data: OnboardingStepThreeFormData) => {
    try {
      console.log('Onboarding Step 3 data:', data);
      onSubmit?.(data);
    } catch (err) {
      console.error('Onboarding error:', err);
    }
  };

  const formValues = watch();
  
  const isFormValid = 
    (formValues.openForEveryone || formValues.genderPreferences.length > 0) &&
    formValues.purposes.length > 0 &&
    Object.keys(errors).length === 0 &&
    !isSubmitting;

  const toggleGenderPreference = (gender: 'male' | 'female' | 'nonbinary') => {
    const currentPreferences = formValues.genderPreferences;
    let newPreferences: ('male' | 'female' | 'nonbinary')[];
    
    if (currentPreferences.includes(gender)) {
      newPreferences = currentPreferences.filter(g => g !== gender);
    } else {
      newPreferences = [...currentPreferences, gender];
    }
    
    setValue('genderPreferences', newPreferences, { shouldValidate: true });
    
    // If all 3 are selected, turn on "open for everyone"
    if (newPreferences.length === 3) {
      setValue('openForEveryone', true, { shouldValidate: true });
    } else if (formValues.openForEveryone && newPreferences.length < 3) {
      // If "open for everyone" is on and we deselect to less than 3, turn it off
      setValue('openForEveryone', false, { shouldValidate: true });
    }
  };

  const handleOpenForEveryoneToggle = (checked: boolean) => {
    setValue('openForEveryone', checked, { shouldValidate: true });
    if (checked) {
      // Set all gender preferences when "open for everyone" is enabled
      setValue('genderPreferences', ['male', 'female', 'nonbinary'], { shouldValidate: true });
    } else {
      // Clear gender preferences when "open for everyone" is disabled
      setValue('genderPreferences', [], { shouldValidate: true });
    }
  };

  const togglePurpose = (purpose: 'study-buddy' | 'date' | 'bizz') => {
    const currentPurposes = formValues.purposes;
    if (currentPurposes.includes(purpose)) {
      setValue('purposes', currentPurposes.filter(p => p !== purpose), { shouldValidate: true });
    } else {
      setValue('purposes', [...currentPurposes, purpose], { shouldValidate: true });
    }
  };

  return (
    <OnboardingLayout currentStep={3}>
      <div className="space-y-6 animate-in fade-in duration-500">
          <div>
            <h2 className="text-3xl font-bold text-foreground">What brings you here?</h2>
            <p className="text-sm text-muted-foreground mt-2">Choose what you're looking for—you can pick more than one</p>
          </div>

          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
            {/* Gender Preferences Section */}
            <div className="space-y-4">
              {/* Open for Everyone Toggle */}
              <div className="flex items-center gap-3">
                <Controller
                  name="openForEveryone"
                  control={control}
                  render={({ field }) => (
                    <button
                      type="button"
                      onClick={() => handleOpenForEveryoneToggle(!field.value)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                        field.value ? 'bg-primary' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-background transition-transform duration-200 ${
                          field.value ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  )}
                />
                <span className="text-sm font-medium text-foreground">I'm open for everyone</span>
              </div>

              {/* Gender Preference Buttons */}
              <div className="grid grid-cols-3 gap-3">
                {genderOptions.map((option) => (
                  <GenderPreferenceButton
                    key={option.value}
                    value={option.value}
                    label={option.label}
                    selected={formValues.genderPreferences.includes(option.value)}
                    disabled={false}
                    onClick={() => toggleGenderPreference(option.value)}
                  />
                ))}
              </div>
              {errors.genderPreferences && !formValues.openForEveryone && (
                <p className="text-sm text-red-500">{errors.genderPreferences.message}</p>
              )}
            </div>

            {/* Purpose Selection */}
            <div className="space-y-4">
              <div className="space-y-3">
                {purposeOptions.map((option) => (
                  <PurposeCard
                    key={option.value}
                    title={option.title}
                    description={option.description}
                    selected={formValues.purposes.includes(option.value)}
                    onClick={() => togglePurpose(option.value)}
                  />
                ))}
              </div>
              {errors.purposes && (
                <p className="text-sm text-red-500">{errors.purposes.message}</p>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-end items-center gap-4 pt-4">
              <Button
                type="button"
                onClick={onBack}
                variant="ghost"
                className="h-14 px-8 bg-secondary text-foreground rounded-full text-base font-medium hover:bg-secondary/80 transition-all duration-200"
              >
                Back
              </Button>
              <Button
                type="submit"
                disabled={!isFormValid}
                className="h-14 px-8 bg-primary text-primary-foreground rounded-full text-base font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 inline-flex items-center justify-center gap-2 [&_svg]:!size-6"
              >
                Next
                <MoveRight strokeWidth={2.5} />
              </Button>
            </div>
          </form>
        </div>
    </OnboardingLayout>
  );
}
