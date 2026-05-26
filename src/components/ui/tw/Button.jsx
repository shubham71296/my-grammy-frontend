import { cn } from "../../../lib/cn";

const variants = {
  primary: "btn-primary",
  outline: "btn-outline",
  danger:
    "inline-flex items-center justify-center gap-2 rounded-xl bg-danger px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:opacity-90 disabled:opacity-60",
  ghost:
    "inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100",
};

export function Button({
  variant = "primary",
  className,
  children,
  fullWidth,
  ...props
}) {
  return (
    <button
      type="button"
      className={cn(variants[variant], fullWidth && "w-full", className)}
      {...props}
    >
      {children}
    </button>
  );
}
