import { cn } from "../../../lib/cn";
import { IMAGE_PLACEHOLDER } from "../../../utils/image-constants";

const SIZE_CLASS = {
  md: "h-[3.75rem] w-[5rem] sm:h-[4.25rem] sm:w-[5.75rem]",
  lg: "h-[4.25rem] w-[5.5rem] sm:h-[4.75rem] sm:w-[6.25rem]",
  /** Grid row on detail page — landscape-friendly */
  fill: "aspect-[5/4] w-full min-h-0",
};

export function GalleryThumb({
  src,
  alt = "",
  isActive = false,
  onClick,
  size = "md",
  "aria-label": ariaLabel,
  "aria-pressed": ariaPressed,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      aria-pressed={ariaPressed}
      className={cn(
        "appearance-none border-0 bg-transparent p-0 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-500 focus-visible:outline-offset-2",
        size === "fill" ? "min-w-0 w-full" : "shrink-0"
      )}
    >
      <span
        className={cn(
          "gallery-thumb-frame overflow-hidden rounded-lg border-2 border-solid box-border bg-white",
          SIZE_CLASS[size],
          isActive
            ? "border-brand-600 ring-2 ring-brand-500/25"
            : "border-slate-200 hover:border-slate-300"
        )}
      >
        <img
          src={src}
          alt={alt}
          className="gallery-thumb-img"
          loading="lazy"
          decoding="async"
          draggable={false}
          onError={(e) => {
            e.currentTarget.src = IMAGE_PLACEHOLDER;
          }}
        />
      </span>
    </button>
  );
}
