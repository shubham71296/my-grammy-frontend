import { useState } from "react";
import { Play, X } from "lucide-react";
import { Modal } from "../tw/Modal";
import { cn } from "../../../lib/cn";

const DynamicVideoPreview = ({ val }) => {
  const [open, setOpen] = useState(false);
  const [activeVideo, setActiveVideo] = useState(null);

  if (!val) return null;

  const files = Array.isArray(val) ? val : [val];

  const openFull = (file) => {
    setActiveVideo(file);
    setOpen(true);
  };

  const closeFull = () => {
    setOpen(false);
    setActiveVideo(null);
  };

  return (
    <>
      <div className="flex items-center gap-1">
        {files.map((file, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => openFull(file)}
            title={file.originalName || "Play video"}
            className={cn(
              "relative h-10 w-[60px] overflow-hidden rounded-lg shadow-md transition",
              "hover:scale-105 hover:shadow-lg"
            )}
          >
            <video
              src={file.url}
              muted
              playsInline
              className="block h-full w-full object-cover"
            />
            <span
              className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/35"
              aria-hidden
            />
            <span
              className={cn(
                "absolute left-1/2 top-1/2 z-10 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2",
                "items-center justify-center rounded-full bg-black/55 text-white shadow-lg"
              )}
            >
              <Play className="h-4 w-4 fill-white" />
            </span>
            <span className="pointer-events-none absolute bottom-1 left-1 right-1 truncate rounded bg-black/35 px-1 text-[10px] text-white">
              {file.originalName || file.url}
            </span>
          </button>
        ))}
      </div>

      <Modal open={open} onClose={closeFull} maxWidth="max-w-5xl" className="bg-black">
        <div className="relative flex h-[80vh] items-center justify-center bg-black">
          <button
            type="button"
            onClick={closeFull}
            aria-label="Close"
            className="absolute right-3 top-3 z-50 rounded-full bg-black/60 p-2 text-white hover:bg-black/80"
          >
            <X className="h-5 w-5" />
          </button>
          {activeVideo && (
            <video
              src={activeVideo.url}
              controls
              autoPlay
              className="max-h-[92%] max-w-[95%] rounded-lg"
            />
          )}
        </div>
      </Modal>
    </>
  );
};

export default DynamicVideoPreview;
