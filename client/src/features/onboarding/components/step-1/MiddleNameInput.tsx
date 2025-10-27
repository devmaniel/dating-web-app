import * as React from 'react';
import { Input } from '@/shared/components/ui/input';

export type MiddleNameInputProps = React.ComponentProps<'input'>;

export const MiddleNameInput = React.forwardRef<HTMLInputElement, MiddleNameInputProps>(
  (props, ref) => {
    return (
      <div className="relative flex items-center bg-secondary border border-transparent rounded-md hover:bg-background hover:border-gray-900 focus-within:bg-background focus-within:border-gray-900 transition-colors h-12">
        <Input
          {...props}
          ref={ref}
          type="text"
          autoComplete="additional-name"
          className="flex-1 border-0 rounded-md h-12 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent placeholder:text-muted-foreground px-3"
        />
      </div>
    );
  }
);

MiddleNameInput.displayName = 'MiddleNameInput';
