import { cn } from "../../../lib/cn";

function DynamicAmount({ val }) {
  return (
    <span
      className={cn(
        "inline-block rounded-md bg-emerald-500/10 px-2.5 py-1 text-sm font-semibold text-emerald-800"
      )}
    >
      ₹ {val}
    </span>
  );
}

export default DynamicAmount;
