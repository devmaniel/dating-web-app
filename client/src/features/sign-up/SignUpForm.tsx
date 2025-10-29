import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import { Loader2 } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { signUpSchema, type SignUpFormData } from './schemas/signUpSchema';
import { SignUpFormHeader } from './components/SignUpFormHeader';
import { GoogleSignUpButton } from './components/GoogleSignUpButton';
import { FormDivider } from './components/FormDivider';
import { EmailInput } from './components/EmailInput';
import { BirthdayInput } from './components/BirthdayInput';
import { PasswordInput } from './components/PasswordInput';
import { ConfirmPasswordInput } from './components/ConfirmPasswordInput';
import { SignUpAlert } from './components/SignUpAlert';
import { PasswordStrengthIndicator } from './components/PasswordStrengthIndicator';
import { PasswordRequirements } from './components/PasswordRequirements';
import { checkEmailExists } from './mock/data';
import type { SignUpFormProps, SignUpError } from './types';

export function SignUpForm({ onSubmit, onGoogleSignUp }: SignUpFormProps = {}) {
  const navigate = useNavigate();
  const [error, setError] = useState<SignUpError>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [countdown, setCountdown] = useState(7);

  const {
    register,
    handleSubmit,
    watch,
    formState: { isSubmitting, isValid, errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    mode: 'onChange',
  });

  // Watch password field for strength indicator
  const password = watch('password', '');

  // Countdown timer for success redirect
  useEffect(() => {
    if (isSuccess && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (isSuccess && countdown === 0) {
      navigate({ to: '/sign_in' });
    }
  }, [isSuccess, countdown, navigate]);

  const handleFormSubmit = async (data: SignUpFormData) => {
    setError(null);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Check if email already exists
      if (checkEmailExists(data.email)) {
        setError('email_exists');
        return;
      }


      // Simulate random server error (10% chance for testing)
      if (Math.random() < 0.1) {
        setError('server_error');
        return;
      }

      // Success!
      console.log('Sign up successful:', data);
      onSubmit?.(data);
      setIsSuccess(true);
    } catch (err) {
      console.error('Sign up error:', err);
      setError('server_error');
    }
  };

  const handleGoogleSignUpClick = () => {
    console.log('Sign up with Google');
    onGoogleSignUp?.();
  };

  const handleSignInClick = () => {
    navigate({ to: '/sign_in' });
  };

  const isFormValid = isValid && !isSubmitting;

  // Show success screen
  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="w-full max-w-md space-y-6 text-center animate-in fade-in zoom-in-95 duration-500">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center animate-in zoom-in duration-300 delay-100">
              <svg
                className="w-10 h-10 text-green-600"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
          </div>
          <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
            <h2 className="text-3xl font-bold text-black">Sign Up Complete!</h2>
            <p className="text-gray-600 text-lg">
              Your account has been created successfully.
            </p>
            <p className="text-gray-500 text-sm pt-4">
              Redirecting to sign in page in{' '}
              <span className="font-bold text-black text-lg">{countdown}</span> seconds...
            </p>
          </div>
          <button
            onClick={() => navigate({ to: '/sign_in' })}
            className="text-sm text-primary hover:text-primary/90 underline cursor-pointer transition-colors"
          >
            Go to Sign In now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md space-y-8">
        <SignUpFormHeader />

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <GoogleSignUpButton onClick={handleGoogleSignUpClick} />

          <FormDivider />

          {error && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <SignUpAlert error={error} />
            </div>
          )}

          <div className="space-y-1">
            <label htmlFor="email" className="text-sm font-medium text-black">
              Email
            </label>
            <EmailInput
              {...register('email')}
              id="email"
              placeholder="Enter your email address"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="birthdate" className="text-sm font-medium text-black">
              Birthdate
            </label>
            <BirthdayInput
              {...register('birthdate')}
              id="birthdate"
              hasError={!!errors.birthdate}
            />
            {errors.birthdate ? (
              <p className="text-xs text-destructive font-medium">
                {errors.birthdate.message}
              </p>
            ) : (
              <p className="text-xs text-gray-600">
                You must be at least 18 years old to sign up
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label htmlFor="password" className="text-sm font-medium text-black">
              Password
            </label>
            <PasswordInput
              {...register('password')}
              id="password"
              placeholder="Enter a strong password"
            />
            <PasswordStrengthIndicator password={password} />
            <PasswordRequirements password={password} />
          </div>

          <div className="space-y-1">
            <label htmlFor="confirmPassword" className="text-sm font-medium text-black">
              Confirm Password
            </label>
            <ConfirmPasswordInput
              {...register('confirmPassword')}
              id="confirmPassword"
              placeholder="Re-enter your password"
            />
          </div>

          <Button
            type="submit"
            disabled={!isFormValid}
            className="w-full h-12 rounded-full text-base"
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? 'Signing Up...' : 'Sign Up'}
          </Button>

          <div className="text-center text-sm">
            <span className="text-gray-600">Already Have Account? </span>
            <button
              type="button"
              onClick={handleSignInClick}
              className="text-primary hover:text-primary/90 font-semibold cursor-pointer transition-colors"
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

