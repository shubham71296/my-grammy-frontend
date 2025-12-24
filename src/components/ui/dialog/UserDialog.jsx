import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Box,
  Stack,
  Typography,
  IconButton,
  Button,
  Avatar,
  CircularProgress,
  DialogContentText,
  Paper,
} from "@mui/material";
import {
  CloseRounded,
  Visibility,
  Delete,
  DeleteOutlineRounded,
} from "@mui/icons-material";
import { closeDialog } from "../../../features/ui/uiSlice";
import axios from "axios";
import toast from "react-hot-toast";
import api from "../../../api/axios";

export default function UserDialog() {
  const dispatch = useDispatch();
  const { selectedData, dialogInfo } = useSelector((state) => state.ui.dialog);
  const [loading, setLoading] = useState(false);

  const user = selectedData || {};

  const handleClose = () => dispatch(closeDialog());

  const formattedDate = useMemo(() => {
    if (!user.createdAt) return "—";
    return new Date(user.createdAt).toLocaleString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }, [user.createdAt]);

  const fullName = `${user.first_name || ""} ${user.last_name || ""}`.trim();

  const handleDelete = async () => {
    if (loading) return;
    try {
      setLoading(true);
      const response = await api.delete(`/admin/deleteuser/${user._id}`);
      dispatch(closeDialog());
      toast.success(response.data.msg);
      return response;
    } catch (err) {
      console.log("error", err);
      const errorMsg = err?.response?.data?.msg || "Something went wrong!";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (loading) {
      window.dispatchEvent(new CustomEvent("dialogLoading", { detail: true }));
    } else {
      window.dispatchEvent(new CustomEvent("dialogLoading", { detail: false }));
    }
  }, [loading]);

  if (dialogInfo?.check === "view_user") {
    return (
      <>
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                width: { xs: 28, sm: 34, md: 36 },
                height: { xs: 28, sm: 34, md: 36 },
                borderRadius: "50%",
                bgcolor: "primary.main",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
              }}
            >
              <Visibility
                sx={{
                  fontSize: { xs: 16, sm: 18, md: 20 },
                }}
              />
            </Box>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: {
                  xs: "0.95rem",
                  sm: "1.1rem",
                  md: "1.25rem",
                },
              }}
              variant="h6"
            >
              User Details
            </Typography>
          </Box>
          <IconButton onClick={handleClose}>
            <CloseRounded />
          </IconButton>
        </DialogTitle>

        <Divider />

        <DialogContent dividers sx={{ p: { xs: 2, md: 3 } }}>
          <Stack spacing={3}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                borderRadius: 3,
                textAlign: "center",
              }}
            >
              <Avatar
                sx={{
                  width: { xs: 70, sm: 90 },
                  height: { xs: 70, sm: 90 },
                  mx: "auto",
                  mb: 1.5,
                  bgcolor: "primary.main",
                  fontSize: { xs: "1.5rem", sm: "2rem" },
                  fontWeight: 700,
                }}
              >
                {fullName?.charAt(0)?.toUpperCase() || "U"}
              </Avatar>

              <Typography
                variant="h6"
                fontWeight={700}
                sx={{
                  fontSize: { xs: "1rem", sm: "1.15rem", md: "1.25rem" },
                }}
              >
                {fullName}
              </Typography>

              <Typography
                variant="caption"
                sx={{
                  px: 2,
                  py: 0.5,
                  mt: 1,
                  display: "inline-block",
                  borderRadius: 2,
                  backgroundColor: "#e3f2fd",
                  color: "primary.main",
                  fontWeight: 600,
                  fontSize: { xs: "0.7rem", sm: "0.75rem", md: "0.8rem" },
                }}
              >
                {user.role?.toUpperCase()}
              </Typography>
            </Paper>

            <Paper
              elevation={2}
              sx={{
                p: 3,
                borderRadius: 3,
              }}
            >
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: 2,
                }}
              >
                <Info label="Email" value={user.em} />
                <Info label="Phone" value={user.phone_number} />
                <Info label="Address" value={user.address} />
                <Info label="Created At" value={formattedDate} />
              </Box>
            </Paper>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button variant="outlined" onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </>
    );
  }

  if (dialogInfo?.check === "delete_user") {
    return (
      <>
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                width: { xs: 28, sm: 34, md: 36 },
                height: { xs: 28, sm: 34, md: 36 },
                borderRadius: "50%",
                bgcolor: "error.main",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
              }}
            >
              <Delete
                sx={{
                  fontSize: { xs: 16, sm: 18, md: 20 },
                }}
              />
            </Box>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: {
                  xs: "0.9rem",
                  sm: "1.05rem",
                  md: "1.25rem",
                },
              }}
            >
              Delete User - {fullName}
            </Typography>
          </Box>
          <IconButton onClick={handleClose}>
            <CloseRounded />
          </IconButton>
        </DialogTitle>

        <Divider />

        <DialogContent>
          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              sx={{
                bgcolor: "error.main",
                color: "#fff",
                p: 1.2,
                borderRadius: 1,
              }}
            >
              <DeleteOutlineRounded />
            </Box>
            <Box>
              <Typography
                fontWeight={700}
                sx={{
                  fontWeight: 700,
                  fontSize: {
                    xs: "0.9rem",
                    sm: "1.05rem",
                    md: "1.25rem",
                  },
                }}
              >
                Are you sure you want to delete this user?
              </Typography>
              <DialogContentText
                sx={{
                  mt: 1,
                  fontSize: {
                    xs: "0.9rem",
                    sm: "1.05rem",
                    md: "1.25rem",
                  },
                }}
              >
                This action cannot be undone.
              </DialogContentText>
            </Box>
          </Stack>
        </DialogContent>

        <Divider />

        <DialogActions>
          <Button
            variant="contained"
            color="error"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <Delete />}
            sx={{
              fontSize: { xs: "0.75rem", sm: "0.85rem", md: "0.95rem" },
              transition: "0.3s",
              backgroundColor: "#f71d49ff",
              "&:hover": {
                backgroundColor: "#a10d28ff",
                transform: loading ? "none" : "scale(1.03)",
                boxShadow: loading ? "none" : "0px 4px 12px rgba(0, 0, 0, 0.2)",
                opacity: loading ? 0.8 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              },
            }}
            onClick={handleDelete}
          >
            {loading ? "Deleting..." : "Delete Permanently"}
          </Button>
          <Button
            onClick={handleClose}
            variant="outlined"
            disabled={loading}
            sx={{
              fontSize: { xs: "0.75rem", sm: "0.85rem", md: "0.95rem" },
              transition: "0.3s",
              "&:hover": {
                transform: loading ? "none" : "scale(1.03)",
                boxShadow: loading ? "none" : "0px 4px 12px rgba(0,0,0,0.2)",
                opacity: loading ? 0.8 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              },
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </>
    );
  }

  return null;
}

const Info = ({ label, value }) => (
  <Box sx={{ mb: 1 }}>
    <Typography
      variant="caption"
      color="text.secondary"
      fontWeight={800}
      sx={{
        fontSize: {
          xs: "0.7rem",
          sm: "0.75rem",
          md: "0.8rem",
        },
      }}
    >
      {label}
    </Typography>
    <Typography
      variant="body1"
      sx={{
        fontSize: {
          xs: "0.75rem",
          sm: "0.95rem",
          md: "1rem",
        },
        fontWeight: 500,
        mt: 0.3,
      }}
    >
      {value || "—"}
    </Typography>
  </Box>
);
