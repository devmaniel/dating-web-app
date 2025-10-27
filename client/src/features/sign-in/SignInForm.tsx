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
    formState: { isSubmitting, isValid },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    mode: 'onChange',
  });

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
        // Navigate to home page
        navigate({ to: '/' });
      } else {
        setError('invalid_credentials');
      }
    } catch (err) {
      console.error('Sign in error:', err);
      setError('server_error');
    }
  };

  const handleGoogleSignInClick = () => {
    console.log('Sign in with Google');
    onGoogleSignIn?.();
  };

  const handleForgotPassword = () => {
    // TODO: Implement forgot password logic
    console.log('Forgot password clicked');
  };

  const handleSignUpClick = () => {
    // TODO: Implement sign up navigation
    console.log('Sign up clicked');
  };

  const isFormValid = isValid && !isSubmitting;

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md space-y-8">
        <SignInFormHeader />

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <GoogleSignInButton onClick={handleGoogleSignInClick} />

          <FormDivider />

          {error && <SignInAlert error={error} />}

          <UsernameEmailInput
            {...register('usernameOrEmail')}
            placeholder="Username/Email"
          />

          <PasswordInput
            {...register('password')}
            placeholder="************"
          />

          <div className="text-right">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-sm text-gray-600 cursor-pointer"
            >
              Forgot Password ?
            </button>
          </div>

          <Button
            type="submit"
            disabled={!isFormValid}
            className="w-full h-12 bg-black text-white rounded-full text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? 'Signing In...' : 'Sign In'}
          </Button>

          <div className="text-center text-sm">
            <span className="text-gray-600">Don't have Account? </span>
            <button
              type="button"
              onClick={handleSignUpClick}
              className="text-black font-semibold cursor-pointer"
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
