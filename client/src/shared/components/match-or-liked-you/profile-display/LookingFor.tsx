interface LookingForProps {
  content: string;
}

export const LookingFor = ({ content }: LookingForProps) => {
  return (
    <div className="space-y-2">
      <p className="text-light text-muted-foreground">Looking for?</p>
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
