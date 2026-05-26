import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "../../../lib/cn";

export function Modal({
  open,
  onClose,
  children,
  maxWidth = "max-w-2xl",
  maxHeight = "max-h-[calc(100dvh-0.75rem)] sm:max-h-[min(90vh,880px)]",
  className,
  lockClose = false,
}) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape" && !lockClose) onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, lockClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[1300] flex items-end justify-center p-0 sm:items-center sm:p-6">
      <button
        type="button"
        aria-label="Close dialog backdrop"
        className={cn(
          "absolute inset-0 bg-slate-900/50 transition-opacity",
          lockClose && "pointer-events-none"
        )}
        onClick={lockClose ? undefined : onClose}
      />
      <div
        className={cn(
          "relative z-10 flex w-full flex-col overflow-hidden",
          maxHeight,
          "rounded-t-3xl bg-white shadow-[0_24px_60px_-20px_rgba(79,70,229,0.35),0_12px_40px_-16px_rgba(15,23,42,0.2)] sm:rounded-3xl",
          "ring-1 ring-slate-200/80",
          maxWidth,
          lockClose && "pointer-events-none opacity-95",
          className
        )}
        role="dialog"
        aria-modal="true"
      >
        <div
          className="h-1 shrink-0 bg-gradient-to-r from-brand-500 via-violet-500 to-indigo-500"
          aria-hidden
        />
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-y-contain [-webkit-overflow-scrolling:touch]">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}

export function ModalHeader({ children, className, onClose, variant = "default" }) {
  return (
    <div
      className={cn(
        "relative shrink-0 border-b border-slate-100/90 px-4 py-3.5 sm:px-6 sm:py-4",
        variant === "default" &&
          "bg-gradient-to-r from-slate-50/90 via-white to-brand-50/40",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">{children}</div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200/80 bg-white text-slate-500 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800"
            aria-label="Close"
          >
            <X className="h-4 w-4" strokeWidth={2.5} />
          </button>
        )}
      </div>
    </div>
  );
}

export function ModalBody({ children, className }) {
  return (
    <div className={cn("px-4 py-4 sm:px-6 sm:py-6", className)}>{children}</div>
  );
}

export function ModalFooter({ children, className }) {
  return (
    <div
      className={cn(
        "sticky bottom-0 shrink-0 border-t border-slate-100/90",
        "bg-gradient-to-r from-slate-50/95 via-white to-brand-50/50 px-4 py-3.5 sm:px-6 sm:py-4",
        "flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end",
        className
      )}
    >
      {children}
    </div>
  );
}
