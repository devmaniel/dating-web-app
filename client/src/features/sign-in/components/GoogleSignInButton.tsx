import { Button } from '@/shared/components/ui/button';
import { FcGoogle } from 'react-icons/fc';

type GoogleSignInButtonProps = {
  onClick: () => void;
  disabled?: boolean;
};

export function GoogleSignInButton({ onClick, disabled }: GoogleSignInButtonProps) {
  return (
    <Button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="w-full h-12 bg-black text-white rounded-md border-0"
    >
      <FcGoogle className="w-5 h-5 mr-2" />
      Continue with Google
    </Button>
  );
}

