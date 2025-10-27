import { IoMdMale, IoMdFemale } from 'react-icons/io';

export interface GenderPreferenceButtonProps {
  value: 'male' | 'female' | 'nonbinary';
  label: string;
  selected: boolean;
  disabled?: boolean;
  onClick: () => void;
}

export function GenderPreferenceButton({ value, label, selected, disabled, onClick }: GenderPreferenceButtonProps) {
  const getIcon = () => {
    switch (value) {
      case 'male':
        return <IoMdMale className="text-xl" />;
      case 'female':
        return <IoMdFemale className="text-xl" />;
      case 'nonbinary':
        return null;
      default:
        return null;
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`h-14 rounded-lg border-2 transition-all duration-200 flex items-center justify-center font-medium text-base ${
        selected
          ? 'bg-black text-white border-black hover:bg-black hover:text-white'
          : 'bg-gray-100 border-gray-200 hover:bg-gray-200 hover:border-gray-300 text-black'
      } ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      }`}
    >
      {getIcon() && <span className="mr-2">{getIcon()}</span>}
      {label}
    </button>
  );
}
