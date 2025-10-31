import { GraduationCap } from "lucide-react";

interface ProfileProgramProps {
  program: string;
}

export const ProfileProgram = ({ program }: ProfileProgramProps) => {
  if (!program || program.trim().length === 0) {
    return null;
  }

  // Parse program to extract course and institution if in "Course at Institution" format
  const parseProgram = (programText: string) => {
    const atIndex = programText.toLowerCase().lastIndexOf(' at ');
    if (atIndex !== -1) {
      const course = programText.substring(0, atIndex).trim();
      const institution = programText.substring(atIndex + 4).trim();
      return { course, institution };
    }
    return { course: programText, institution: null };
  };

  const { course, institution } = parseProgram(program);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <GraduationCap size={20} className="text-gray-600" />
        <h3 className="font-semibold text-gray-900">Education</h3>
      </div>
      <div className="pl-7 space-y-1">
        <p className="text-gray-900 text-sm font-medium leading-relaxed">
          {course}
        </p>
        {institution && (
          <p className="text-gray-600 text-sm leading-relaxed">
            {institution}
          </p>
        )}
      </div>
    </div>
  );
};
