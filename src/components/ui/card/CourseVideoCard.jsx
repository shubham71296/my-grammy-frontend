import { Play, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Dropdown, DropdownItem } from "../tw/Dropdown";
import { cn } from "../../../lib/cn";

/** Compact lecture tile — thumb + 2-line title (no overlap with next row) */
const CARD_WIDTH = "w-[128px]";

const CourseVideoCard = ({ lec, idx, openFullScreen, onEdit, onDelete }) => {
  const title = lec.lecture_title || "Untitled lecture";

  const handleEdit = () => onEdit?.(lec);
  const handleDelete = () => onDelete?.(lec);

  return (
    <article className={cn(CARD_WIDTH, "group relative isolate shrink-0")}>
      <div
        className={cn(
          "relative aspect-square w-full overflow-hidden rounded-xl",
          "bg-gradient-to-br from-brand-900 via-brand-700 to-indigo-600",
          "shadow-sm ring-1 ring-slate-200/80 transition duration-300",
          "group-hover:-translate-y-0.5 group-hover:shadow-md group-hover:ring-brand-300"
        )}
      >
        <span className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.12),transparent_55%)]" />

        <span className="absolute left-1.5 top-1.5 z-10 rounded-md bg-black/45 px-1.5 py-0.5 text-[9px] font-bold text-white backdrop-blur-sm">
          {String(idx + 1).padStart(2, "0")}
        </span>

        <div
          className="absolute right-1.5 top-1.5 z-20"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <Dropdown
            align="right"
            trigger={
              <button
                type="button"
                className="rounded-md border border-white/30 bg-white/95 p-1 text-slate-600 shadow-sm transition hover:bg-white"
                aria-label="Lecture options"
              >
                <MoreVertical className="h-3 w-3" />
              </button>
            }
          >
            {(close) => (
              <>
                <DropdownItem
                  onClick={() => {
                    close();
                    handleEdit();
                  }}
                  className="gap-2"
                >
                  <Pencil className="h-4 w-4" />
                  Edit
                </DropdownItem>
                <DropdownItem
                  onClick={() => {
                    close();
                    handleDelete();
                  }}
                  danger
                  className="gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </DropdownItem>
              </>
            )}
          </Dropdown>
        </div>

        <button
          type="button"
          onClick={() => openFullScreen(lec)}
          className="absolute inset-0 z-[1] flex items-center justify-center bg-black/20 transition hover:bg-black/35"
          aria-label={`Play ${title}`}
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-brand-600 shadow-md transition group-hover:scale-105">
            <Play className="h-4 w-4 fill-brand-600 pl-0.5" />
          </span>
        </button>
      </div>

      <div className="relative z-10 mt-2 bg-white pt-0.5">
        <p
          className="line-clamp-2 break-words text-[11px] font-semibold leading-[1.35rem] text-navy"
          title={title}
        >
          {title}
        </p>
      </div>
    </article>
  );
};

export default CourseVideoCard;
