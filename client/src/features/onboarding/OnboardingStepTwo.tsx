import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MoveRight } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { onboardingStepTwoSchema, type OnboardingStepTwoFormData } from './schemas/onboardingStepTwoSchema';
import { LocationInput, SchoolInput, ProgramInput } from './components/step-2';
import { OnboardingLayout } from './components';

export interface OnboardingStepTwoFormProps {
  onSubmit?: (data: OnboardingStepTwoFormData) => void;
  onBack?: () => void;
  initialData?: OnboardingStepTwoFormData;
}

export function OnboardingStepTwo({ onSubmit, onBack, initialData }: OnboardingStepTwoFormProps = {}) {
  const {
    control,
    handleSubmit,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<OnboardingStepTwoFormData>({
    resolver: zodResolver(onboardingStepTwoSchema),
    mode: 'onBlur',
    defaultValues: initialData || {
      location: '',
      school: '',
      program: '',
    },
  });

  const handleFormSubmit = async (data: OnboardingStepTwoFormData) => {
    try {
      console.log('Onboarding Step 2 data:', data);
      onSubmit?.(data);
    } catch (err) {
      console.error('Onboarding error:', err);
    }
  };

  // Watch all form fields to determine if form is complete
  const formValues = watch();
  
  // Check if all required fields are filled and have no errors
  const isFormValid = 
    formValues.location.trim().length >= 2 &&
    formValues.school.trim().length >= 2 &&
    formValues.program.trim().length >= 2 &&
    Object.keys(errors).length === 0 &&
    !isSubmitting;

  return (
    <OnboardingLayout currentStep={2}>
      <div className="space-y-6 animate-in fade-in duration-500">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Where's your story?</h2>
            <p className="text-sm text-muted-foreground mt-2">Share where you live and study</p>
          </div>

          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            <div className="space-y-1.5">
              <label htmlFor="location" className="text-base font-medium text-foreground">
                Lived at?
              </label>
              <Controller
                name="location"
                control={control}
                render={({ field }) => (
                  <LocationInput
                    value={field.value}
                    onChange={field.onChange}
                    id="location"
                  />
                )}
              />
              {errors.location && (
                <p className="text-sm text-red-500">{errors.location.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="school" className="text-base font-medium text-foreground">
                Studied at?
              </label>
              <Controller
                name="school"
                control={control}
                render={({ field }) => (
                  <SchoolInput
                    value={field.value}
                    onChange={field.onChange}
                    id="school"
                  />
                )}
              />
              {errors.school && (
                <p className="text-sm text-red-500">{errors.school.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="program" className="text-base font-medium text-foreground">
                Program / Track?
              </label>
              <Controller
                name="program"
                control={control}
                render={({ field }) => (
                  <ProgramInput
                    value={field.value}
                    onChange={field.onChange}
                    id="program"
                  />
                )}
              />
              {errors.program && (
                <p className="text-sm text-red-500">{errors.program.message}</p>
              )}
            </div>

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
