import { cn } from "../../../lib/cn";

function DropDown({
  _name,
  _value,
  _placeholder,
  _helperText,
  _errorMsg,
  onChange,
  _options = [],
  _style = { _typography: {} },
  _mandatory = false,
}) {
  const isError = Boolean(_errorMsg);

  return (
    <div className="w-full min-w-0">
      <p
        className={cn(
          "text-xs font-semibold text-slate-600 sm:text-sm",
          _style._typography?.className
        )}
        style={_style._typography?.style}
      >
        {_name}
        {_mandatory && <span className="text-danger"> *</span>}
      </p>

      <select
        value={_value ?? ""}
        onChange={onChange}
        className={cn("input-field mt-1", isError && "border-danger")}
      >
        <option value="" disabled>
          {_placeholder}
        </option>
        {_options.map((opt, i) => (
          <option key={i} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <p className={cn("mt-1 text-xs", isError ? "text-danger" : "text-muted")}>
        {isError ? _errorMsg : _helperText}
      </p>
    </div>
  );
}

export default DropDown;
