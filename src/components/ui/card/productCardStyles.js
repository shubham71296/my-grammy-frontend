import { cn } from "../../../lib/cn";

export const pc = {
  root: (extra) =>
    cn(
      "group relative mx-auto flex h-full w-full max-w-[280px] flex-col rounded-xl",
      "border border-slate-200/90 bg-white",
      "shadow-[0_1px_4px_rgba(15,23,42,0.06)]",
      "transition-all duration-200 ease-out",
      "hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-[0_12px_24px_-8px_rgba(79,70,229,0.18)]",
      extra
    ),
  /** Fits full product photo without cropping */
  media:
    "relative h-[132px] shrink-0 overflow-hidden rounded-t-xl bg-slate-100 min-[420px]:h-[120px] sm:h-[128px]",
  img: "product-card__img p-2 transition-transform duration-300 group-hover:scale-[1.02]",
  /** Course thumbnails — lighter overlay so dark images stay visible */
  courseMedia:
    "relative h-[132px] shrink-0 overflow-hidden rounded-t-xl bg-gradient-to-b from-slate-50 to-slate-100 min-[420px]:h-[120px] sm:h-[128px]",
  courseImg:
    "product-card__img p-2 brightness-[1.05] contrast-[1.08] transition-transform duration-300 group-hover:scale-[1.02]",
  courseOverlay: "pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent",
  body: "relative flex flex-1 flex-col p-3 sm:p-3.5",
  title: "line-clamp-1 text-sm font-bold text-navy",
  desc: "mt-1 line-clamp-2 text-[11px] leading-snug text-muted",
  chip:
    "mb-1.5 inline-flex w-fit items-center rounded-md bg-brand-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-brand-700",
  priceBadge:
    "absolute right-2 top-2 z-10 rounded-md bg-white/95 px-2 py-0.5 text-[10px] font-bold text-brand-700 shadow-sm ring-1 ring-black/5",
  playBtn:
    "pointer-events-none absolute left-1/2 top-1/2 z-10 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-brand-600 shadow-md",
  actions: "mt-2 grid grid-cols-[0.9fr_1.1fr] gap-1.5 pt-1",
  btnOutline: cn(
    "inline-flex min-h-9 min-w-0 items-center justify-center gap-1 rounded-lg border border-brand-400/80",
    "bg-white px-1.5 py-1.5 text-[10px] font-semibold text-brand-700 min-[380px]:text-[11px]",
    "transition hover:bg-brand-50 active:scale-[0.98]"
  ),
  btnPrimary: cn(
    "inline-flex min-h-9 min-w-0 items-center justify-center gap-1 rounded-lg",
    "whitespace-nowrap bg-brand-600 px-1.5 py-1.5 text-[10px] font-semibold text-white min-[380px]:text-[11px]",
    "transition hover:bg-brand-700 active:scale-[0.98]"
  ),
  btnOwned: cn(
    "inline-flex min-h-0 flex-1 items-center justify-center gap-1 rounded-lg",
    "bg-emerald-50 px-2 py-1.5 text-[11px] font-semibold text-emerald-800 ring-1 ring-emerald-200/80"
  ),
};
