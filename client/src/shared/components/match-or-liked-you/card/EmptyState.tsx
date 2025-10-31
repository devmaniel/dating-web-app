interface EmptyStateProps {
  variant?: 'match' | 'liked-you';
}

export const EmptyState = ({ variant = 'match' }: EmptyStateProps) => {
  const messages = {
    match: "You've swiped through every molecule in range — the lab's quiet for now",
    'liked-you': "Your beaker's empty for now — but great reactions are brewing in the universe! ⚗️✨"
  };

  return (
    <div className="flex items-center justify-center h-full text-center px-6">
      <p className="text-2xl font-bold text-foreground max-w-md">
        {messages[variant]}
      </p>
    </div>
  );
};
