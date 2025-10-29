interface ProfileLookingForProps {
  content: string;
}

export const ProfileLookingFor = ({ content }: ProfileLookingForProps) => {
  return (
    <div className="space-y-2">
      <p className="text-light text-muted-foreground">Looking for?</p>
      <div className="bg-muted w-full rounded-lg p-5">
        <div className="bg-background w-full p-3 rounded-lg">
          <h3 className="text-center font-bold text-xl text-foreground">
            {content}
          </h3>
        </div>
      </div>
    </div>
  );
};
