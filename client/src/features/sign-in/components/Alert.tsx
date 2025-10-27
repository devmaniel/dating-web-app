import { IoWarningOutline } from 'react-icons/io5';

type AlertProps = {
  message: string;
};

export function Alert({ message }: AlertProps) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-md border border-red-200 bg-red-50 text-red-800">
      <IoWarningOutline className="w-5 h-5 flex-shrink-0" />
      <p className="text-sm">{message}</p>
    </div>
  );
}

