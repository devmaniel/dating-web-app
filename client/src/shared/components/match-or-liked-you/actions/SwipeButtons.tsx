import { IoMdClose } from "react-icons/io";
import { FaFlask } from "react-icons/fa";

interface SwipeButtonsProps {
  onDislike: () => void;
  onLike: () => void;
  dragDirection: '' | 'left' | 'right';
}

export const SwipeButtons = ({ onDislike, onLike, dragDirection }: SwipeButtonsProps) => {
  return (
    <>
      <button 
        onClick={onDislike}
        className={`absolute left-[-100px] top-1/2 transform -translate-y-1/2 w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-colors duration-200 ${
          dragDirection === 'left' ? 'bg-red-500 border-red-500 text-white' : 
          'bg-white border-red-300 hover:bg-red-50 text-red-500'
        }`}
        aria-label="Dislike"
      >
        <IoMdClose className="h-10 w-10" />
      </button>
      
      <button 
        onClick={onLike}
        className={`absolute right-[-100px] top-1/2 transform -translate-y-1/2 w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-colors duration-200 ${
          dragDirection === 'right' ? 'bg-primary border-primary text-white' : 
          'bg-white border-primary hover:bg-primary/10 text-primary'
        }`}
        aria-label="Like"
      >
        <FaFlask className="h-10 w-10" />
      </button>
    </>
  );
};
