import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Spinner } from "./tw/Spinner";
import { cn } from "../../lib/cn";
import { IMAGE_PLACEHOLDER } from "../../utils/image-constants";

export function ImageLightbox({
  open,
  onClose,
  images = [],
  index = 0,
  onIndexChange,
  title = "Image preview",
}) {
  const count = images.length;
  const multiple = count > 1;
  const current = images[index] ?? images[0];
  const currentUrl = current?.url || IMAGE_PLACEHOLDER;

  const [loading, setLoading] = useState(true);
  const loadedUrlsRef = useRef(new Set());
  const imgRef = useRef(null);

  const goPrev = useCallback(() => {
    if (!multiple) return;
    onIndexChange?.(index <= 0 ? count - 1 : index - 1);
  }, [count, index, multiple, onIndexChange]);

  const goNext = useCallback(() => {
    if (!multiple) return;
    onIndexChange?.(index >= count - 1 ? 0 : index + 1);
  }, [count, index, multiple, onIndexChange]);

  const finishLoad = useCallback((url) => {
    if (url) loadedUrlsRef.current.add(url);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!open) return;

    if (loadedUrlsRef.current.has(currentUrl)) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const img = imgRef.current;
    if (img?.complete && img.naturalWidth > 0) {
      finishLoad(currentUrl);
    }
  }, [open, currentUrl, index, finishLoad]);

  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };

    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, goPrev, goNext]);

  if (!open || !count) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[1400] flex items-center justify-center p-4 sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <button
        type="button"
        aria-label="Close full size preview"
        className="absolute inset-0 bg-slate-900/85"
        onClick={onClose}
      />

      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-3 top-3 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white shadow-lg backdrop-blur-sm transition hover:bg-white/20 sm:right-5 sm:top-5"
      >
        <X className="h-5 w-5" strokeWidth={2.5} />
      </button>

      {multiple ? (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goPrev();
            }}
            aria-label="Previous image"
            className="absolute left-2 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white shadow-lg backdrop-blur-sm transition hover:bg-white/20 sm:left-4"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
            aria-label="Next image"
            className="absolute right-2 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white shadow-lg backdrop-blur-sm transition hover:bg-white/20 sm:right-4"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      ) : null}

      <div className="relative z-10 flex min-h-[200px] max-h-[90vh] max-w-[min(96vw,1200px)] flex-col items-center justify-center">
        {loading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <Spinner
              size="lg"
              className="border-white/30 border-t-white"
            />
            <p className="text-sm font-medium text-white/80">Loading image…</p>
          </div>
        ) : null}

        <img
          ref={imgRef}
          key={currentUrl}
          src={currentUrl}
          alt={current?.originalName || title}
          decoding="async"
          className={cn(
            "h-auto max-h-[85vh] w-auto max-w-full object-contain transition-opacity duration-200",
            loading ? "opacity-0" : "opacity-100"
          )}
          onClick={(e) => e.stopPropagation()}
          onLoad={() => finishLoad(currentUrl)}
          onError={(e) => {
            e.currentTarget.src = IMAGE_PLACEHOLDER;
            finishLoad(currentUrl);
          }}
        />

        {multiple ? (
          <p
            className={cn(
              "mt-4 rounded-full bg-black/50 px-4 py-1.5 text-sm font-semibold text-white transition-opacity",
              loading ? "opacity-0" : "opacity-100"
            )}
          >
            {index + 1} / {count}
          </p>
        ) : null}
      </div>
    </div>,
    document.body
  );
}
