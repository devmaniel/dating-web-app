import apiClient from './client';
import { API_ENDPOINTS } from './endpoints';

export interface SignUpPayload {
  email: string;
  password: string;
  birthdate: string;
}

export interface SignUpResponse {
  success: boolean;
  data?: {
    id: string;
    email: string;
    token: string;
    message: string;
  };
  error?: string;
  message?: string;
}

export interface SignInPayload {
  email: string;
  password: string;
}

export interface SignInResponse {
  success: boolean;
  data?: {
    id: string;
    email: string;
    token: string;
    message: string;
  };
  error?: string;
  message?: string;
}

export interface ProfileCompletionResponse {
  success: boolean;
  data?: {
    isProfileComplete: boolean;
  };
  error?: string;
  message?: string;
}

/**
 * Sign up a new user
 * @param payload - Sign up data (email, password, birthdate)
 * @returns Sign up response
 */
export async function signUp(payload: SignUpPayload): Promise<SignUpResponse> {
  try {
    const response = await apiClient.post<SignUpResponse>(
      API_ENDPOINTS.AUTH.SIGN_UP,
      payload
    );
    return response.data;
  } catch (error) {
    const errorData = (error as { response?: { data?: SignUpResponse } }).response?.data;
    return {
      success: false,
      error: errorData?.error || 'server_error',
      message: errorData?.message || 'Failed to sign up',
    };
  }
}

/**
 * Sign in a user
 * @param payload - Sign in data (email, password)
 * @returns Sign in response
 */
export async function signIn(payload: SignInPayload): Promise<SignInResponse> {
  try {
    console.log('📡 Calling sign-in API...');
    const response = await apiClient.post<SignInResponse>(
      API_ENDPOINTS.AUTH.SIGN_IN,
      payload
    );
    console.log('📡 Sign-in API success:', response.data);
    return response.data;
  } catch (error) {
    console.log('📡 Sign-in API error caught:', error);
    // Extract error data from axios error response
    const errorData = (error as { response?: { data?: SignInResponse } })?.response?.data;
    
    // If we have error data from server, use it
    if (errorData) {
      console.log('📡 Returning server error data:', errorData);
      return {
        success: false,
        error: errorData.error || 'server_error',
        message: errorData.message || 'Failed to sign in',
      };
    }
    
    // Fallback for network errors
    console.log('📡 Returning fallback error');
    return {
      success: false,
      error: 'server_error',
      message: 'Failed to sign in',
    };
  }
}

/**
 * Check if user's profile is complete
 * @returns Profile completion response
 */
export async function checkProfileCompletion(): Promise<ProfileCompletionResponse> {
  try {
    const response = await apiClient.get<ProfileCompletionResponse>(
      API_ENDPOINTS.AUTH.PROFILE_COMPLETION
    );
    return response.data;
  } catch (error) {
    const errorData = (error as { response?: { data?: ProfileCompletionResponse } }).response?.data;
    return {
      success: false,
      error: errorData?.error || 'server_error',
      message: errorData?.message || 'Failed to check profile completion',
    };
  }
}

export interface LogoutResponse {
  success: boolean;
  message?: string;
  error?: string;
}

/**
 * Logout user
 * @returns Logout response
 */
export async function logout(): Promise<LogoutResponse> {
  try {
    const response = await apiClient.post<LogoutResponse>(
      API_ENDPOINTS.AUTH.LOGOUT
    );
    return response.data;
  } catch (error) {
    const errorData = (error as { response?: { data?: LogoutResponse } }).response?.data;
    return {
      success: false,
      error: errorData?.error || 'server_error',
      message: errorData?.message || 'Failed to logout',
    };
  }
}
