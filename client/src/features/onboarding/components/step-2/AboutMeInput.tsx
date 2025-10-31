import { useState, useEffect } from 'react';
import { Textarea } from '@/shared/components/ui/textarea';

interface AboutMeInputProps {
  value: string;
  onChange: (value: string) => void;
  id?: string;
}

export const AboutMeInput = ({ value, onChange, id }: AboutMeInputProps) => {
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    setCharCount(value.length);
  }, [value]);

  const isOverLimit = charCount > 30;

  return (
    <div className="space-y-2">
      <Textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Tell us about yourself... (Optional)"
        className={`min-h-[80px] resize-none ${
          isOverLimit ? 'border-red-500 focus-visible:ring-red-500' : ''
        }`}
        maxLength={30}
      />
      <div className="flex justify-end text-sm">
        <span className={`${charCount > 30 ? 'text-red-500' : 'text-muted-foreground'}`}>
          {charCount} / 30 characters
        </span>
      </div>
    </div>
  );
};
