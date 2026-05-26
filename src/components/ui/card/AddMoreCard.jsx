import { CirclePlus } from "lucide-react";
import { cn } from "../../../lib/cn";

const AddMoreCourseCard = ({ title, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "flex aspect-square w-[128px] flex-col items-center justify-center rounded-xl",
      "border-2 border-dashed border-brand-300/80 bg-brand-50/50 text-brand-700",
      "transition duration-300 hover:-translate-y-1 hover:border-brand-500 hover:bg-brand-50 hover:shadow-md"
    )}
  >
    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-brand-200">
      <CirclePlus className="h-6 w-6 text-brand-600" />
    </span>
    <span className="mt-1.5 max-w-[96px] text-center text-[10px] font-bold leading-tight">
      {title}
    </span>
  </button>
);

export default AddMoreCourseCard;
