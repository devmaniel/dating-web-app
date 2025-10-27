export interface PurposeCardProps {
  title: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}

export function PurposeCard({ title, description, selected, onClick }: PurposeCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left p-6 rounded-lg border-2 transition-all duration-200 ${
        selected
          ? 'bg-black text-white border-black'
          : 'bg-gray-100 border-gray-200 hover:bg-gray-200 hover:border-gray-300 text-black'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
            selected 
              ? 'border-primary' 
              : 'border-gray-400'
          }`}>
            {selected && (
              <div className="w-2.5 h-2.5 rounded-full bg-primary" />
            )}
          </div>
        </div>
        <div className="flex-1 space-y-2">
          <h3 className={`text-base font-semibold ${selected ? 'text-white' : 'text-black'}`}>
            {title}
          </h3>
          <p className={`text-sm leading-relaxed ${selected ? 'text-gray-200' : 'text-gray-600'}`}>
            {description}
          </p>
        </div>
      </div>
    </button>
  );
}
