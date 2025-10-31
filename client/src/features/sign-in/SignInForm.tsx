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
import { useSignIn } from './hooks/useSignIn';
import type { SignInFormProps } from './types/types';

export function SignInForm({ onSubmit, onGoogleSignIn }: SignInFormProps = {}) {
  const navigate = useNavigate();
  const { isLoading, error, signIn } = useSignIn();

  const {
    register,
    handleSubmit,
    formState: { isValid },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    mode: 'onChange',
  });

  const handleFormSubmit = async (data: SignInFormData, event?: React.BaseSyntheticEvent) => {
    // Explicitly prevent default form submission behavior
    event?.preventDefault();
    
    console.log('📝 Form submitted with data:', data);
    
    try {
      const response = await signIn({
        email: data.usernameOrEmail,
        password: data.password,
      });

      if (response.success) {
        console.log('✅ Sign in successful, navigating to /match');
        onSubmit?.(data);
        
        // Navigate to match page
        navigate({ to: '/match' });
      } else {
        // Error is already set in useSignIn hook state
        console.log('❌ Sign in failed, error displayed:', response.error);
      }
    } catch (err) {
      console.error('❌ Unexpected sign in error:', err);
      // Error should be handled by useSignIn hook
    }
  };

  const handleGoogleSignInClick = async () => {
    console.log('Sign in with Google');
    onGoogleSignIn?.();
    
    // Navigate to match page
    navigate({ to: '/match' });
  };

  const handleForgotPassword = () => {
    // TODO: Implement forgot password logic
    console.log('Forgot password clicked');
  };

  const handleSignUpClick = () => {
    navigate({ to: '/sign_up' });
  };

  const isFormValid = isValid && !isLoading;

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md space-y-8">
        <SignInFormHeader />

        <form 
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleSubmit(handleFormSubmit)(e);
            return false;
          }} 
          className="space-y-4"
        >
          <GoogleSignInButton onClick={handleGoogleSignInClick} disabled={isLoading} />

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
            disabled={!isFormValid || isLoading}
            className="w-full h-12 rounded-full text-base"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? 'Signing In...' : 'Sign In'}
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
