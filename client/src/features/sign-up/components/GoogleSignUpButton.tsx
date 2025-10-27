import { Button } from '@/shared/components/ui/button';
import { FcGoogle } from 'react-icons/fc';

type GoogleSignUpButtonProps = {
  onClick: () => void;
};

export function GoogleSignUpButton({ onClick }: GoogleSignUpButtonProps) {
  return (
    <Button
      type="button"
      onClick={onClick}
      className="w-full h-12 bg-black text-white rounded-md border-0"
    >
      <FcGoogle className="w-5 h-5 mr-2" />
      Continue with Google
    </Button>
  );
}

