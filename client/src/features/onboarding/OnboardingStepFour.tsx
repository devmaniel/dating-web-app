import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MoveRight } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { onboardingStepFourSchema, type OnboardingStepFourFormData } from './schemas/onboardingStepFourSchema';
import { LookingForInput } from './components/step-4';
import { OnboardingLayout } from './components';

export interface OnboardingStepFourFormProps {
  onSubmit?: (data: OnboardingStepFourFormData) => void;
  onBack?: () => void;
  initialData?: OnboardingStepFourFormData;
}


export function OnboardingStepFour({ onSubmit, onBack, initialData }: OnboardingStepFourFormProps = {}) {
  const {
    control,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = useForm<OnboardingStepFourFormData>({
    resolver: zodResolver(onboardingStepFourSchema),
    mode: 'onChange',
    defaultValues: {
      lookingFor: initialData?.lookingFor ?? '',
    },
  });

  const lookingForValue = watch('lookingFor');

  const handleFormSubmit = async (data: OnboardingStepFourFormData) => {
    try {
      console.log('Onboarding Step 4 data:', data);
      onSubmit?.(data);
    } catch (err) {
      console.error('Onboarding error:', err);
    }
  };

  // Always allow next - this step is optional
  const isFormValid = !isSubmitting;

  return (
    <OnboardingLayout currentStep={4}>
      <div className="space-y-6 animate-in fade-in duration-500">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Describe your ideal match</h2>
            <p className="text-sm text-muted-foreground mt-2">Optional—but it helps others know what you're about</p>
          </div>

          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
         

            {/* Looking For Input */}
            <Controller
              name="lookingFor"
              control={control}
              render={({ field }) => (
                <LookingForInput
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Study buddie and LOML"
                />
              )}
            />

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
                {lookingForValue?.trim() ? 'Next' : 'Skip'}
                <MoveRight strokeWidth={2.5} />
              </Button>
            </div>
          </form>
        </div>
    </OnboardingLayout>
  );
}
