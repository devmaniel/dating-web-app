import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/shared/components/ui/dialog";
import { X } from "lucide-react";
import { ProfileContent } from "./ProfileContent";
import type { ChatProfile } from "../data/types";

interface ProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: ChatProfile | null;
}

export const ProfileDialog = ({ open, onOpenChange, profile }: ProfileDialogProps) => {
  if (!profile) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[800px] max-w-[800px] max-h-[90vh] overflow-y-auto p-0">
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
                <p className="text-sm text-gray-500">{profile.school}</p>
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
      </DialogContent>
    </Dialog>
  );
};
