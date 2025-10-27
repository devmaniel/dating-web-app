import { useState, forwardRef } from 'react';
import { Input } from '@/shared/components/ui/input';
import { TiKey } from 'react-icons/ti';
import { FiEye, FiEyeOff } from 'react-icons/fi';

type PasswordInputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  (props, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
      setShowPassword((prev) => !prev);
    };

    return (
      <div className="relative flex items-center bg-gray-200 rounded-md border border-transparent hover:bg-white hover:border-gray-900 focus-within:bg-white focus-within:border-gray-900 transition-colors h-12">
        <TiKey className="w-5 h-5 text-gray-600 ml-3 flex-shrink-0" />
        <Input
          {...props}
          ref={ref}
          type={showPassword ? 'text' : 'password'}
          className="flex-1 border-0 bg-transparent rounded-md h-12 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-600 px-3"
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="text-gray-600 mr-3 cursor-pointer flex items-center flex-shrink-0"
        >
          {showPassword ? (
            <FiEye className="w-5 h-5" />
          ) : (
            <FiEyeOff className="w-5 h-5" />
          )}
        </button>
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';

