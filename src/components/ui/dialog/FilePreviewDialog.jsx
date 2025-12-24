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

export default function FilePreviewDialog() {
  const dispatch = useDispatch();
  const { selectedData, dialogInfo } = useSelector((state) => state.ui.dialog);
  const previewURL = selectedData.previewUrl;
  const previewTitle = selectedData.title;

  const handleClose = () => dispatch(closeDialog());

  if (dialogInfo?.check === "view_img_video") {
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
        <DialogContent
          sx={{
            p: { xs: 2, md: 3 },
            bgcolor: "#fff",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
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
            <img
              src={previewURL}
              alt="Preview"
              style={{
                width: "100%",
                maxHeight: "70vh",
                objectFit: "contain",
                borderRadius: "10px",
                boxShadow: "0 3px 10px rgba(0,0,0,0.15)",
              }}
            />
          </Box>
        </DialogContent>
      </>
    );
  }

  return null;
}
