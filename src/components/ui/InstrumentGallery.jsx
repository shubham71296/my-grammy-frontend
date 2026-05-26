import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ImageIcon, ZoomIn } from "lucide-react";
import { ImageLightbox } from "./ImageLightbox";
import { GalleryThumb } from "./tw/GalleryThumb";
import { Spinner } from "./tw/Spinner";
import { cn } from "../../lib/cn";
import { IMAGE_PLACEHOLDER } from "../../utils/image-constants";

export function InstrumentGallery({
  images,
  title,
  className,
  thumbnailsMode = "scroll",
  size = "default",
}) {
  const isLarge = size === "large";
  const count = images.length;
  const hasImages = count > 0;
  const multiple = count > 1;

  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [fullscreenOpen, setFullscreenOpen] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const loadedUrlsRef = useRef(new Set());
  const instrumentKey = images.map((i) => i.key || i.url).join("|");

  const activeImage = images[lightboxIndex] ?? images[0];
  const activeUrl = activeImage?.url || images[0]?.url || IMAGE_PLACEHOLDER;

  useEffect(() => {
    loadedUrlsRef.current.clear();
    setLightboxIndex(0);
    setImageLoading(Boolean(images[0]?.url));
  }, [instrumentKey, images]);

  const selectImage = useCallback(
    (index) => {
      if (index === lightboxIndex) return;
      const url = images[index]?.url;
      if (url && !loadedUrlsRef.current.has(url)) setImageLoading(true);
      setLightboxIndex(index);
    },
    [images, lightboxIndex]
  );

  const goPrev = () => selectImage(lightboxIndex <= 0 ? count - 1 : lightboxIndex - 1);
  const goNext = () => selectImage(lightboxIndex >= count - 1 ? 0 : lightboxIndex + 1);

  const handleMainImageLoad = () => {
    if (activeUrl) loadedUrlsRef.current.add(activeUrl);
    setImageLoading(false);
  };

  const handleThumbWheel = (e) => {
    const el = e.currentTarget;
    if (el.scrollWidth <= el.clientWidth) return;
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      el.scrollLeft += e.deltaY;
      e.preventDefault();
    }
  };

  if (!hasImages) {
    return (
      <div
        className={cn(
          "flex aspect-[4/3] max-h-[280px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white/80 text-center",
          className
        )}
      >
        <ImageIcon className="mb-2 h-10 w-10 text-slate-300" />
        <p className="text-sm font-semibold text-slate-500">No images uploaded</p>
      </div>
    );
  }

  const thumbGrid = thumbnailsMode === "grid";

  return (
    <div className={cn("w-full min-w-0", className)}>
      <p className="mb-3 flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
        <span className="inline-flex items-center gap-1.5">
          <ImageIcon className="h-3.5 w-3.5 text-brand-600" />
          Gallery
        </span>
        {multiple ? (
          <span className="rounded-full bg-white px-2.5 py-0.5 text-[10px] font-bold text-brand-700 ring-1 ring-brand-100">
            {lightboxIndex + 1} / {count}
          </span>
        ) : null}
      </p>

      <div
        className={cn(
          "group relative flex w-full items-center justify-center rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5",
          isLarge
            ? "min-h-[260px] sm:min-h-[320px] lg:min-h-[380px]"
            : "min-h-[240px] sm:min-h-[300px] lg:min-h-[360px]"
        )}
      >
        {imageLoading ? <Spinner className="absolute z-20" size="md" /> : null}
        <button
          type="button"
          onClick={() => setFullscreenOpen(true)}
          aria-label="View full size image"
          className="relative flex w-full cursor-zoom-in items-center justify-center border-0 bg-transparent p-0 outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
        >
          <img
            src={activeUrl}
            alt={activeImage?.originalName || title}
            decoding="async"
            className={cn(
              "product-card__img pointer-events-none mx-auto h-auto w-auto max-w-full object-contain",
              isLarge
                ? "max-h-[min(52vh,340px)] sm:max-h-[min(58vh,420px)] lg:max-h-[min(62vh,480px)]"
                : "max-h-[220px] sm:max-h-[280px] lg:max-h-[340px]",
              imageLoading ? "opacity-0" : "opacity-100"
            )}
            onLoad={handleMainImageLoad}
            onError={(e) => {
              e.currentTarget.src = IMAGE_PLACEHOLDER;
              handleMainImageLoad();
            }}
          />
          <span className="absolute bottom-2 right-2 flex items-center gap-1.5 rounded-full bg-slate-900/65 px-2.5 py-1 text-[11px] font-semibold text-white opacity-0 shadow-md transition group-hover:opacity-100">
            <ZoomIn className="h-3.5 w-3.5" />
            Full size
          </span>
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
              className="absolute left-2 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200/90 bg-white/95 text-slate-700 shadow-md transition hover:bg-brand-50 hover:text-brand-700"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goNext();
              }}
              aria-label="Next image"
              className="absolute right-2 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200/90 bg-white/95 text-slate-700 shadow-md transition hover:bg-brand-50 hover:text-brand-700"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        ) : null}
      </div>

      <ImageLightbox
        open={fullscreenOpen}
        onClose={() => setFullscreenOpen(false)}
        images={images}
        index={lightboxIndex}
        onIndexChange={setLightboxIndex}
        title={title}
      />

      {multiple ? (
        <div
          className={cn(
            "mt-4 w-full gap-2",
            thumbGrid
              ? cn(
                  "grid",
                  count <= 3 && "grid-cols-3",
                  count === 4 && "grid-cols-4",
                  count >= 5 && "grid-cols-3 sm:grid-cols-5"
                )
              : "flex touch-pan-x gap-2.5 overflow-x-auto overscroll-x-contain pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          )}
          onWheel={thumbGrid ? undefined : handleThumbWheel}
        >
          {images.map((img, i) => (
            <GalleryThumb
              key={img.key || img.url || i}
              src={img.url}
              alt={img.originalName || ""}
              size={thumbGrid ? "fill" : "lg"}
              isActive={i === lightboxIndex}
              aria-label={`View image ${i + 1} of ${count}`}
              aria-pressed={i === lightboxIndex}
              onClick={() => selectImage(i)}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
