import { useState, useMemo, useEffect } from "react";
import { Filter, RefreshCw } from "lucide-react";
import InputText from "./inputs/InputText";
import { resetInputs } from "../../utils/common-util";
import { Button } from "./tw/Button";
import { cn } from "../../lib/cn";

function FilterForm({ title, inputs, setInputs, onSubmit, onReset }) {
  const hasValue = (val) => {
    if (val === null || val === undefined) return false;
    if (Array.isArray(val)) return val.length > 0;
    if (typeof val === "boolean") return val === true;
    if (typeof val === "number") return !Number.isNaN(val);
    if (typeof val === "string") return val.trim() !== "";
    if (typeof val === "object") return Object.keys(val).length > 0;
    return false;
  };

  const anyInputFilled = useMemo(
    () => inputs.some((inp) => hasValue(inp._value)),
    [inputs]
  );

  const handleChange = (e, i1) => {
    const tempInputs = [...inputs];
    tempInputs[i1]._value = e.target.value;
    tempInputs[i1]._errorMsg = "";
    setInputs(tempInputs);
  };

  useEffect(() => {
    setInputs(resetInputs(inputs));
  }, []);

  return (
    <div className="glass-panel mb-4 w-full rounded-2xl p-4 sm:p-5">
      <h2 className="mb-4 text-lg font-bold text-brand-700 sm:text-xl md:text-2xl">
        {title}
      </h2>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {inputs.map((p1, i1) => (
          <div key={`grid-${p1._key}-${i1}`}>
            <InputText {...p1} onChange={(event) => handleChange(event, i1)} />
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button
          variant="primary"
          className="min-w-[140px]"
          onClick={onSubmit}
          disabled={!anyInputFilled}
        >
          <Filter size={18} />
          Apply Filter
        </Button>

        <Button
          variant="outline"
          className={cn(
            "min-w-[140px] bg-brand-50",
            !anyInputFilled && "opacity-60"
          )}
          onClick={onReset}
          disabled={!anyInputFilled}
        >
          <RefreshCw size={18} />
          Reset
        </Button>
      </div>
    </div>
  );
}

export default FilterForm;
