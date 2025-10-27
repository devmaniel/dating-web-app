import { Check } from 'lucide-react';

export interface LookingForCardProps {
  title: string;
  description?: string;
  selected: boolean;
  onClick: () => void;
}

export function LookingForCard({ title, description, selected, onClick }: LookingForCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative w-full p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
        selected
          ? 'border-black bg-gray-50'
          : 'border-gray-200 bg-white hover:border-gray-300'
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1">
          <h3 className="text-base font-medium text-black">{title}</h3>
          {description && (
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          )}
        </div>
        <div
          className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
            selected
              ? 'border-black bg-black'
              : 'border-gray-300 bg-white'
          }`}
        >
          {selected && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
        </div>
      </div>
    </button>
  );
}
