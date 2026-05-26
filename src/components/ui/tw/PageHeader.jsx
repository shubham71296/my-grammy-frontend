import { cn } from "../../../lib/cn";
import { SearchInput } from "./SearchInput";

const accentStyles = {
  brand: { bar: "bg-brand-600", icon: "bg-brand-600 text-white" },
  instruments: { bar: "bg-sky-600", icon: "bg-sky-600 text-white" },
  courses: { bar: "bg-violet-600", icon: "bg-violet-600 text-white" },
  cart: { bar: "bg-emerald-600", icon: "bg-emerald-600 text-white" },
  orders: { bar: "bg-amber-600", icon: "bg-amber-600 text-white" },
};

/** Compact page title block (cart, orders without search). */
export function PageHeader({
  icon: Icon,
  title,
  subtitle,
  className,
  children,
  variant = "brand",
}) {
  const accent = accentStyles[variant] || accentStyles.brand;

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm",
        className
      )}
    >
      <div className={cn("h-1 w-full", accent.bar)} />
      <div className="flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5">
        <div className="flex min-w-0 items-start gap-3">
          {Icon && (
            <span
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-sm sm:h-11 sm:w-11",
                accent.icon
              )}
            >
              <Icon className="h-[18px] w-[18px] sm:h-5 sm:w-5" strokeWidth={2.25} />
            </span>
          )}
          <div className="min-w-0">
            <h1 className="break-words text-lg font-extrabold tracking-tight text-slate-900 sm:text-2xl">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-1 max-w-xl text-xs leading-relaxed text-slate-600 sm:text-sm">{subtitle}</p>
            )}
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}

/** Title + search in one card (catalog, orders). */
export function PageBannerWithSearch({
  icon: Icon,
  title,
  subtitle,
  variant = "brand",
  searchLabel,
  search,
  onSearchChange,
  searchPlaceholder,
  itemCount,
  showCount = true,
  loading,
  error,
  className,
}) {
  const accent = accentStyles[variant] || accentStyles.brand;

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm",
        className
      )}
    >
      <div className={cn("h-1 w-full", accent.bar)} />
      <div className="px-4 py-4 sm:px-6 sm:py-5">
        <div className="flex min-w-0 items-start gap-3">
          {Icon && (
            <span
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-sm sm:h-11 sm:w-11",
                accent.icon
              )}
            >
              <Icon className="h-[18px] w-[18px] sm:h-5 sm:w-5" strokeWidth={2.25} />
            </span>
          )}
          <div className="min-w-0 flex-1">
            <h1 className="break-words text-lg font-extrabold tracking-tight text-slate-900 sm:text-2xl">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-1 text-xs leading-relaxed text-slate-600 sm:text-sm">{subtitle}</p>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100 bg-slate-50/80 px-4 py-3.5 sm:px-5 sm:py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="min-w-0 flex-1">
            {searchLabel && (
              <p className="mb-2 text-[11px] font-semibold text-slate-600 sm:text-xs">{searchLabel}</p>
            )}
            <SearchInput
              variant="elevated"
              value={search}
              onChange={onSearchChange}
              placeholder={searchPlaceholder}
            />
          </div>
          {showCount && !loading && !error && (
            <span className="inline-flex shrink-0 items-center self-end rounded-lg border border-slate-200 bg-white px-3 py-2 text-[11px] font-bold text-slate-700 shadow-sm sm:self-center sm:text-xs">
              {itemCount} {itemCount === 1 ? "result" : "results"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export function PageContentCard({ children, className }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200/90 bg-white p-3.5 shadow-sm sm:p-6",
        className
      )}
    >
      {children}
    </div>
  );
}

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center px-2 py-10 text-center sm:py-14">
      {Icon && (
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
          <Icon className="h-8 w-8" />
        </span>
      )}
      <p className="mt-4 text-base font-bold text-navy sm:text-lg">{title}</p>
      {description && <p className="mt-2 max-w-sm text-xs leading-relaxed text-muted sm:text-sm">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
