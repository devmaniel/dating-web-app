import { Alert } from '@/shared/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import type { SignUpError } from '../types';

type SignUpAlertProps = {
  error: SignUpError;
};

export function SignUpAlert({ error }: SignUpAlertProps) {
  const errorMessages: Record<Exclude<SignUpError, null>, string> = {
    email_exists: 'This email is already registered. Please use a different email or sign in.',
    passwords_mismatch: "Passwords don't match. Please try again.",
    server_error: 'Something went wrong on our end. Please try again later.',
  };

  if (!error) return null;

  return (
    <Alert 
      variant="destructive" 
      className="bg-red-50 border-red-300 text-red-800 flex items-start gap-3 p-4"
    >
      <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm font-medium leading-relaxed">{errorMessages[error]}</p>
      </div>
    </Alert>
  );
}

