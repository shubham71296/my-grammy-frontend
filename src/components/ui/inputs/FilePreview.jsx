import { Box, IconButton, Tooltip } from "@mui/material";
import { CloseRounded, VideoLibrary } from "@mui/icons-material";

export default function FilePreview({ files, onRemove }) {
  if (!Array.isArray(files) || files.length === 0) return null;
  return (
    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mt: 1 }}>
      {files.map((file, fileIndex) => {
        const previewURL = file.isExisting
          ? file.url
          : URL.createObjectURL(file);
        const fileType = file.isExisting
          ? file.mimeType || ""
          : file.type || "";
        const fileName = file.isExisting ? file.originalName : file.name;

        return (
          <Box
            key={fileIndex}
            sx={{
              border: "1px solid #ddd",
              borderRadius: 2,
              p: 1,
              position: "relative",
              width: 100,
            }}
          >
            {/* Remove Icon */}
            <span
              style={{
                position: "absolute",
                top: 2,
                right: 2,
              }}
            >
              <Tooltip title="Remove">
                <IconButton
                  size="small"
                  onClick={() => onRemove(fileIndex)}
                  sx={{
                    width: 20,
                    height: 20,
                    bgcolor: "rgba(82, 82, 255, 0.64)",
                    color: "#e0daecff",
                    borderRadius: "50%",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                    "&:hover": {
                      bgcolor: "rgba(59, 53, 229, 0.35)",
                      color: "#331cb7ff",
                      transform: "scale(1.15)",
                      boxShadow: "0 4px 10px rgba(229,57,53,0.4)",
                    },
                    transition: "all 0.25s ease-in-out",
                  }}
                >
                  <CloseRounded fontSize="inherit" />
                </IconButton>
              </Tooltip>
            </span>

            {/* Thumbnail Preview */}
            {fileType.startsWith("image/") ? (
              <img
                src={previewURL}
                alt={file.name}
                style={{
                  width: "100%",
                  height: 60,
                  objectFit: "cover",
                  borderRadius: 4,
                }}
              />
            ) : fileType.startsWith("video/") ? (
              // <video
              //   src={previewURL}
              //   controls
              //   style={{
              //     width: "100%",
              //     height: 80,
              //     borderRadius: 4,
              //     objectFit: "cover",
              //   }}
              // />
              <Box
    sx={{
      width: "100%",
      height: 80,
      borderRadius: 2,
      bgcolor: "#000",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      fontSize: 30,
    }}
  >
    {/* 🎥 */}
    <VideoLibrary fontSize="medium" />
  </Box>
            ) : fileType === "application/pdf" ? (
              <Box
                sx={{
                  width: "100%",
                  height: 60,
                  borderRadius: 4,
                  bgcolor: "#f44336",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  fontSize: 14,
                }}
              >
                PDF
              </Box>
            ) : (
              <Box sx={{ fontSize: 12, textAlign: "center", mt: 2 }}>
                No Preview
              </Box>
            )}

            {/* File name */}
            <Box
              sx={{
                fontSize: 12,
                mt: 0.5,
                textAlign: "center",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {fileName}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}

