import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Box,
  Stack,
  Typography,
  Chip,
  Grid,
  IconButton,
  ImageList,
  ImageListItem,
  DialogContentText,
  Avatar,
  useTheme,
  Paper,
  CircularProgress,
} from "@mui/material";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

import { useNavigate } from "react-router-dom";
import { CloseRounded, Visibility } from "@mui/icons-material";
import ReportGmailerrorredRoundedIcon from "@mui/icons-material/ReportGmailerrorredRounded";
import { closeDialog } from "../../../features/ui/uiSlice";
import { getVideoStreamUrl } from "../../../api/video";

export default function VideoPreviewDialog() {
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { selectedData, dialogInfo } = useSelector((state) => state.ui.dialog);

  const videoKey = selectedData?.videoKey;
  const lectureId = selectedData?.lectureId;
  const previewTitle = selectedData.title;

  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const handleClose = () => dispatch(closeDialog());

  useEffect(() => {
    if (!videoKey || !lectureId || !token) return;

    async function loadVideo() {
      try {
        setLoading(true);
        const url = await getVideoStreamUrl(videoKey, lectureId, token);
        setVideoUrl(url);
      } catch (err) {
        console.error("Video load failed", err);
        const status = err?.response?.status;
        const msg = err?.response?.data?.msg;

        if (status === 403) {
          setErrorMsg(msg || "You are not allowed to watch this video");
        } else if (status === 401) {
          setErrorMsg("Session expired. Please login again.");
        } else {
          setErrorMsg("Failed to load video. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    }

    loadVideo();
  }, [videoKey, lectureId, token]);

  if (dialogInfo?.check !== "view_video") return null;

  return (
    <>
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: { xs: 28, sm: 34, md: 36 },
              height: { xs: 28, sm: 34, md: 36 },
              borderRadius: "50%",
              background: "linear-gradient(135deg, #9c9affff, #4d53ffff)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              boxShadow: "0 3px 8px rgba(107, 77, 255, 0.4)",
            }}
          >
            <Visibility
              sx={{
                fontSize: { xs: 16, sm: 18, md: 20 },
              }}
            />
          </Box>

          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              fontSize: {
                xs: "0.95rem",
                sm: "1.1rem",
                md: "1.25rem",
              },
            }}
          >
            {previewTitle}
          </Typography>
        </Box>

        <IconButton
          onClick={handleClose}
          size="small"
          sx={{ color: "rgba(142, 144, 240, 0.9)" }}
        >
          <CloseRoundedIcon />
        </IconButton>
      </DialogTitle>

      <Divider />
      <DialogContent dividers sx={{ p: { xs: 2, md: 3 } }}>
        {loading && (
          <Stack alignItems="center" gap={2} py={5}>
            <CircularProgress />
            <Typography color="text.secondary">Loading video…</Typography>
          </Stack>
        )}

        {!loading && errorMsg && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            {/* <Paper
            elevation={0}
            sx={{
              p: 4,
              textAlign: "center",
              maxWidth: 420,
              bgcolor: "#fff5f5",
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" color="error" fontWeight={700} sx={{fontSize: {
                  xs: "0.95rem", 
                  sm: "1.1rem", 
                  md: "1.25rem", 
                }}}>
              Access Denied
            </Typography>
            <Typography sx={{ mt: 1, color: "#555", fontSize: {
                  xs: "0.95rem", 
                  sm: "1.1rem", 
                  md: "1.25rem", 
                } }}>
              {errorMsg}
            </Typography>

            <Button
              variant="contained"
              sx={{ mt: 3 }}
              onClick={handleClose}
            >
              Close
            </Button>
          </Paper> */}

            <Paper
              elevation={3}
              sx={{
                p: { xs: 3, sm: 4 },
                textAlign: "center",
                maxWidth: 420,
                mx: "auto",
                borderRadius: 3,
                background: "linear-gradient(135deg, #fff5f5, #ffecec)",
                boxShadow: "0 8px 24px rgba(255,0,0,0.12)",
                animation: "fadeIn 0.4s ease",
                "@keyframes fadeIn": {
                  from: { opacity: 0, transform: "translateY(8px)" },
                  to: { opacity: 1, transform: "translateY(0)" },
                },
              }}
            >
              {/* Icon */}
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: "50%",
                  mx: "auto",
                  mb: 2,
                  background: "rgba(244,67,54,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ReportGmailerrorredRoundedIcon
                  sx={{
                    fontSize: 36,
                    color: "error.main",
                  }}
                />
              </Box>

              {/* Title */}
              <Typography
                variant="h6"
                fontWeight={700}
                color="error"
                sx={{
                  fontSize: {
                    xs: "1.05rem",
                    sm: "1.2rem",
                    md: "1.35rem",
                  },
                  mb: 1,
                }}
              >
                Access Denied
              </Typography>

              {/* Message */}
              <Typography
                sx={{
                  color: "text.secondary",
                  fontSize: {
                    xs: "0.9rem",
                    sm: "1rem",
                    md: "1.1rem",
                  },
                  lineHeight: 1.5,
                  px: 1,
                }}
              >
                {errorMsg}
              </Typography>

              {/* Button */}
              <Button
                variant="contained"
                onClick={handleClose}
                sx={{
                  mt: 3,
                  px: 4,
                  py: 1,
                  fontWeight: 600,
                  textTransform: "none",
                  borderRadius: 2,
                  fontSize: {
                    xs: "0.85rem",
                    sm: "0.95rem",
                  },
                  background: "linear-gradient(135deg, #e53935, #b71c1c)",
                  transition: "0.3s ease",
                  "&:hover": {
                    background: "linear-gradient(135deg, #f44336, #d32f2f)",
                    transform: "scale(1.03)",
                    boxShadow: "0 6px 18px rgba(244,67,54,0.3)",
                  },
                }}
              >
                Close
              </Button>
            </Paper>
          </Box>
        )}

        {!loading && videoUrl && (
          <Box
            sx={{
              width: "100%",
              maxHeight: "75vh",
              overflow: "hidden",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              bgcolor: "#fff",
              p: 2,
            }}
          >
            <video
              src={videoUrl}
              controls
              autoPlay
              controlsList="nodownload"
              onContextMenu={(e) => e.preventDefault()}
              style={{
                width: "90%",
                maxWidth: "900px",
                maxHeight: "70vh",
                borderRadius: 10,
                boxShadow: "0 3px 10px rgba(0,0,0,0.15)",
              }}
            />
          </Box>
        )}
      </DialogContent>
    </>
  );
}
