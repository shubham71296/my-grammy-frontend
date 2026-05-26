import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "../../../lib/cn";

/**
 * Styled back navigation — use `to` for a route, `-1` for history, or `onClick`.
 */
export function BackButton({
  to = -1,
  onClick,
  label = "Back",
  className,
}) {
  const navigate = useNavigate();

  const styles = cn(
    "group inline-flex items-center gap-2.5 rounded-xl border border-slate-200/90 bg-white",
    "px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm",
    "transition-all duration-200",
    "hover:border-brand-300 hover:bg-brand-50 hover:text-brand-800 hover:shadow-md",
    "active:scale-[0.98]",
    className
  );

  const content = (
    <>
      <span
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100",
          "transition-colors group-hover:bg-brand-100"
        )}
      >
        <ArrowLeft
          className="h-4 w-4 transition-transform group-hover:-translate-x-0.5"
          strokeWidth={2.25}
        />
      </span>
      <span>{label}</span>
    </>
  );

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={styles}>
        {content}
      </button>
    );
  }

  if (typeof to === "string" && to.startsWith("/")) {
    return (
      <Link to={to} className={styles}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={styles}
      onClick={() => navigate(to)}
    >
      {content}
    </button>
  );
}
