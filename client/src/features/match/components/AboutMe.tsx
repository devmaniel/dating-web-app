interface AboutMeProps {
  content?: string | null;
}

export const AboutMe = ({ content }: AboutMeProps) => {
  // Don't render if content is empty, null, undefined, or whitespace only
  if (content === null || content === undefined || content === '' || (typeof content === 'string' && content.trim() === '')) {
    return null;
  }

  return (
    <div className="space-y-2">
      <p className="text-light text-muted-foreground">About Me</p>
      <h3 className="text-2xl">
        {content}
      </h3>
    </div>
  );
};
