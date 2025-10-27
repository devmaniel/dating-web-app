import { X, Plus } from 'lucide-react';
import { cn } from '@/shared/utils';

export interface InterestChipProps {
  emoji: string;
  label: string;
  isSelected: boolean;
  onClick: () => void;
}

export function InterestChip({ emoji, label, isSelected, onClick }: InterestChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200',
        isSelected
          ? 'bg-black text-white hover:bg-gray-800'
          : 'bg-gray-200 text-black hover:bg-gray-300'
      )}
    >
      <span className="text-base">{emoji}</span>
      <span>{label}</span>
      {isSelected ? (
        <X size={16} strokeWidth={2.5} />
      ) : (
        <Plus size={16} strokeWidth={2.5} />
      )}
    </button>
  );
}
