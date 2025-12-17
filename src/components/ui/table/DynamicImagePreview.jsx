import React, { useState } from "react";
import {
  Box,
  Avatar,
  IconButton,
  Dialog,
  DialogContent,
  Grid,
  Typography,
} from "@mui/material";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import BrokenImageIcon from "@mui/icons-material/BrokenImage";
import { Close } from "@mui/icons-material";

const PLACEHOLDER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='140'>
       <rect width='100%' height='100%' fill='#f3f3f3'/>
       <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#aaa' font-size='14'>No image</text>
     </svg>`
  );

// Convert input → { url, originalName }
function normalizeItem(item) {
  if (!item) return null;

  if (item instanceof File) {
    return {
      url: URL.createObjectURL(item),
      originalName: item.name,
    };
  }

  if (typeof item === "string") {
    return {
      url: item,
      originalName: item.split("/").pop(),
    };
  }

  return {
    url: item.url || item.base64 || item.path || null,
    originalName:
      item.originalName ||
      (item.url ? item.url.split("/").pop() : "image"),
  };
}

function flattenImages(val) {
  if (!val) return [];

  if (Array.isArray(val)) {
    return val
      .flat(2)
      .map(normalizeItem)
      .filter((x) => x && x.url);
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

  const handleClose = () => setOpen(false);

  const thumbnails = images.slice(0, 1);
  const moreCount = images.length - thumbnails.length;

  return (
    <>
      {/* Thumbnail Area */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {thumbnails.length === 0 ? (
          <Box
            sx={{
              width: 60,
              height: 45,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <BrokenImageIcon fontSize="small" color="disabled" />
          </Box>
        ) : (
          thumbnails.map((item, i) => (
            <Box
              key={i}
              onClick={() => handleOpen(i)}
              sx={{
                width: 60,
                height: 45,
                borderRadius: 2,
                overflow: "hidden",
                position: "relative",
                cursor: "pointer",
                border: "1px solid #e0e0e0",
                transition: "0.3s",
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
                },
              }}
            >
              <img
                src={item.url}
                alt="preview"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "0.3s",
                }}
                onError={(e) => (e.currentTarget.src = PLACEHOLDER)}
              />

              <IconButton
                size="small"
                sx={{
                  position: "absolute",
                  right: 4,
                  top: 4,
                  bgcolor: "rgba(255,255,255,0.85)",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                  "&:hover": { bgcolor: "white" },
                }}
              >
                <ZoomInIcon fontSize="small" />
              </IconButton>
            </Box>
          ))
        )}

        {/* More Counter */}
        {moreCount > 0 && (
          <Box
            onClick={() => handleOpen(0)}
            sx={{
              width: 50,
              height: 32,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "white",
              border: "1px solid #90caf9",
              cursor: "pointer",
              fontWeight: 600,
              color: "primary.main",
              transition: "0.2s",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              "&:hover": {
                bgcolor: "primary.light",
                color: "white",
                borderColor: "primary.main",
              },
            }}
          >
            +{moreCount}
          </Box>
        )}
      </Box>

      {/* Popup Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: "hidden",
            boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
          },
        }}
      >
        {/* Close Button */}
        <Box
          sx={{
            position: "absolute",
            right: 10,
            top: 10,
            zIndex: 10,
          }}
        >
          <IconButton
            onClick={handleClose}
            sx={{
              bgcolor: "white",
              boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
              "&:hover": { bgcolor: "#f4f4f4" },
            }}
          >
            <Close />
          </IconButton>
        </Box>

        <DialogContent sx={{ p: 3 }}>
          <Grid container spacing={3}>
            {/* Large Image Preview */}
            <Grid item xs={12} md={8}>
              <Box
                sx={{
                  width: "100%",
                  height: { xs: 300, md: 460 },
                  borderRadius: 3,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "grey.100",
                  boxShadow: "inset 0 0 15px rgba(0,0,0,0.08)",
                }}
              >
                <img
                  src={images[currentIndex]?.url}
                  alt="preview-large"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
                  }}
                  onError={(e) => (e.currentTarget.src = PLACEHOLDER)}
                />
              </Box>
            </Grid>

            {/* Right Thumbnail List */}
            <Grid item xs={12} md={4}>
              <Typography
                variant="subtitle1"
                sx={{ mb: 1, fontWeight: 600, color: "text.primary" }}
              >
                Images ({images.length})
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1.2,
                  maxHeight: 450,
                  overflowY: "auto",
                  pr: 1,
                }}
              >
                {images.map((item, idx) => (
                  <Box
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      cursor: "pointer",
                      borderRadius: 2,
                      p: 0.5,
                      transition: "0.3s",
                      border:
                        idx === currentIndex ? "2px solid #1976d2" : "1px solid #e0e0e0",
                      bgcolor: idx === currentIndex ? "#e3f2fd" : "white",
                      boxShadow:
                        idx === currentIndex
                          ? "0 3px 12px rgba(25,118,210,0.3)"
                          : "0 2px 6px rgba(0,0,0,0.08)",
                    }}
                  >
                    <Avatar
                      variant="rounded"
                      src={item.url}
                      sx={{
                        width: 60,
                        height: 45,
                        borderRadius: 2,
                      }}
                    />
                    <Typography
                      variant="caption"
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        maxWidth: 120,
                        fontWeight: 500,
                      }}
                    >
                      {item.originalName}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  );
}
