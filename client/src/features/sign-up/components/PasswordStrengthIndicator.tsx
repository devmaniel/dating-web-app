import { calculatePasswordStrength, type PasswordStrength } from '../utils/passwordStrength';

type PasswordStrengthIndicatorProps = {
  password: string;
};

const strengthConfig: Record<
  PasswordStrength,
  { color: string; bgColor: string; text: string; width: string }
> = {
  weak: {
    color: 'text-red-600',
    bgColor: 'bg-red-500',
    text: 'Weak',
    width: 'w-1/4',
  },
  fair: {
    color: 'text-orange-600',
    bgColor: 'bg-orange-500',
    text: 'Fair',
    width: 'w-2/4',
  },
  good: {
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-500',
    text: 'Good',
    width: 'w-3/4',
  },
  strong: {
    color: 'text-green-600',
    bgColor: 'bg-green-500',
    text: 'Strong',
    width: 'w-full',
  },
};

export function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  if (!password) return null;

  const { strength } = calculatePasswordStrength(password);
  const config = strengthConfig[strength];

  return (
    <div className="mt-2 space-y-1 animate-in fade-in slide-in-from-top-2 duration-300">
      {/* Progress bar */}
      <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${config.bgColor} transition-all duration-300 ease-out ${config.width}`}
        />
      </div>

      {/* Strength text */}
      <p className={`text-xs font-medium ${config.color} transition-colors duration-300`}>
        Password strength: {config.text}
      </p>
    </div>
  );
}

