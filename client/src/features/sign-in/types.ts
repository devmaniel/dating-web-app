export type SignInFormProps = {
  onSubmit?: (data: { usernameOrEmail: string; password: string }) => void;
  onGoogleSignIn?: () => void;
};

