import { Play } from "lucide-react";
import { cn } from "../../../lib/cn";

const LectureCard = ({ lec, index, onPlay, variant = "default" }) => {
  const isLight = variant === "light";

  return (
    <button
      type="button"
      onClick={() => onPlay(lec)}
      className={cn(
        "group w-full text-left outline-none transition duration-200",
        "focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-2",
        isLight ? "hover:-translate-y-0.5" : "w-[132px] hover:-translate-y-1"
      )}
    >
      <div
        className={cn(
          "relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl transition",
          isLight
            ? "border border-slate-200/90 bg-gradient-to-b from-white to-slate-50 shadow-sm group-hover:border-slate-300 group-hover:shadow-md"
            : "bg-gradient-to-br from-brand-900 via-brand-700 to-indigo-600 shadow-md ring-1 ring-slate-200/80 group-hover:shadow-lg group-hover:ring-brand-300"
        )}
      >
        {!isLight && (
          <span className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15),transparent_55%)]" />
        )}
        <span
          className={cn(
            "relative flex h-11 w-11 items-center justify-center rounded-full shadow-lg transition group-hover:scale-110",
            isLight
              ? "bg-brand-600 text-white"
              : "bg-white text-brand-600"
          )}
        >
          <Play
            className={cn("h-5 w-5 pl-0.5", isLight ? "fill-white" : "fill-brand-600")}
          />
        </span>
        <span
          className={cn(
            "absolute left-2 top-2 rounded-lg px-2 py-0.5 text-[10px] font-bold backdrop-blur-sm",
            isLight
              ? "bg-slate-800/75 text-white"
              : "bg-black/40 text-white"
          )}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <p
        className={cn(
          "mt-2 line-clamp-2 text-xs font-semibold leading-snug",
          isLight
            ? "text-navy group-hover:text-brand-700"
            : "text-navy group-hover:text-brand-700"
        )}
      >
        {lec.lecture_title}
      </p>
    </button>
  );
};

export default LectureCard;
