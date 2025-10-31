import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/shared/components/ui/dialog";
import { X } from "lucide-react";
import { ProfileContent } from "./ProfileContent";
import type { ChatProfile } from "./types";

interface ProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: ChatProfile | null;
  isLoading?: boolean;
}

export const ProfileDialog = ({ open, onOpenChange, profile, isLoading }: ProfileDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[800px] max-w-[800px] max-h-[90vh] overflow-y-auto p-0">
        {isLoading || !profile ? (
          // Loading state
          <div className="p-8 flex flex-col items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <p className="text-sm text-muted-foreground">Loading profile...</p>
          </div>
        ) : (
          <>
            <DialogHeader className="sticky top-0 bg-background z-10 p-4 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-muted overflow-hidden">
                    {profile.avatar ? (
                      <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-muted to-muted-foreground/20" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">{profile.name}, {profile.age}</h2>
                    <p className="text-sm text-muted-foreground">{profile.school}</p>
                  </div>
                </div>
                <button
                  onClick={() => onOpenChange(false)}
                  className="p-2 rounded-full hover:bg-accent/10"
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
