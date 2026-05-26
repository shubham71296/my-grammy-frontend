import { ChevronDown, Music2 } from "lucide-react";
import { cn } from "../../../lib/cn";

export default function CourseAccordion({
  title,
  children,
  count,
  courseNames = [],
  defaultOpen = false,
}) {
  return (
    <details
      open={defaultOpen}
      className={cn(
        "group rounded-2xl border border-slate-200/80 bg-white",
        "shadow-sm transition duration-300 hover:border-violet-200/80 hover:shadow-md"
      )}
    >
      <summary
        className={cn(
          "flex cursor-pointer list-none items-center gap-3 bg-gradient-to-r from-slate-50 via-white to-violet-50/40 px-4 py-3.5 sm:px-5",
          "[&::-webkit-details-marker]:hidden"
        )}
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-brand-600 text-white shadow-sm">
          <Music2 className="h-5 w-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-extrabold text-navy sm:text-base">{title}</span>
            {count != null ? (
              <span className="rounded-full bg-violet-100 px-2.5 py-0.5 text-[11px] font-bold text-violet-800 ring-1 ring-violet-100/80">
                {count} {count === 1 ? "course" : "courses"}
              </span>
            ) : null}
          </span>
          {courseNames.length > 0 ? (
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider text-violet-700">
                Courses{count != null ? ` · ${count}` : ""}
              </span>
              {courseNames.map((name, i) => (
                <span
                  key={`${name}-${i}`}
                  title={name}
                  className="max-w-[min(100%,14rem)] truncate rounded-full bg-violet-50 px-2.5 py-0.5 text-[11px] font-semibold text-violet-900 ring-1 ring-violet-100/90"
                >
                  {name}
                </span>
              ))}
            </div>
          ) : count != null ? (
            <span className="mt-1 block text-xs font-medium text-muted">
              {count} {count === 1 ? "course" : "courses"}
            </span>
          ) : null}
        </span>
        <ChevronDown className="h-5 w-5 shrink-0 text-slate-500 transition duration-300 group-open:rotate-180" />
      </summary>
      <div className="border-t border-slate-100 bg-slate-50/30 p-4 sm:p-5">{children}</div>
    </details>
  );
}
