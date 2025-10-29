export type SignUpFormProps = {
  onSubmit?: (data: {
    email: string;
    birthdate: string;
    password: string;
    confirmPassword: string;
  }) => void;
  onGoogleSignUp?: () => void;
};

export type SignUpError =
  | 'email_exists'
  | 'server_error'
  | 'passwords_mismatch'
  | null;

