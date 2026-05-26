import { cn } from "../../../lib/cn";

const colors = {
  default: "bg-slate-100 text-slate-700",
  success: "bg-emerald-100 text-emerald-800",
  warning: "bg-amber-100 text-amber-800",
  error: "bg-red-100 text-red-800",
  primary: "bg-brand-100 text-brand-800",
};

export function Badge({ children, color = "default", className }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide",
        colors[color] || colors.default,
        className
      )}
    >
      {children}
    </span>
  );
}
