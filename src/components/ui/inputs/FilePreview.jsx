import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, FileImage, FileText, Video, X } from "lucide-react";
import { cn } from "../../../lib/cn";

function getPreviewMeta(file) {
  const previewURL = file.isExisting ? file.url : URL.createObjectURL(file);
  const fileType = file.isExisting ? file.mimeType || "" : file.type || "";
  const fileName = file.isExisting ? file.originalName : file.name;
  const isImage = fileType.startsWith("image/");
  const isVideo = fileType.startsWith("video/");
  const isPdf = fileType === "application/pdf";
  return { previewURL, fileName, isImage, isVideo, isPdf };
}

const SCROLL_BTN =
  "absolute top-1/2 z-30 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200/90 bg-white/95 text-slate-700 shadow-md transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-400 disabled:pointer-events-none disabled:opacity-35";

export default function FilePreview({ files, onRemove }) {
  const scrollRef = useRef(null);
  const [scrollState, setScrollState] = useState({
    overflows: false,
    left: false,
    right: false,
  });

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    const sl = el.scrollLeft;
    const overflows = maxScroll > 4;
    setScrollState({
      overflows,
      left: overflows && sl > 4,
      right: overflows && sl < maxScroll - 4,
    });
  }, []);

  const scrollByStep = useCallback((direction) => {
    const el = scrollRef.current;
    if (!el) return;
    const step = Math.max(el.clientWidth * 0.75, 140);
    el.scrollBy({ left: direction * step, behavior: "smooth" });
  }, []);

  useEffect(() => {
    updateScrollState();
    const el = scrollRef.current;
    if (!el) return;

    el.addEventListener("scroll", updateScrollState, { passive: true });
    const ro = new ResizeObserver(updateScrollState);
    ro.observe(el);

    return () => {
      el.removeEventListener("scroll", updateScrollState);
      ro.disconnect();
    };
  }, [files.length, updateScrollState]);

  if (!Array.isArray(files) || files.length === 0) return null;

  const imageCount = files.filter((f) => {
    const t = f.isExisting ? f.mimeType : f.type;
    return t?.startsWith("image/");
  }).length;

  const { overflows } = scrollState;

  return (
    <div className="mt-3 overflow-visible rounded-2xl border border-slate-200/80 bg-gradient-to-b from-slate-50/80 to-white p-3 shadow-sm ring-1 ring-slate-100/60 sm:p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">
          <FileImage className="h-3.5 w-3.5 text-brand-600" aria-hidden />
          {imageCount > 0 ? `${imageCount} image${imageCount === 1 ? "" : "s"}` : `${files.length} file${files.length === 1 ? "" : "s"}`}
        </p>
        <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-semibold text-brand-700 ring-1 ring-brand-100">
          Tap × to remove
        </span>
      </div>

      <div className="relative">
        {overflows ? (
          <>
            <button
              type="button"
              aria-label="Scroll previews left"
              disabled={!scrollState.left}
              onClick={() => scrollByStep(-1)}
              className={cn(SCROLL_BTN, "left-0 sm:left-0.5")}
            >
              <ChevronLeft className="h-4 w-4" strokeWidth={2.5} />
            </button>
            <button
              type="button"
              aria-label="Scroll previews right"
              disabled={!scrollState.right}
              onClick={() => scrollByStep(1)}
              className={cn(SCROLL_BTN, "right-0 sm:right-0.5")}
            >
              <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
            </button>
          </>
        ) : null}

        <div
          ref={scrollRef}
          className={cn(
            "flex gap-3 overflow-x-auto overflow-y-visible pb-2 pt-3 [-ms-overflow-style:none] [scrollbar-width:thin] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300",
            overflows ? "px-9 sm:px-10" : "px-1"
          )}
        >
          {files.map((file, fileIndex) => {
            const { previewURL, fileName, isImage, isVideo, isPdf } = getPreviewMeta(file);

            return (
              <article
                key={file.key || fileName || fileIndex}
                className="group relative w-[7.25rem] shrink-0 sm:w-[8.25rem]"
              >
                <button
                  type="button"
                  title="Remove file"
                  onClick={() => onRemove(fileIndex)}
                  className={cn(
                    "absolute right-0 top-0 z-20 flex h-7 w-7 items-center justify-center",
                    "rounded-full border-2 border-white bg-red-500 text-white shadow-md",
                    "transition hover:scale-105 hover:bg-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-400"
                  )}
                >
                  <X className="h-4 w-4" strokeWidth={2.5} />
                </button>

                <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl border border-slate-200/90 bg-white p-2 shadow-sm transition group-hover:border-brand-200 group-hover:shadow-md">
                  {isImage ? (
                    <img
                      src={previewURL}
                      alt={fileName}
                      className="file-preview-img"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : isVideo ? (
                    <div className="flex flex-col items-center gap-1 text-slate-500">
                      <Video className="h-8 w-8 text-brand-600" />
                      <span className="text-[10px] font-semibold">Video</span>
                    </div>
                  ) : isPdf ? (
                    <div className="flex flex-col items-center gap-1">
                      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500 text-xs font-bold text-white shadow-sm">
                        PDF
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1 text-slate-400">
                      <FileText className="h-7 w-7" />
                      <span className="text-[10px]">File</span>
                    </div>
                  )}
                </div>

                <p
                  className="mt-1.5 truncate px-0.5 text-center text-[10px] font-medium text-slate-600"
                  title={fileName}
                >
                  {fileName}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
