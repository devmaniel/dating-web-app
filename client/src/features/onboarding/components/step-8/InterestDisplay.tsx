import { INTERESTS_DATA } from '@/features/onboarding/data/interests';

interface InterestDisplayProps {
  selectedInterests: string[];
}

export const InterestDisplay = ({ selectedInterests }: InterestDisplayProps) => {
  // Map selected interests to their full data
  const selectedInterestData = INTERESTS_DATA.filter(interest => 
    selectedInterests.includes(interest.id)
  );

  return (
    <div className="space-y-4">
      <h3 className="text-light text-gray-600 font-medium">Interests</h3>
      {selectedInterestData.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {selectedInterestData.map((interest) => (
            <div 
              key={interest.id}
              className="flex items-center gap-2 px-3 py-1.5 bg-black rounded-full border border-gray-800"
            >
              <span>{interest.emoji}</span>
              <span className="text-sm font-medium text-white">{interest.label}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">No interests selected</p>
      )}
    </div>
  );
};
