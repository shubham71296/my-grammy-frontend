import { CirclePlus, Inbox, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../tw/Button";
import { cn } from "../../../lib/cn";

export default function DataNotFoundDynamicTable({
  textLabel,
  buttonRoute,
  countTotalData,
  showSimple = false,
  className,
}) {
  const navigate = useNavigate();
  const isGlobalEmpty = countTotalData === 0;

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200",
        "bg-gradient-to-b from-slate-50/80 to-white px-6 py-14 text-center shadow-sm",
        className
      )}
    >
      <span
        className={cn(
          "mb-4 flex h-14 w-14 items-center justify-center rounded-2xl",
          isGlobalEmpty ? "bg-brand-100 text-brand-700" : "bg-amber-100 text-amber-700"
        )}
      >
        {isGlobalEmpty ? (
          <Inbox className="h-7 w-7" strokeWidth={1.5} />
        ) : (
          <Search className="h-7 w-7" strokeWidth={1.5} />
        )}
      </span>

      <h3 className="text-lg font-extrabold text-navy">
        {isGlobalEmpty ? `No ${textLabel}s yet` : "No matching records"}
      </h3>

      {!showSimple && (
        <>
          <p className="mt-2 max-w-sm text-sm text-slate-600">
            {isGlobalEmpty
              ? `Create your first ${textLabel?.toLowerCase() ?? "item"} to see it listed here.`
              : "Try clearing filters or adjusting your search criteria."}
          </p>

          {isGlobalEmpty && buttonRoute && (
            <Button
              variant="primary"
              className="mt-6 gap-2 text-sm font-bold"
              onClick={() => navigate(buttonRoute)}
            >
              <CirclePlus size={18} />
              Add {textLabel}
            </Button>
          )}
        </>
      )}

      {showSimple && !isGlobalEmpty && (
        <p className="mt-2 text-sm text-slate-600">
          Try adjusting your filters to see more results.
        </p>
      )}
    </div>
  );
}
