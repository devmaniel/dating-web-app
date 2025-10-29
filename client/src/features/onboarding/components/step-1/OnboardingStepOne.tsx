import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MoveRight } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { onboardingStepOneSchema, type OnboardingStepOneFormData } from '../../schemas/onboardingStepOneSchema';
import { FirstNameInput, MiddleNameInput, LastNameInput, GenderButtons } from '.';
import { OnboardingLayout } from '..';
import type { OnboardingStepOneFormProps } from '../../types';

export function OnboardingStepOne({ onSubmit, initialData }: OnboardingStepOneFormProps = {}) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<OnboardingStepOneFormData>({
    resolver: zodResolver(onboardingStepOneSchema),
    mode: 'onBlur',
    defaultValues: initialData || {
      firstName: '',
      middleName: '',
      lastName: '',
      gender: undefined,
    },
  });

  const handleFormSubmit = async (data: OnboardingStepOneFormData) => {
    try {
      console.log('Onboarding Step 1 data:', data);
      onSubmit?.(data);
      
      // Navigate to step 2 (to be created)
      // navigate({ to: '/onboarding/step-2' });
    } catch (err) {
      console.error('Onboarding error:', err);
    }
  };

  // Watch all form fields to determine if form is complete
  const formValues = watch();
  
  // Check if all required fields are filled and have no errors
  const isFormValid = 
    formValues.firstName.trim().length >= 2 &&
    formValues.lastName.trim().length >= 2 &&
    formValues.gender !== undefined &&
    Object.keys(errors).length === 0 &&
    !isSubmitting;

  return (
    <OnboardingLayout currentStep={1}>
      <div className="space-y-6 animate-in fade-in duration-500">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Let's get to know you</h2>
            <p className="text-sm text-muted-foreground mt-2">Tell us the basics to get started</p>
          </div>

          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            <div className="space-y-1.5">
              <label htmlFor="firstName" className="text-base font-medium text-foreground">
                First Name
              </label>
              <FirstNameInput
                {...register('firstName')}
                id="firstName"
              />
              {errors.firstName && (
                <p className="text-sm text-red-500">{errors.firstName.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="middleName" className="text-base font-medium text-foreground">
                Middle Name
              </label>
              <div className="relative">
                <MiddleNameInput
                  {...register('middleName')}
                  id="middleName"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">
                  Optional
                </span>
              </div>
              {errors.middleName && (
                <p className="text-sm text-red-500">{errors.middleName.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="lastName" className="text-base font-medium text-foreground">
                Last Name
              </label>
              <LastNameInput
                {...register('lastName')}
                id="lastName"
              />
              {errors.lastName && (
                <p className="text-sm text-red-500">{errors.lastName.message}</p>
              )}
            </div>


            <div className="space-y-1.5">
              <label className="text-base font-medium text-foreground">Gender</label>
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <GenderButtons
                    value={field.value}
                    onChange={field.onChange}
                    name={field.name}
                  />
                )}
              />
              {errors.gender && (
                <p className="text-sm text-red-500">{errors.gender.message}</p>
              )}
            </div>

            <div className="flex justify-end pt-4">
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

