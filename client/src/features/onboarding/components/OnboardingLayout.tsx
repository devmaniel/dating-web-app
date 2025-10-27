import { type ReactNode } from 'react';
import { OnboardingHeader } from './step-2';
import { OnboardingProgressBar } from './OnboardingProgressBar';

interface OnboardingLayoutProps {
  currentStep: number;
  totalSteps?: number;
  children: ReactNode;
}

export function OnboardingLayout({ currentStep, totalSteps = 7, children }: OnboardingLayoutProps) {
  return (
    <div className="w-full bg-background px-4 sm:px-6 lg:px-8 py-6">
      <div className="max-w-[700px] mx-auto space-y-8">
        <OnboardingHeader />
        {currentStep > 0 && (
          <OnboardingProgressBar currentStep={currentStep} totalSteps={totalSteps} />
        )}
        {children}
      </div>
    </div>
  );
}
