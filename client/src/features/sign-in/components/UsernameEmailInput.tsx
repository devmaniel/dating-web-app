import { forwardRef } from 'react';
import { Input } from '@/shared/components/ui/input';
import { RiAccountPinCircleFill } from 'react-icons/ri';

type UsernameEmailInputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const UsernameEmailInput = forwardRef<HTMLInputElement, UsernameEmailInputProps>(
  (props, ref) => {
    return (
      <div className="relative flex items-center bg-gray-200 border border-transparent rounded-md hover:bg-white hover:border-gray-900 focus-within:bg-white focus-within:border-gray-900 transition-colors h-12">
        <RiAccountPinCircleFill className="w-5 h-5 text-gray-600 ml-3 flex-shrink-0" />
        <Input
          {...props}
          ref={ref}
          type="text"
          className="flex-1 border-0 rounded-md text-foreground h-12 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent placeholder:text-gray-600 px-3"
        />
      </div>
    );
  }
);

UsernameEmailInput.displayName = 'UsernameEmailInput';

