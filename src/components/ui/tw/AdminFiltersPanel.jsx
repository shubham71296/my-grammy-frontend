import { memo } from "react";
import { Search, X } from "lucide-react";
import { cn } from "../../../lib/cn";

export const AdminFilterField = memo(function AdminFilterField({
  icon: Icon,
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  hint,
  options,
}) {
  return (
    <div className="group min-w-0">
      <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-slate-500">
        {label}
      </label>
      <div className="relative">
        {Icon ? (
          <Icon
            className="pointer-events-none absolute left-3.5 top-1/2 z-10 h-[18px] w-[18px] -translate-y-1/2 text-slate-400 transition group-focus-within:text-brand-600"
            aria-hidden
          />
        ) : null}
        {type === "select" ? (
          <select
            value={value}
            onChange={onChange}
            className={cn("input-search-elevated w-full", Icon && "pl-11")}
          >
            {options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={cn("input-search-elevated w-full", Icon && "pl-11")}
          />
        )}
      </div>
      {hint ? (
        <p className="mt-1.5 text-[11px] font-medium text-amber-700">{hint}</p>
      ) : null}
    </div>
  );
});

export function AdminFiltersPanel({
  title = "Search & filter",
  subtitle,
  hasInput,
  hasAppliedFilter,
  matchCount,
  matchLabel = "match",
  onClear,
  children,
  className,
  columns = 3,
}) {
  return (
    <section
      className={cn(
        "relative mb-5 overflow-hidden rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white via-brand-50/20 to-slate-50/80 shadow-[0_8px_30px_-12px_rgba(79,70,229,0.15)] sm:mb-6",
        className
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(99,102,241,0.08),transparent_50%)]"
        aria-hidden
      />
      <div className="relative border-b border-slate-100/90 px-4 py-4 sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white shadow-md shadow-brand-600/25 sm:h-11 sm:w-11">
              <Search className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <h2 className="text-base font-extrabold text-navy">{title}</h2>
              {subtitle ? <p className="text-xs text-muted">{subtitle}</p> : null}
            </div>
          </div>
          {hasInput ? (
            <button
              type="button"
              onClick={onClear}
              className="inline-flex w-fit items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-red-200 hover:bg-red-50 hover:text-red-700"
            >
              <X className="h-3.5 w-3.5" />
              Clear filters
            </button>
          ) : null}
        </div>
      </div>

      <div
        className={cn(
          "relative grid gap-4 p-4 sm:grid-cols-2 sm:p-6",
          columns === 3 && "lg:grid-cols-3"
        )}
      >
        {children}
      </div>

      {hasAppliedFilter && matchCount != null ? (
        <div className="relative border-t border-brand-100/80 bg-brand-50/50 px-5 py-2.5 text-center text-xs font-medium text-brand-800 sm:px-6">
          Filtering — {matchCount.toLocaleString("en-IN")} {matchLabel}
          {matchCount === 1 ? "" : "es"} found
        </div>
      ) : null}
    </section>
  );
}
