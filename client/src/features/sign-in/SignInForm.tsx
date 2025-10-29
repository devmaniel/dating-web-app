import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import { Loader2 } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { signInSchema, type SignInFormData } from './schemas/signInSchema';
import { SignInFormHeader } from './components/SignInFormHeader';
import { GoogleSignInButton } from './components/GoogleSignInButton';
import { FormDivider } from './components/FormDivider';
import { UsernameEmailInput } from './components/UsernameEmailInput';
import { PasswordInput } from './components/PasswordInput';
import { SignInAlert } from './components/SignInAlert';
import { validateCredentials } from './mock/data';
import type { SignInFormProps, SignInError } from './types/types';

export function SignInForm({ onSubmit, onGoogleSignIn }: SignInFormProps = {}) {
  const navigate = useNavigate();
  const [error, setError] = useState<SignInError>(null);

  const {
    register,
    handleSubmit,
    formState: { isValid },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    mode: 'onChange',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormSubmit = async (data: SignInFormData) => {
    setError(null);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Validate credentials against mock data
      const isValidUser = validateCredentials(data.usernameOrEmail, data.password);

      if (isValidUser) {
        console.log('Login successful:', data);
        onSubmit?.(data);
        
        // Show loading state for 5 seconds before redirecting
        setIsSubmitting(true);
        await new Promise((resolve) => setTimeout(resolve, 5000));
        
        // Navigate to onboarding page
        navigate({ to: '/onboarding' });
      } else {
        setError('invalid_credentials');
      }
    } catch (err) {
      console.error('Sign in error:', err);
      setError('server_error');
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignInClick = async () => {
    console.log('Sign in with Google');
    onGoogleSignIn?.();
    
    // Show loading state for 5 seconds before redirecting
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 5000));
    
    // Navigate to onboarding page
    navigate({ to: '/onboarding' });
  };

  const handleForgotPassword = () => {
    // TODO: Implement forgot password logic
    console.log('Forgot password clicked');
  };

  const handleSignUpClick = () => {
    navigate({ to: '/sign_up' });
  };

  const isFormValid = isValid && !isSubmitting;

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md space-y-8">
        <SignInFormHeader />

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <GoogleSignInButton onClick={handleGoogleSignInClick} disabled={isSubmitting} />

          <FormDivider />

          {error && <SignInAlert error={error} />}

          <UsernameEmailInput
            {...register('usernameOrEmail')}
            placeholder="Enter your username or email"
          />

          <PasswordInput
            {...register('password')}
            placeholder="Enter your password"
          />

          <div className="text-right">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-sm text-primary hover:text-primary/90 cursor-pointer transition-colors"
            >
              Forgot Password ?
            </button>
          </div>

          <Button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className="w-full h-12 rounded-full text-base"
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? 'Signing In...' : 'Sign In'}
          </Button>

          <div className="text-center text-sm">
            <span className="text-gray-600">Don't have Account? </span>
            <button
              type="button"
              onClick={handleSignUpClick}
              className="text-primary hover:text-primary/90 font-semibold cursor-pointer transition-colors"
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
