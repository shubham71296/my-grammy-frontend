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
          console.log("url",url)
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
            <Visibility sx={{
                  fontSize: { xs: 16, sm: 18, md: 20 },
                }} />
          </Box>

          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: {
                  xs: "0.95rem", 
                  sm: "1.1rem", 
                  md: "1.25rem", 
                }, }}>
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
      <DialogContent
       dividers 
       sx={{ p: { xs: 2, md: 3 } }}
      >
        {loading && (
          <Stack alignItems="center" gap={2} py={5}>
            <CircularProgress />
            <Typography color="text.secondary">
              Loading video…
            </Typography>
          </Stack>
        )}

        {!loading && errorMsg && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
          <Paper
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

