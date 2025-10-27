import { checkPasswordRequirements } from '../utils/passwordStrength';
import { Check, X } from 'lucide-react';

type PasswordRequirementsProps = {
  password: string;
};

export function PasswordRequirements({ password }: PasswordRequirementsProps) {
  const requirements = checkPasswordRequirements(password);

  const requirementsList = [
    { key: 'minLength', text: 'At least 8 characters', met: requirements.minLength },
    { key: 'hasUppercase', text: 'One uppercase letter (A-Z)', met: requirements.hasUppercase },
    { key: 'hasLowercase', text: 'One lowercase letter (a-z)', met: requirements.hasLowercase },
    { key: 'hasNumber', text: 'One number (0-9)', met: requirements.hasNumber },
    {
      key: 'hasSpecialChar',
      text: 'One special character (@$!%*?&)',
      met: requirements.hasSpecialChar,
    },
  ];

  // Don't show until user starts typing
  if (!password) return null;

  return (
    <div className="mt-3 p-3 bg-gray-50 rounded-md border border-gray-200 animate-in fade-in slide-in-from-top-3 duration-300">
      <p className="text-xs font-medium text-gray-700 mb-2">Password must contain:</p>
      <ul className="space-y-1.5">
        {requirementsList.map((req, index) => (
          <li 
            key={req.key} 
            className="flex items-center gap-2 text-xs animate-in fade-in slide-in-from-left-1 duration-200"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {req.met ? (
              <Check className="w-4 h-4 text-green-600 flex-shrink-0 transition-all duration-200" />
            ) : (
              <X className="w-4 h-4 text-gray-400 flex-shrink-0 transition-all duration-200" />
            )}
            <span className={`transition-all duration-200 ${req.met ? 'text-green-700 font-medium' : 'text-gray-600'}`}>
              {req.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

