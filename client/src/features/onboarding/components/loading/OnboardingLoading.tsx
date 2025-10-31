import { useEffect, useState } from 'react';
import LogoSvg from '@/assets/svgs/col-text-logo-light-mode.svg';

interface OnboardingLoadingProps {
  onComplete: () => void;
  duration?: number; // in milliseconds, default 5000
}

const loadingTexts = [
  "Setting up your profile...",
  "Preparing your matches...",
  "Finalizing your preferences...",
  "Almost there...",
  "Getting everything ready..."
];

export function OnboardingLoading({ onComplete, duration = 5000 }: OnboardingLoadingProps) {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Change text every duration/loadingTexts.length milliseconds
    const textInterval = duration / loadingTexts.length;
    const textTimer = window.setInterval(() => {
      setCurrentTextIndex((prev) => {
        if (prev < loadingTexts.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, textInterval);

    // Update progress bar smoothly
    const progressInterval = 50; // Update every 50ms for smooth animation
    const progressIncrement = (100 / duration) * progressInterval;
    const progressTimer = window.setInterval(() => {
      setProgress((prev) => {
        const next = prev + progressIncrement;
        if (next >= 100) {
          window.clearInterval(progressTimer);
          return 100;
        }
        return next;
      });
    }, progressInterval);

    // Complete after duration, ensure progress is 100%, then delay transfer
    let delayTimer: number | undefined;
    const completeTimer = window.setTimeout(() => {
      console.log('⏰ OnboardingLoading: Timer completed, setting progress to 100%');
      setProgress(100);
      delayTimer = window.setTimeout(() => {
        console.log('⏰ OnboardingLoading: Calling onComplete()');
        onComplete();
      }, 2000);
    }, duration);

    return () => {
      window.clearInterval(textTimer);
      window.clearInterval(progressTimer);
      window.clearTimeout(completeTimer);
      if (delayTimer) {
        window.clearTimeout(delayTimer);
      }
    };
  }, [duration, onComplete]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-50 px-4">
      <div className="flex flex-col items-center space-y-8 max-w-md w-full">
        {/* Logo */}
        <div className="w-64 h-32 flex items-center justify-center animate-pulse">
          <img src={LogoSvg} alt="Collide Logo" className="w-full h-full object-contain" />
        </div>

        {/* Loading Text */}
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800 transition-all duration-500 ease-in-out">
            {loadingTexts[currentTextIndex]}
          </h2>
        </div>

        {/* Enhanced Progress Bar */}
        <div className="w-full max-w-sm space-y-3">
          <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden shadow-inner">
            {/* Background shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            
            {/* Progress fill */}
            <div
              className="h-full bg-gradient-to-r from-[#FF4400] via-[#FF5E24] to-[#FF4400] transition-all duration-100 ease-linear rounded-full shadow-lg relative overflow-hidden"
              style={{ width: `${progress}%` }}
            >
              {/* Animated shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shine" />
            </div>
          </div>
          
          {/* Progress percentage */}
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600 font-medium">Progress</span>
            <span className="text-[#FF4400] font-semibold">{Math.round(progress)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
