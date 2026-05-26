import { Trash2, Plus, Minus, Music2, GraduationCap, Gift } from "lucide-react";
import { IMAGE_PLACEHOLDER } from "../../../utils/image-constants";
import { isFreeWithInstrumentItem } from "../../../utils/cart";
import { cn } from "../../../lib/cn";

const CartItemCard = ({
  item,
  onRemove,
  onIncrease,
  onDecrease,
  compact = false,
  bundledWith,
}) => {
  const title = item?.title;
  const price = item?.price;
  const thumbnail = item?.thumbnail?.[0]?.url;
  const isInstrument = item.productType === "instruments";
  const isFree = isFreeWithInstrumentItem(item);
  const TypeIcon = isInstrument ? Music2 : GraduationCap;

  return (
    <article
      className={cn(
        "group overflow-hidden rounded-2xl border border-slate-200/90 bg-white transition-all duration-200",
        compact
          ? "border-emerald-100/90 bg-emerald-50/30 p-3 shadow-none"
          : "p-4 shadow-[0_2px_8px_rgba(15,23,42,0.06)] sm:hover:border-slate-300 sm:hover:shadow-[0_12px_28px_-12px_rgba(15,23,42,0.12)]"
      )}
    >
      <div
        className={cn(
          "flex gap-4",
          compact ? "items-center" : "flex-col sm:flex-row sm:items-stretch"
        )}
      >
        <div
          className={cn(
            "relative flex shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-100 bg-white",
            compact ? "h-16 w-16" : "h-24 w-24 sm:h-28 sm:w-28"
          )}
        >
          <img
            src={thumbnail || IMAGE_PLACEHOLDER}
            alt={title}
            className={cn(
              "product-card__img object-contain p-1.5",
              compact ? "max-h-14 max-w-14" : "max-h-[5.5rem] max-w-[5.5rem] sm:max-h-24 sm:max-w-24"
            )}
            onError={(e) => {
              e.currentTarget.src = IMAGE_PLACEHOLDER;
            }}
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide",
                  isInstrument
                    ? "bg-brand-50 text-brand-700"
                    : isFree
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-violet-50 text-violet-800"
                )}
              >
                <TypeIcon className="h-3 w-3" />
                {isInstrument ? "Instrument" : isFree ? "Free course" : "Course"}
              </span>
              {isFree && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white">
                  <Gift className="h-3 w-3" />
                  Included
                </span>
              )}
            </div>

            <h3
              className={cn(
                "mt-2 font-bold text-navy",
                compact ? "line-clamp-1 text-sm" : "line-clamp-2 text-base sm:text-lg"
              )}
            >
              {title}
            </h3>

            {bundledWith && (
              <p className="mt-1 text-xs text-emerald-800">
                Free with <strong>{bundledWith}</strong>
              </p>
            )}

            <p className="mt-1.5 text-lg font-extrabold tracking-tight">
              {isFree ? (
                <span className="text-emerald-700">
                  FREE
                  <span className="ml-2 text-xs font-medium text-muted line-through decoration-slate-400">
                    bundled offer
                  </span>
                </span>
              ) : (
                <span className="text-brand-600">
                  ₹{Number(price || 0).toLocaleString("en-IN")}
                  <span className="ml-1 text-xs font-medium text-muted">/ unit</span>
                </span>
              )}
            </p>
          </div>

          {!compact && (
            <div className="mt-4 flex items-center justify-between gap-3">
              {isFree ? (
                <p className="text-xs font-medium text-emerald-700">
                  Unlocked automatically with your instrument
                </p>
              ) : isInstrument ? (
                <div className="inline-flex items-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50/80">
                  <button
                    type="button"
                    className={cn(
                      "p-2.5 transition",
                      item.qty <= 1
                        ? "cursor-not-allowed text-slate-300"
                        : "text-slate-600 hover:bg-white"
                    )}
                    onClick={onDecrease}
                    disabled={item.qty <= 1}
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="min-w-[2.5rem] border-x border-slate-200 px-3 text-center text-sm font-bold text-navy">
                    {item.qty}
                  </span>
                  <button
                    type="button"
                    className="p-2.5 text-slate-600 transition hover:bg-white"
                    onClick={onIncrease}
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <p className="text-xs text-muted">One license per order</p>
              )}

              <button
                type="button"
                className="rounded-xl border border-red-100 bg-red-50/80 p-2.5 text-danger transition hover:bg-red-100"
                onClick={onRemove}
                aria-label="Remove from cart"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

export default CartItemCard;
