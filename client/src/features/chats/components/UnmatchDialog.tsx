import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';

interface UnmatchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  userName: string;
}

export const UnmatchDialog = ({ open, onOpenChange, onConfirm, userName }: UnmatchDialogProps) => {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Unmatch with {userName}?</DialogTitle>
          <DialogDescription>
            Are you sure you want to unmatch with {userName}? This action cannot be undone.
            <br /><br />
            <strong>Consequences:</strong>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Conversation becomes permanently inactive</li>
              <li>Neither user can send messages</li>
              <li>Cannot be restored by either user</li>
            </ul>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <button
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
          >
            Unmatch
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
