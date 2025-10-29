import { forwardRef } from 'react';
import { Input } from '@/shared/components/ui/input';
import { TiKey } from 'react-icons/ti';

type PasswordInputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  (props, ref) => {
    return (
      <div className="relative text-background flex items-center bg-gray-200 rounded-md border border-transparent hover:bg-white hover:border-gray-900 focus-within:bg-white focus-within:border-gray-900 transition-colors h-12">
        <TiKey className="w-5 h-5 text-gray-600 ml-3 flex-shrink-0" />
        <Input
          {...props}
          ref={ref}
          type="password"
          className="flex-1 border-0 text-foreground bg-transparent rounded-md h-12 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-600 px-3"
        />
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';

