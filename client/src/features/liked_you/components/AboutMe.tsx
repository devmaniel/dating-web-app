interface AboutMeProps {
  content: string;
}

export const AboutMe = ({ content }: AboutMeProps) => {
  // Don't render if content is empty or null
  if (!content || content.trim() === '') {
    return null;
  }

  return (
    <div className="space-y-2">
      <p className="text-light text-gray-600">About Me</p>
      <h3 className="text-2xl">
        {content}
      </h3>
    </div>
  );
};
