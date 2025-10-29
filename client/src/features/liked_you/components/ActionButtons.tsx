import { LuUndoDot } from "react-icons/lu";

interface ActionButtonsProps {
  onUndo?: () => void;
}

export const ActionButtons = ({ onUndo }: ActionButtonsProps) => {
  return (
    <div className="flex items-center gap-2 relative">
      <button
        type="button"
        className="p-2 hover:bg-accent/10 rounded-full transition-colors"
        aria-label="Undo"
        onClick={onUndo}
      >
        <LuUndoDot className="w-5 h-5 text-foreground" />
      </button>
    </div>
  );
};
