import { useState } from 'react';
import { signUp as signUpAPI, type SignUpPayload } from '@/api/auth';
import type { SignUpError } from '../types';

interface UseSignUpReturn {
  isLoading: boolean;
  error: SignUpError;
  isSuccess: boolean;
  signUp: (data: SignUpPayload) => Promise<void>;
}

export function useSignUp(): UseSignUpReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<SignUpError>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSignUp = async (data: SignUpPayload) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await signUpAPI(data);

      if (response.success && response.data) {
        // Sign-up successful, but do NOT authenticate yet
        // User must sign-in to get authenticated
        setIsSuccess(true);
      } else {
        // Map error response to SignUpError type
        if (response.error === 'email_exists') {
          setError('email_exists');
        } else {
          setError('server_error');
        }
      }
    } catch (err) {
      console.error('Sign up error:', err);
      setError('server_error');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    isSuccess,
    signUp: handleSignUp,
  };
}
