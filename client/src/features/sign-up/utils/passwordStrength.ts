export type PasswordStrength = 'weak' | 'fair' | 'good' | 'strong';

export interface PasswordRequirements {
  minLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
}

export function checkPasswordRequirements(password: string): PasswordRequirements {
  return {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[@$!%*?&]/.test(password),
  };
}

export function calculatePasswordStrength(password: string): {
  strength: PasswordStrength;
  score: number;
} {
  if (!password) {
    return { strength: 'weak', score: 0 };
  }

  const requirements = checkPasswordRequirements(password);
  const metRequirements = Object.values(requirements).filter(Boolean).length;

  // Calculate score out of 5 requirements
  const score = metRequirements;

  if (score <= 2) return { strength: 'weak', score };
  if (score === 3) return { strength: 'fair', score };
  if (score === 4) return { strength: 'good', score };
  return { strength: 'strong', score };
}

