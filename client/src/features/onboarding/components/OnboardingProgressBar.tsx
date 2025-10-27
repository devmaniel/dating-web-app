import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTrigger,
} from "@/shared/components/ui/stepper";

interface OnboardingProgressBarProps {
  currentStep: number;
  totalSteps?: number;
}

export function OnboardingProgressBar({ currentStep, totalSteps = 7 }: OnboardingProgressBarProps) {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <Stepper value={currentStep} orientation="horizontal" className="w-full">
      {steps.map((step) => (
        <StepperItem 
          key={step} 
          step={step}
          completed={step < currentStep}
          disabled={true}
          className={step < steps.length ? "flex-1" : ""}
        >
          <StepperTrigger className="cursor-default pointer-events-none">
            <StepperIndicator />
          </StepperTrigger>
          {step < steps.length && <StepperSeparator className="flex-1 !bg-border !h-[2px]" />}
        </StepperItem>
      ))}
    </Stepper>
  );
}
