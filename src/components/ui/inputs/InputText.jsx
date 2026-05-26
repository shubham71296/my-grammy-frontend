import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "../../../lib/cn";

function InputText({
  _name,
  _type,
  _value,
  _placeholder,
  _helperText,
  _errorMsg,
  onChange,
  _disabled,
  _mandatory,
  _options,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isError = Boolean(_errorMsg);
  const isMultiline = _options?.multiline === true;
  const inputType =
    _type === "password" ? (showPassword ? "text" : "password") : _type;

  const fieldClass = cn(
    "input-field",
    isError && "border-danger focus:border-danger focus:ring-danger/20",
    _disabled && "cursor-not-allowed bg-slate-50"
  );

  return (
    <div className="mb-4">
      <label className="mb-1.5 block text-xs font-semibold text-slate-600 sm:text-sm">
        {_name}
        {_mandatory && <span className="text-danger"> *</span>}
      </label>

      {isMultiline ? (
        <textarea
          className={cn(fieldClass, "min-h-[88px] resize-y")}
          disabled={_disabled}
          placeholder={_placeholder}
          name={_name}
          value={_value ?? ""}
          onChange={onChange}
          rows={_options?.rows ?? 3}
        />
      ) : (
        <div className="relative">
          <input
            type={inputType}
            className={cn(fieldClass, _type === "password" && "pr-11")}
            disabled={_disabled}
            placeholder={_placeholder}
            name={_name}
            value={_value ?? ""}
            onChange={onChange}
          />
          {_type === "password" && (
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-muted hover:bg-slate-100"
              onClick={() => setShowPassword((p) => !p)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>
      )}

      <p className={cn("mt-1 text-xs", isError ? "text-danger" : "text-muted")}>
        {isError ? _errorMsg : _helperText}
      </p>
    </div>
  );
}

export default InputText;
