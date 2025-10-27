import { useState } from 'react';
import { OnboardingStepZero } from './OnboardingStepZero';
import { OnboardingStepOne } from './OnboardingStepOne';
import { OnboardingStepTwo } from './OnboardingStepTwo';
import { OnboardingStepThree } from './OnboardingStepThree';
import { OnboardingStepFour } from './OnboardingStepFour';
import { OnboardingStepFive } from './OnboardingStepFive';
import { OnboardingStepSix } from './OnboardingStepSix';
import { OnboardingStepSeven } from './OnboardingStepSeven';
import type { OnboardingStepOneFormData } from './schemas/onboardingStepOneSchema';
import type { OnboardingStepTwoFormData } from './schemas/onboardingStepTwoSchema';
import type { OnboardingStepThreeFormData } from './schemas/onboardingStepThreeSchema';
import type { OnboardingStepFourFormData } from './schemas/onboardingStepFourSchema';
import type { OnboardingStepFiveFormData } from './schemas/onboardingStepFiveSchema';
import type { OnboardingStepSixFormData } from './schemas/onboardingStepSixSchema';
import type { OnboardingStepSevenFormData } from './schemas/onboardingStepSevenSchema';

export type OnboardingStep = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

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
  };
}

export function Onboarding() {
  const [state, setState] = useState<OnboardingState>({
    currentStep: 0,
    stepData: {},
  });

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
    }));
    // Handle final submission (e.g., API call)
    console.log('Onboarding complete:', { ...state.stepData, step7: data });
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
