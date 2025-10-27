import { Alert } from './Alert';
import type { SignInError } from '../types/types';

type SignInAlertProps = {
  error: SignInError;
};

const ERROR_MESSAGES: Record<Exclude<SignInError, null>, string> = {
  invalid_credentials: "Account doesn't exist or invalid credentials. Please check your details.",
  server_error: 'Something went wrong with the server. Please try again later.',
};

export function SignInAlert({ error }: SignInAlertProps) {
  if (!error) return null;

  return <Alert message={ERROR_MESSAGES[error]} />;
}

