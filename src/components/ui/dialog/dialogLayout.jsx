import { ModalHeader, ModalBody, ModalFooter } from "../tw/Modal";
import { cn } from "../../../lib/cn";

const VARIANT_THEME = {
  view: {
    header: "from-brand-50/90 via-white to-violet-50/60",
    icon: "bg-gradient-to-br from-brand-500 to-indigo-600 shadow-md shadow-brand-500/25",
    accent: "border-brand-200",
  },
  edit: {
    header: "from-amber-50/80 via-white to-brand-50/50",
    icon: "bg-gradient-to-br from-amber-500 to-brand-600 shadow-md shadow-amber-500/20",
    accent: "border-amber-200",
  },
  delete: {
    header: "from-red-50/90 via-white to-rose-50/60",
    icon: "bg-gradient-to-br from-red-500 to-rose-600 shadow-md shadow-red-500/25",
    accent: "border-red-200",
  },
  lock: {
    header: "from-brand-50/80 via-white to-slate-50",
    icon: "bg-gradient-to-br from-brand-600 to-indigo-700 shadow-md shadow-brand-600/25",
    accent: "border-brand-200",
  },
  order: {
    header: "from-emerald-50/80 via-white to-brand-50/40",
    icon: "bg-gradient-to-br from-emerald-600 to-teal-600 shadow-md shadow-emerald-500/20",
    accent: "border-emerald-200",
  },
  lecture: {
    header: "from-violet-50/90 via-white to-indigo-50/60",
    icon: "bg-gradient-to-br from-violet-600 to-indigo-600 shadow-md shadow-violet-500/25",
    accent: "border-violet-200",
  },
};

export function DialogHeaderBar({
  icon: Icon,
  variant = "view",
  title,
  subtitle,
  onClose,
  wrapTitle = false,
}) {
  const theme = VARIANT_THEME[variant] ?? VARIANT_THEME.view;

  return (
    <ModalHeader
      onClose={onClose}
      className={cn("bg-gradient-to-r", theme.header)}
    >
      <div className={cn("flex gap-3.5 pr-2", wrapTitle ? "items-start" : "items-center")}>
        <div
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-white",
            theme.icon
          )}
        >
          <Icon className="h-5 w-5" strokeWidth={2.25} aria-hidden />
        </div>
        <div className="min-w-0">
          <h2
            className={cn(
              "text-base font-extrabold tracking-tight text-navy sm:text-lg",
              wrapTitle
                ? "whitespace-normal break-words leading-snug"
                : "truncate"
            )}
          >
            {title}
          </h2>
          {subtitle ? (
            <p className="mt-0.5 text-xs font-medium text-slate-500">{subtitle}</p>
          ) : null}
        </div>
      </div>
    </ModalHeader>
  );
}

export function DialogSection({ children, className, title }) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-slate-100/90 bg-white shadow-sm ring-1 ring-slate-100/50",
        className
      )}
    >
      {title ? (
        <div className="border-b border-slate-100 bg-slate-50/60 px-4 py-2.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {title}
          </h3>
        </div>
      ) : null}
      <div className="p-4 sm:p-5">{children}</div>
    </div>
  );
}

export function DetailField({ label, value, capitalize, accent, multiline }) {
  return (
    <div
      className={cn(
        "rounded-xl border border-slate-100/90 bg-gradient-to-br from-white to-slate-50/60 p-3.5",
        "shadow-sm ring-1 ring-slate-100/40 transition hover:ring-brand-100/80",
        accent && "border-l-[3px] border-l-brand-500 pl-3"
      )}
    >
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
        {label}
      </p>
      <p
        className={cn(
          "mt-1.5 font-bold text-navy",
          multiline ? "whitespace-pre-wrap text-sm leading-relaxed" : "text-base sm:text-lg",
          capitalize && "capitalize",
          accent && "text-brand-700"
        )}
      >
        {value}
      </p>
    </div>
  );
}

export function InfoGridItem({ label, value }) {
  return (
    <div className="rounded-xl bg-slate-50/80 px-3 py-2.5 ring-1 ring-slate-100/60">
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-slate-800">{value || "—"}</p>
    </div>
  );
}

export function DeleteConfirmBody({ icon: Icon, title, message }) {
  return (
    <ModalBody>
      <div className="mx-auto max-w-md rounded-2xl border border-dashed border-red-200/80 bg-gradient-to-b from-red-50/50 to-white p-6 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-lg shadow-red-500/25">
          <Icon className="h-7 w-7" strokeWidth={2} aria-hidden />
        </div>
        <div className="font-bold text-navy">{title}</div>
        {message ? (
          <p className="mt-2 text-sm leading-relaxed text-slate-600">{message}</p>
        ) : null}
      </div>
    </ModalBody>
  );
}

export function DialogNotice({ icon: Icon, title, children, variant = "brand" }) {
  const styles = {
    brand: "border-brand-100/90 bg-gradient-to-br from-white via-brand-50/70 to-violet-50/60 ring-brand-100/70",
    danger: "border-red-100/90 bg-gradient-to-br from-white via-red-50/75 to-rose-50/60 ring-red-100/70",
  };
  const iconStyles = {
    brand: "bg-brand-600 text-white shadow-brand-500/25",
    danger: "bg-red-500 text-white shadow-red-500/25",
  };
  const bulletStyles = {
    brand: "[&_li]:before:bg-brand-500",
    danger: "[&_li]:before:bg-red-500",
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[1.35rem] border p-4 shadow-sm ring-1 sm:p-5",
        styles[variant] ?? styles.brand
      )}
    >
      <div className="absolute -right-8 -top-10 h-24 w-24 rounded-full bg-white/70 blur-2xl" aria-hidden />
      <div className="relative">
        <div className="flex items-center gap-3">
          {Icon ? (
            <div
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl shadow-lg sm:h-11 sm:w-11",
                iconStyles[variant] ?? iconStyles.brand
              )}
            >
              <Icon className="h-5 w-5 sm:h-[22px] sm:w-[22px]" aria-hidden />
            </div>
          ) : null}
          {title ? (
            <p className="min-w-0 text-base font-extrabold leading-tight text-navy sm:text-lg">
              {title}
            </p>
          ) : null}
        </div>
        {children ? (
          <div
            className={cn(
              "mt-3 text-sm leading-relaxed text-slate-600",
              "[&_ul]:mt-0 [&_ul]:space-y-2 [&_ul]:!list-none [&_ul]:pl-0",
              "[&_li]:relative [&_li]:pl-5 [&_li]:leading-relaxed",
              "[&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:top-[0.65em] [&_li]:before:h-1.5 [&_li]:before:w-1.5 [&_li]:before:rounded-full [&_li]:before:content-['']",
              bulletStyles[variant] ?? bulletStyles.brand
            )}
          >
            {children}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function UploadProgressBar({ label, percent }) {
  const safePercent = Math.min(100, Math.max(0, Number(percent) || 0));

  return (
    <div className="mt-2 min-w-0 rounded-xl bg-slate-50/80 px-3 py-2.5 ring-1 ring-slate-100/60">
      <div className="mb-2 flex min-w-0 items-start justify-between gap-2 text-xs font-medium text-slate-600">
        <span className="min-w-0 truncate leading-snug">{label}</span>
        <span className="shrink-0 font-bold text-brand-700">
          {safePercent}%
        </span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200/80 sm:h-2">
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand-500 to-indigo-500 transition-all duration-300"
          style={{ width: `${safePercent}%` }}
        />
      </div>
    </div>
  );
}

export { ModalBody, ModalFooter };
