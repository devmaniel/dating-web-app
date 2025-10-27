import { forwardRef, useState } from 'react';
import { Input } from '@/shared/components/ui/input';
import { MdEmail } from 'react-icons/md';
import { Button } from '@/shared/components/ui/button';

type EmailInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  onChangeEmail?: () => void;
  showChangeButton?: boolean;
};

export const EmailInput = forwardRef<HTMLInputElement, EmailInputProps>(
  ({ onChangeEmail, showChangeButton = false, ...props }, ref) => {
    const [isEditable, setIsEditable] = useState(!showChangeButton);

    const handleChange = () => {
      setIsEditable(true);
      onChangeEmail?.();
    };

    return (
      <div className="relative flex items-center bg-gray-200 border border-transparent rounded-md hover:bg-white hover:border-gray-900 focus-within:bg-white focus-within:border-gray-900 transition-colors h-12">
        <MdEmail className="w-5 h-5 text-gray-600 ml-3 flex-shrink-0" />
        <Input
          {...props}
          ref={ref}
          type="email"
          disabled={!isEditable}
          className="flex-1 border-0 rounded-md h-12 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent placeholder:text-gray-600 px-3 disabled:opacity-100 disabled:cursor-default"
        />
        {showChangeButton && !isEditable && (
          <Button
            type="button"
            onClick={handleChange}
            variant="ghost"
            className="text-sm text-gray-600 mr-2 h-8 px-3 hover:bg-transparent hover:text-black"
          >
            Change
          </Button>
        )}
      </div>
    );
  }
);

EmailInput.displayName = 'EmailInput';

