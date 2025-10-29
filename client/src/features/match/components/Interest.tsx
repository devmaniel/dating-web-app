import { INTERESTS_DATA } from '@/features/onboarding/data/interests';

export const Interest = () => {
  // Filter to get only the specific interests: music, photography, cooking, travel, coffee, movies
  const specificInterests = INTERESTS_DATA.filter(interest => 
    ['music', 'photography', 'cooking', 'travel', 'coffee', 'movies'].includes(interest.id)
  );

  return (
    <div className="space-y-4">
      <h3 className="text-light text-muted-foreground font-medium">Interests</h3>
      <div className="flex flex-wrap gap-2">
        {specificInterests.map((interest) => (
          <div 
            key={interest.id}
            className="flex items-center gap-2 px-3 py-1.5 bg-foreground rounded-full border border-gray-800"
          >
            <span>{interest.emoji}</span>
            <span className="text-sm font-medium text-background">{interest.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
