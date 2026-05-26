import { cn } from "../../../lib/cn";

function InputFile({
  _name,
  _helperText,
  _errorMsg,
  onChange,
  _style = { _typography: {} },
  _disabled,
  _mandatory,
  _multiple = false,
  _accept,
}) {
  const isError = Boolean(_errorMsg);

  return (
    <div>
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

      <label
        className={cn(
          "mt-2 flex w-full cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed px-4 py-5 transition",
          isError
            ? "border-red-300 bg-red-50/50 hover:border-red-400"
            : "border-brand-200/80 bg-brand-50/30 hover:border-brand-400 hover:bg-brand-50/60",
          _disabled && "pointer-events-none opacity-60"
        )}
      >
        <span className="text-sm font-semibold text-brand-700">Choose files</span>
        <span className="text-xs text-slate-500">
          {_multiple ? "JPG or PNG · multiple allowed" : "Select a file"}
        </span>
        <input
          hidden
          type="file"
          accept={_accept}
          multiple={_multiple}
          onChange={onChange}
          disabled={_disabled}
        />
      </label>

      <p
        className={cn(
          "mt-1 text-xs",
          isError ? "text-danger" : "text-muted"
        )}
      >
        {isError ? _errorMsg : _helperText}
      </p>
    </div>
  );
}

export default InputFile;
