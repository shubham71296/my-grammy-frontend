import { Search } from "lucide-react";
import { cn } from "../../../lib/cn";

export function SearchInput({
  value,
  onChange,
  placeholder,
  id,
  className,
  inputClassName,
  variant = "default",
  ...props
}) {
  const isElevated = variant === "elevated";

  return (
    <div className={cn("relative", className)}>
      <Search
        className={cn(
          "pointer-events-none absolute top-1/2 z-10 h-[18px] w-[18px] -translate-y-1/2",
          isElevated ? "left-4 text-brand-600" : "left-3.5 text-slate-400"
        )}
        aria-hidden
      />
      <input
        id={id}
        type="search"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className={cn(
          isElevated ? "input-search-elevated" : "input-search",
          inputClassName
        )}
        {...props}
      />
    </div>
  );
}
