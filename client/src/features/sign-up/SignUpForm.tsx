import { useEffect, useState } from 'react';
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
import { useSignUp } from './hooks/useSignUp';
import type { SignUpFormProps } from './types';

export function SignUpForm({ onSubmit, onGoogleSignUp }: SignUpFormProps = {}) {
  const navigate = useNavigate();
  const { isLoading, error, isSuccess, signUp } = useSignUp();
  const [countdown, setCountdown] = useState(7);

  const {
    register,
    handleSubmit,
    watch,
    formState: { isValid, errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    mode: 'onBlur',
  });

  // Watch password field for strength indicator
  const password = watch('password', '');

  // Show success message briefly before redirecting
  useEffect(() => {
    if (isSuccess) {
      setCountdown(7); // Reset countdown when success occurs
      const timer = setTimeout(() => {
        navigate({ to: '/sign_in' });
      }, 7000);
      
      return () => clearTimeout(timer);
    }
  }, [isSuccess, navigate]);

  // Countdown timer
  useEffect(() => {
    if (isSuccess && countdown > 0) {
      const interval = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [isSuccess, countdown]);

  const handleFormSubmit = async (data: SignUpFormData) => {
    // Call the API hook with form data
    await signUp({
      email: data.email,
      password: data.password,
      birthdate: data.birthdate,
    });

    // Call optional callback
    onSubmit?.(data);
  };

  const handleGoogleSignUpClick = () => {
    console.log('Sign up with Google');
    onGoogleSignUp?.();
  };

  const handleSignInClick = () => {
    navigate({ to: '/sign_in' });
  };

  const isFormDisabled = isLoading || isSuccess;
  const isFormValid = isValid && !isFormDisabled;

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md mb-7">
        {isSuccess ? (
          // Success State UI
          <div className="text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold text-gray-900">Account Created!</h1>
              <p className="text-gray-600">
                Your account has been successfully created. You can now sign in with your credentials.
              </p>
            </div>

            <div className="space-y-3">
              <Button
                onClick={() => navigate({ to: '/sign_in' })}
                className="w-full h-12 rounded-full text-base"
              >
                Go to Sign In
              </Button>
              
              <p className="text-sm text-gray-500">
                Redirecting automatically in <span className="font-medium">{countdown}</span> seconds...
              </p>
            </div>
          </div>
        ) : (
          // Form State UI
          <div className="space-y-8">
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
                  disabled={isFormDisabled}
                />
                {errors.email && (
                  <p className="text-xs text-destructive font-medium">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label htmlFor="birthdate" className="text-sm font-medium text-black">
                  Birthdate
                </label>
                <BirthdayInput
                  {...register('birthdate')}
                  id="birthdate"
                  hasError={!!errors.birthdate}
                  disabled={isFormDisabled}
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
                  disabled={isFormDisabled}
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
                  disabled={isFormDisabled}
                />
                {errors.confirmPassword && (
                  <p className="text-xs text-destructive font-medium">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={!isFormValid}
                className="w-full h-12 rounded-full text-base"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? 'Signing Up...' : 'Sign Up'}
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
        )}
      </div>
    </div>
  );
}

