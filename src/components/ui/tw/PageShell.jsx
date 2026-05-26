import { cn } from "../../../lib/cn";

export function PageShell({ children, className, narrow, wide }) {
  return (
    <div
      className={cn(
        "page-gradient min-h-screen overflow-x-hidden py-4 sm:py-6 lg:py-8",
        className
      )}
    >
      <div
        className={cn(
          "mx-auto w-full px-3 sm:px-5 lg:px-6",
          narrow ? "max-w-3xl" : wide ? "max-w-7xl" : "max-w-6xl"
        )}
      >
        {children}
      </div>
    </div>
  );
}

export function PagePanel({ children, className, title, icon: Icon }) {
  return (
    <div className={cn("glass-panel rounded-2xl p-4 sm:p-5 lg:p-6", className)}>
      {title && (
        <>
          <h1 className="flex items-center gap-2 text-xl font-extrabold tracking-tight text-brand-900 sm:text-2xl">
            {Icon && <Icon className="h-6 w-6 shrink-0 text-brand-600" />}
            {title}
          </h1>
          <div className="my-4 h-0.5 rounded-full bg-brand-500/30" />
        </>
      )}
      {children}
    </div>
  );
}
