interface ProfileLookingForProps {
  content: string;
}

export const ProfileLookingFor = ({ content }: ProfileLookingForProps) => {
  return (
    <div className="space-y-2">
      <p className="text-light text-gray-600">Looking for?</p>
      <div className="bg-muted-foreground w-full rounded-lg p-5">
        <div className="bg-white w-full p-3 rounded-lg">
          <h3 className="text-center text-black font-bold text-xl">
            {content}
          </h3>
        </div>
      </div>
    </div>
  );
};
