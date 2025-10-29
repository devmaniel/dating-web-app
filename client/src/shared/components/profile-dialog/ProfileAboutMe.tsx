interface ProfileAboutMeProps {
  content: string;
}

export const ProfileAboutMe = ({ content }: ProfileAboutMeProps) => {
  return (
    <div className="space-y-2">
      <p className="text-light text-gray-600">About Me</p>
      <h3 className="text-2xl">
        {content}
      </h3>
    </div>
  );
};
