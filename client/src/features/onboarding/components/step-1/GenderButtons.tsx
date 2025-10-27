import * as React from 'react';
import { IoMdMale, IoMdFemale } from 'react-icons/io';
import type { Gender } from '../../types';

export interface GenderButtonsProps {
  value?: Gender;
  onChange?: (value: Gender) => void;
  name?: string;
}

export const GenderButtons = React.forwardRef<HTMLDivElement, GenderButtonsProps>(
  ({ value, onChange, name }, ref) => {
    const handleGenderClick = (gender: Gender) => {
      console.log('Gender clicked:', gender);
      console.log('Current value before:', value);
      onChange?.(gender);
    };

    console.log('GenderButtons rendering with value:', value);

    const isActive = (gender: Gender) => value === gender;

    return (
      <div ref={ref} className="grid grid-cols-3 gap-3">
        <button
          type="button"
          onClick={() => handleGenderClick('male')}
          className={
            isActive('male')
              ? 'h-14 rounded-lg border-2 transition-all duration-200 flex items-center justify-center font-medium text-base cursor-pointer bg-primary text-primary-foreground border-primary hover:bg-primary/90'
              : 'h-14 rounded-lg border-2 transition-all duration-200 flex items-center justify-center font-medium text-base cursor-pointer bg-secondary border-border hover:bg-secondary/80 text-foreground'
          }
        >
          <IoMdMale className="mr-2 text-xl" />
          Male
        </button>
        <button
          type="button"
          onClick={() => handleGenderClick('female')}
          className={
            isActive('female')
              ? 'h-14 rounded-lg border-2 transition-all duration-200 flex items-center justify-center font-medium text-base cursor-pointer bg-primary text-primary-foreground border-primary hover:bg-primary/90'
              : 'h-14 rounded-lg border-2 transition-all duration-200 flex items-center justify-center font-medium text-base cursor-pointer bg-secondary border-border hover:bg-secondary/80 text-foreground'
          }
        >
          <IoMdFemale className="mr-2 text-xl" />
          Female
        </button>
        <button
          type="button"
          onClick={() => handleGenderClick('nonbinary')}
          className={
            isActive('nonbinary')
              ? 'h-14 rounded-lg border-2 transition-all duration-200 flex items-center justify-center font-medium text-base cursor-pointer bg-primary text-primary-foreground border-primary hover:bg-primary/90'
              : 'h-14 rounded-lg border-2 transition-all duration-200 flex items-center justify-center font-medium text-base cursor-pointer bg-secondary border-border hover:bg-secondary/80 text-foreground'
          }
        >
          Nonbinary
        </button>
        <input type="hidden" name={name} value={value || ''} />
      </div>
    );
  }
);

GenderButtons.displayName = 'GenderButtons';
