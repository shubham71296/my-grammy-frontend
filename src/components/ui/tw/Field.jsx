import { cn } from "../../../lib/cn";

export function Field({
  label,
  required,
  error,
  hint,
  className,
  children,
}) {
  return (
    <div className={cn("mb-4", className)}>
      {label && (
        <label className="mb-1.5 block text-xs font-semibold text-slate-600 sm:text-sm">
          {label}
          {required && <span className="text-danger"> *</span>}
        </label>
      )}
      {children}
      {(error || hint) && (
        <p
          className={cn(
            "mt-1 text-xs",
            error ? "text-danger" : "text-muted"
          )}
        >
          {error || hint}
        </p>
      )}
    </div>
  );
}

export function TextInput({
  label,
  required,
  error,
  hint,
  type = "text",
  className,
  ...props
}) {
  return (
    <Field label={label} required={required} error={error} hint={hint}>
      <input type={type} className={cn("input-field", error && "border-danger", className)} {...props} />
    </Field>
  );
}
