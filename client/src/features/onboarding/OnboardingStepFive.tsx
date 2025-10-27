import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MoveRight } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { onboardingStepFiveSchema, type OnboardingStepFiveFormData } from './schemas/onboardingStepFiveSchema';
import { InterestSearchInput, InterestChip } from './components/step-5';
import { OnboardingLayout } from './components';
import { INTERESTS_DATA } from './data/interests';

export interface OnboardingStepFiveFormProps {
  onSubmit?: (data: OnboardingStepFiveFormData) => void;
  onBack?: () => void;
  initialData?: OnboardingStepFiveFormData;
}

export function OnboardingStepFive({ onSubmit, onBack, initialData }: OnboardingStepFiveFormProps = {}) {
  const [searchQuery, setSearchQuery] = useState('');

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<OnboardingStepFiveFormData>({
    resolver: zodResolver(onboardingStepFiveSchema),
    mode: 'onChange',
    defaultValues: {
      interests: initialData?.interests ?? [],
    },
  });

  const selectedInterests = watch('interests');

  const handleFormSubmit = async (data: OnboardingStepFiveFormData) => {
    try {
      console.log('Onboarding Step 5 data:', data);
      onSubmit?.(data);
    } catch (err) {
      console.error('Onboarding error:', err);
    }
  };

  const toggleInterest = (interestId: string) => {
    const currentInterests = selectedInterests || [];
    if (currentInterests.includes(interestId)) {
      setValue('interests', currentInterests.filter(id => id !== interestId), {
        shouldValidate: true,
      });
    } else {
      setValue('interests', [...currentInterests, interestId], {
        shouldValidate: true,
      });
    }
  };

  // Filter interests based on search query
  const filteredInterests = INTERESTS_DATA.filter(interest =>
    interest.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Separate interests into selected and suggested based on user's current selection
  const userSelectedInterests = filteredInterests.filter(interest => 
    selectedInterests?.includes(interest.id)
  );
  const suggestedInterests = filteredInterests.filter(interest => 
    !selectedInterests?.includes(interest.id)
  );

  const isFormValid = selectedInterests && selectedInterests.length > 0 && !isSubmitting;

  return (
    <OnboardingLayout currentStep={5}>
      <div className="space-y-6 animate-in fade-in duration-500">
          <div>
            <h2 className="text-3xl font-bold text-foreground">What are you into?</h2>
            <p className="text-sm text-muted-foreground mt-2">Pick your interests so we can connect you with like-minded people</p>
          </div>

          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
            {/* Search Input */}
            <Controller
              name="interests"
              control={control}
              render={() => (
                <InterestSearchInput
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="Search Interest"
                />
              )}
            />

            {/* You're into with... Section */}
            {userSelectedInterests.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-base font-semibold text-foreground">You're into with...</h3>
                <div className="flex flex-wrap gap-3">
                  {userSelectedInterests.map((interest) => (
                    <InterestChip
                      key={interest.id}
                      emoji={interest.emoji}
                      label={interest.label}
                      isSelected={selectedInterests?.includes(interest.id) || false}
                      onClick={() => toggleInterest(interest.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* You might into with... Section */}
            {suggestedInterests.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-base font-semibold text-foreground">You might into with...</h3>
                <div className="flex flex-wrap gap-3">
                  {suggestedInterests.map((interest) => (
                    <InterestChip
                      key={interest.id}
                      emoji={interest.emoji}
                      label={interest.label}
                      isSelected={selectedInterests?.includes(interest.id) || false}
                      onClick={() => toggleInterest(interest.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Error Message */}
            {errors.interests && (
              <p className="text-sm text-red-600">{errors.interests.message}</p>
            )}

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
