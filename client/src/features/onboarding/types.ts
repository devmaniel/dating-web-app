export type OnboardingStepOneFormProps = {
  onSubmit?: (data: {
    firstName: string;
    middleName?: string;
    lastName: string;
    birthdate: string;
    gender: 'male' | 'female' | 'nonbinary';
  }) => void;
  initialData?: {
    firstName: string;
    middleName?: string;
    lastName: string;
    birthdate: string;
    gender: 'male' | 'female' | 'nonbinary';
  };
};

export type Gender = 'male' | 'female' | 'nonbinary';

