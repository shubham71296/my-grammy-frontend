import { useEffect } from "react";
import { createPortal } from "react-dom";
import { cn } from "../../../lib/cn";

export function Drawer({ open, onClose, children, side = "left", className }) {
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[1200]">
      <button
        type="button"
        className="absolute inset-0 animate-[drawerFadeIn_180ms_ease-out] bg-slate-950/45 backdrop-blur-[2px]"
        aria-label="Close menu"
        onClick={onClose}
      />
      <aside
        className={cn(
          "absolute top-0 flex h-full w-[min(88vw,340px)] flex-col bg-white shadow-2xl",
          side === "left"
            ? "left-0 rounded-r-[1.75rem] animate-[drawerSlideInLeft_240ms_cubic-bezier(0.22,1,0.36,1)]"
            : "right-0 rounded-l-[1.75rem] animate-[drawerSlideInRight_240ms_cubic-bezier(0.22,1,0.36,1)]",
          className
        )}
      >
        {children}
      </aside>
    </div>,
    document.body
  );
}
