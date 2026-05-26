import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";
import { cn } from "../../lib/cn";

const ScrollToTopButton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 200);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className={cn(
        "fixed bottom-16 right-4 z-[1000] flex flex-col items-center sm:bottom-[70px] sm:right-6",
        "transition-all duration-300",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      )}
    >
      <span className="mb-1 rounded-md bg-accent px-2 py-0.5 text-[10px] font-semibold text-white shadow-md shadow-accent/40">
        Go Top
      </span>
      <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-accent text-white shadow-lg shadow-accent/40 transition hover:-translate-y-0.5 hover:bg-accent/90">
        <ChevronUp className="h-5 w-5" />
      </span>
    </button>
  );
};

export default ScrollToTopButton;
