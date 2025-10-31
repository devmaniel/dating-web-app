import { INTERESTS_DATA } from '@/features/onboarding/data/interests';

interface InterestProps {
  interests?: string[];
}

export const Interest = ({ interests = [] }: InterestProps) => {
  // Map profile interests to INTERESTS_DATA to get emoji and label
  const displayInterests = interests
    .map(interestId => INTERESTS_DATA.find(i => i.id === interestId))
    .filter(Boolean);

  if (displayInterests.length === 0) {
    return null; // Don't show section if no interests
  }

  return (
    <div className="space-y-4">
      <h3 className="text-light text-gray-600 font-medium">Interests</h3>
      <div className="flex flex-wrap gap-2">
        {displayInterests.map((interest) => (
          <div 
            key={interest!.id}
            className="flex items-center gap-2 px-3 py-1.5 bg-black rounded-full border border-gray-800"
          >
            <span>{interest!.emoji}</span>
            <span className="text-sm font-medium text-white">{interest!.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
