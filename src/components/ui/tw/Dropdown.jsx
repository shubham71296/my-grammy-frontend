import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "../../../lib/cn";

const MENU_GAP = 8;

export function Dropdown({ trigger, children, align = "right", className }) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0, ready: false });
  const triggerWrapRef = useRef(null);
  const menuRef = useRef(null);

  const updatePosition = useCallback(() => {
    const triggerEl = triggerWrapRef.current;
    if (!triggerEl) return;

    const rect = triggerEl.getBoundingClientRect();
    const menuEl = menuRef.current;
    const menuHeight = menuEl?.offsetHeight ?? 0;
    const menuWidth = menuEl?.offsetWidth ?? 160;

    let top = rect.bottom + MENU_GAP;
    if (menuHeight && top + menuHeight > window.innerHeight - MENU_GAP) {
      top = Math.max(MENU_GAP, rect.top - menuHeight - MENU_GAP);
    }

    let left = align === "right" ? rect.right - menuWidth : rect.left;
    left = Math.max(
      MENU_GAP,
      Math.min(left, window.innerWidth - menuWidth - MENU_GAP)
    );

    setPosition({ top, left, ready: true });
  }, [align]);

  useLayoutEffect(() => {
    if (!open) {
      setPosition((p) => ({ ...p, ready: false }));
      return;
    }
    updatePosition();
    const id = requestAnimationFrame(updatePosition);
    return () => cancelAnimationFrame(id);
  }, [open, updatePosition]);

  useEffect(() => {
    if (!open) return;

    const onScrollOrResize = () => updatePosition();
    window.addEventListener("scroll", onScrollOrResize, true);
    window.addEventListener("resize", onScrollOrResize);
    return () => {
      window.removeEventListener("scroll", onScrollOrResize, true);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [open, updatePosition]);

  useEffect(() => {
    const handler = (e) => {
      if (
        triggerWrapRef.current?.contains(e.target) ||
        menuRef.current?.contains(e.target)
      ) {
        return;
      }
      setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const menu =
    open &&
    createPortal(
      <div
        ref={menuRef}
        role="menu"
        style={{
          position: "fixed",
          top: position.top,
          left: position.left,
          visibility: position.ready ? "visible" : "hidden",
        }}
        className={cn(
          "z-[9999] min-w-[10rem] overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg",
          className
        )}
      >
        {typeof children === "function"
          ? children(() => setOpen(false))
          : children}
      </div>,
      document.body
    );

  return (
    <>
      <div className="relative inline-block" ref={triggerWrapRef}>
        <div onClick={() => setOpen((o) => !o)}>{trigger}</div>
      </div>
      {menu}
    </>
  );
}

export function DropdownItem({ children, onClick, className, danger }) {
  return (
    <button
      type="button"
      role="menuitem"
      className={cn(
        "flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-medium transition hover:bg-slate-50",
        danger ? "text-danger" : "text-slate-700",
        className
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
