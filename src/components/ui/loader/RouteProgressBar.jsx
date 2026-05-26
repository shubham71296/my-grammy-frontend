import { cn } from "../../../lib/cn";
import { useNavProgress } from "../../../context/NavProgressContext";

const RouteProgressBar = () => {
  const { pending } = useNavProgress();

  if (!pending) return null;

  return (
    <div
      className={cn(
        "pointer-events-none fixed left-0 top-0 z-[9999] h-[3px] w-full overflow-hidden bg-brand-900/20"
      )}
      aria-hidden
    >
      <div
        className={cn(
          "h-full w-1/3 bg-gradient-to-r from-brand-500 via-sky-400 to-brand-500",
          "animate-[routeProgress_0.8s_ease-in-out_infinite]"
        )}
      />
    </div>
  );
};

export default RouteProgressBar;
