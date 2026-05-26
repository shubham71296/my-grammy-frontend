import { useState } from "react";
import { ZoomIn, ImageOff } from "lucide-react";
import { ImageLightbox } from "../ImageLightbox";
import { IMAGE_PLACEHOLDER as PLACEHOLDER } from "../../../utils/image-constants";

function normalizeItem(item) {
  if (!item) return null;
  if (item instanceof File) {
    return { url: URL.createObjectURL(item), originalName: item.name };
  }
  if (typeof item === "string") {
    return { url: item, originalName: item.split("/").pop() };
  }
  return {
    url: item.url || item.base64 || item.path || null,
    originalName:
      item.originalName || (item.url ? item.url.split("/").pop() : "image"),
  };
}

function flattenImages(val) {
  if (!val) return [];
  if (Array.isArray(val)) {
    return val.flat(2).map(normalizeItem).filter((x) => x && x.url);
  }
  return [normalizeItem(val)].filter((x) => x && x.url);
}

export default function DynamicImagePreview({ val }) {
  const images = flattenImages(val);
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleOpen = (idx) => {
    setCurrentIndex(idx);
    setOpen(true);
  };

  const thumbnails = images.slice(0, 1);
  const moreCount = images.length - thumbnails.length;

  return (
    <>
      <div className="flex items-center gap-1 p-0.5">
        {thumbnails.length === 0 ? (
          <div className="flex h-[45px] w-[60px] items-center justify-center rounded-lg border border-slate-200 bg-white shadow-sm">
            <ImageOff className="h-4 w-4 text-slate-400" />
          </div>
        ) : (
          thumbnails.map((item, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleOpen(i)}
              className="relative h-[45px] w-[60px] cursor-pointer overflow-hidden rounded-lg border border-slate-200 shadow-sm transition hover:scale-105"
            >
              <img
                src={item.url}
                alt="preview"
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = PLACEHOLDER;
                }}
              />
              <span className="absolute right-1 top-1 rounded bg-white/85 p-0.5 shadow-sm">
                <ZoomIn className="h-3.5 w-3.5 text-slate-600" />
              </span>
            </button>
          ))
        )}

        {moreCount > 0 && (
          <button
            type="button"
            onClick={() => handleOpen(0)}
            className="flex h-8 w-[50px] cursor-pointer items-center justify-center rounded-lg border border-sky-300 bg-white text-sm font-semibold text-brand-600 shadow-sm transition hover:bg-brand-50"
          >
            +{moreCount}
          </button>
        )}
      </div>

      <ImageLightbox
        open={open}
        onClose={() => setOpen(false)}
        images={images}
        index={currentIndex}
        onIndexChange={setCurrentIndex}
        title="Instrument images"
      />
    </>
  );
}
