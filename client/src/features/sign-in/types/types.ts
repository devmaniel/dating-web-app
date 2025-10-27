export type SignInFormProps = {
  onSubmit?: (data: { usernameOrEmail: string; password: string }) => void;
  onGoogleSignIn?: () => void;
};

export type SignInError = 'invalid_credentials' | 'server_error' | null;
