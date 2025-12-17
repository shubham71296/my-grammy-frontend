import React, { useState } from "react";
import { Box, Dialog, IconButton, Tooltip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

/**
 * DynamicVideoPreview
 * Props:
 *  - val: object or array of objects with { url, originalName, mimeType, size, ... }
 */
const DynamicVideoPreview = ({ val }) => {
  if (!val) return null;

  const files = Array.isArray(val) ? val : [val];
  const [open, setOpen] = useState(false);
  const [activeVideo, setActiveVideo] = useState(null);

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
      {/* Thumbnails row */}
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        {files.map((file, idx) => (
          <Box
            key={idx}
            onClick={() => openFull(file)}
            title={file.originalName || "Play video"}
            sx={{
              width: 60,
              height: 40,
              position: "relative",
              borderRadius: 1.5,
              overflow: "hidden",
              cursor: "pointer",
              transition: "0.3s",
              boxShadow: "0 6px 18px rgba(21, 101, 192, 0.12)",
              "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
                },
            }}
          >
            {/* muted auto-preview for visual thumbnail (no controls) */}
            <video
              src={file.url}
              muted
              playsInline
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />

            {/* dark overlay for icon */}
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to bottom, rgba(0,0,0,0.00) 35%, rgba(0,0,0,0.35) 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                pointerEvents: "none",
              }}
            />

            {/* play icon button */}
            <Tooltip title="Open video">
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  openFull(file);
                }}
                sx={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                  zIndex: 10,
                  width: 40,
                  height: 40,
                  bgcolor: "rgba(0,0,0,0.55)",
                  color: "#fff",
                  "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
                  boxShadow: "0 6px 16px rgba(0,0,0,0.35)",
                }}
                aria-label="open-video"
              >
                <PlayArrowIcon sx={{ fontSize: 24 }} />
              </IconButton>
            </Tooltip>

            {/* small filename badge */}
            <Box
              sx={{
                position: "absolute",
                bottom: 6,
                left: 6,
                right: 6,
                fontSize: 11,
                color: "rgba(255,255,255,0.95)",
                textAlign: "center",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                overflow: "hidden",
                background: "rgba(0,0,0,0.35)",
                borderRadius: 0.75,
                paddingX: 0.5,
                pointerEvents: "none",
              }}
            >
              {file.originalName || file.url}
            </Box>
          </Box>
        ))}
      </Box>

      {/* Fullscreen dialog */}
      <Dialog
        open={open}
        onClose={closeFull}
        maxWidth="xl"
        fullWidth
        PaperProps={{
          sx: {
            background: "transparent",
            boxShadow: "none",
            overflow: "hidden",
          },
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: "80vh",
            bgcolor: "black",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Floating close button */}
          <IconButton
            onClick={closeFull}
            aria-label="close"
            sx={{
              position: "absolute",
              top: 12,
              right: 12,
              zIndex: 50,
              bgcolor: "rgba(0,0,0,0.6)",
              color: "#fff",
              "&:hover": { bgcolor: "rgba(0,0,0,0.8)" },
              boxShadow: "0 6px 18px rgba(0,0,0,0.4)",
            }}
          >
            <CloseIcon />
          </IconButton>

          {/* Video element */}
          {activeVideo && (
            <video
              src={activeVideo.url}
              controls
              autoPlay
              style={{
                maxWidth: "95%",
                maxHeight: "92%",
                width: "auto",
                height: "auto",
                objectFit: "contain",
                borderRadius: 8,
                background: "#000",
              }}
            />
          )}
        </Box>
      </Dialog>
    </>
  );
};

export default DynamicVideoPreview;
