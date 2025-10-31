import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/shared/components/ui/dialog";
import { X } from "lucide-react";
import { ProfileContent } from "./ProfileContent";
import type { ChatProfile } from "../data/types";

// Helper function to format education display for server data
const formatEducationDisplay = (profile: ChatProfile): string => {
  // If program exists and already contains " at ", use it as-is
  if (profile.program && profile.program.includes(' at ')) {
    return profile.program;
  }
  
  // If both program and school exist, combine them
  if (profile.program && profile.school) {
    // Remove "Studied at " prefix from school if it exists
    const cleanSchool = profile.school.replace(/^Studied at\s+/i, '');
    return `${profile.program} at ${cleanSchool}`;
  }
  
  // If only program exists, use it
  if (profile.program) {
    return profile.program;
  }
  
  // Fallback to school only
  return profile.school || 'Education information not available';
};

interface ProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: ChatProfile | null;
  isLoading?: boolean;
  error?: string | null;
}

export const ProfileDialog = ({ open, onOpenChange, profile, isLoading, error }: ProfileDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[800px] max-w-[800px] max-h-[90vh] overflow-y-auto p-0">
        {isLoading ? (
          // Loading state
          <>
            <DialogTitle className="sr-only">Loading Profile</DialogTitle>
            <DialogDescription className="sr-only">Please wait while we load the profile</DialogDescription>
            <div className="p-8 flex flex-col items-center justify-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
              <p className="text-sm text-gray-500">Loading profile...</p>
            </div>
          </>
        ) : error || !profile ? (
          // Error state
          <>
            <DialogTitle className="sr-only">Profile Not Available</DialogTitle>
            <DialogDescription className="sr-only">Unable to load the profile at this time</DialogDescription>
            <div className="p-8 flex flex-col items-center justify-center min-h-[400px]">
              <div className="text-red-500 mb-4">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-sm text-gray-700 mb-2 font-semibold">Profile Not Available</p>
              <p className="text-sm text-gray-500 text-center max-w-sm">
                {error || 'Unable to load profile. The backend endpoint may not be implemented yet.'}
              </p>
              <button
                onClick={() => onOpenChange(false)}
                className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
              >
                Close
              </button>
            </div>
          </>
        ) : (
          <>
            <DialogHeader className="sticky top-0 bg-white z-10 p-4 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                    {profile.avatar ? (
                      <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">{profile.name}, {profile.age}</h2>
                    <p className="text-sm text-gray-500">{formatEducationDisplay(profile)}</p>
                  </div>
                </div>
                <button
                  onClick={() => onOpenChange(false)}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <X size={20} />
                </button>
              </div>
            </DialogHeader>
            <div className="p-6">
              <ProfileContent profile={profile} />
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
