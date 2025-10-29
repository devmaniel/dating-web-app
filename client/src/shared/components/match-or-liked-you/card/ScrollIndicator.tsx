import { BsArrowDown } from "react-icons/bs";

export const ScrollIndicator = () => {
  return (
      <div className="flex flex-col items-center mt-7 pt-8 animate-bounce">
          <div className="w-12 h-12 rounded-full bg-muted border-2 border-muted-foreground flex items-center justify-center mb-2">
           <BsArrowDown className="text-foreground text-md" />
         </div>
         <p className="text-sm text-foreground">Scroll down to see more</p>
       </div>
  );
};
