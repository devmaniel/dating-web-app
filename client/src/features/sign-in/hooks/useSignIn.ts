import { useState } from 'react';
import { signIn as signInAPI, type SignInPayload, type SignInResponse } from '@/api/auth';
import { useAuthStore } from '@/shared/stores/authStore';

interface UseSignInState {
  isLoading: boolean;
  error: 'invalid_credentials' | 'server_error' | null;
  isSuccess: boolean;
}

export function useSignIn() {
  const [state, setState] = useState<UseSignInState>({
    isLoading: false,
    error: null,
    isSuccess: false,
  });

  const { setAuth } = useAuthStore();

  const signIn = async (payload: SignInPayload): Promise<SignInResponse> => {
    console.log('🔐 Sign in attempt started');
    setState({ isLoading: true, error: null, isSuccess: false });

    try {
      const response = await signInAPI(payload);
      console.log('🔐 Sign in response received:', response);

      if (response.success && response.data) {
        console.log('✅ Sign in successful');
        // Store token and user in auth store
        setAuth(
          {
            id: response.data.id,
            email: response.data.email,
          },
          response.data.token
        );

        setState({ isLoading: false, error: null, isSuccess: true });
      } else {
        const errorCode: 'invalid_credentials' | 'server_error' = response.error === 'invalid_credentials' ? 'invalid_credentials' : 'server_error';
        console.log('❌ Sign in failed with error:', errorCode);
        setState({
          isLoading: false,
          error: errorCode,
          isSuccess: false,
        });
      }

      return response;
    } catch (err) {
      console.error('❌ Unexpected sign in error:', err);
      setState({
        isLoading: false,
        error: 'server_error',
        isSuccess: false,
      });
      return {
        success: false,
        error: 'server_error',
        message: 'Failed to sign in',
      };
    }
  };

  return {
    ...state,
    signIn,
  };
}
