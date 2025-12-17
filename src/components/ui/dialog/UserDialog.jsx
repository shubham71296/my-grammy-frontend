import React, { useMemo, useState } from "react";
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

  /* ✅ FIX: formattedDate */
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
      // const response = await axios.delete(`/api/admin/deleteuser/${user._id}`);
      const response = await api.delete(`/admin/deleteuser/${user._id}`);
      dispatch(closeDialog());
      toast.success(response.data.msg);
    //   navigate("/admin/myinstrumentslist");
      return response;
    } catch (err) {
      console.log("error", err);
      const errorMsg = err?.response?.data?.msg || "Something went wrong!";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  /* ===================== VIEW USER ===================== */
//   if (dialogInfo?.check === "view_user") {
//     return (
//       <>
//         <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
//           <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
//             <Box
//               sx={{
//                 width: 36,
//                 height: 36,
//                 borderRadius: "50%",
//                 bgcolor: "primary.main",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 color: "#fff",
//               }}
//             >
//               <Visibility fontSize="small" />
//             </Box>
//             <Typography fontWeight={700}>View User</Typography>
//           </Box>
//           <IconButton onClick={handleClose}>
//             <CloseRounded />
//           </IconButton>
//         </DialogTitle>

//         <Divider />

//         <DialogContent>
//           <Stack spacing={2} alignItems="center">
//             <Avatar sx={{ width: 72, height: 72 }}>
//               {fullName?.charAt(0)?.toUpperCase() || "U"}
//             </Avatar>

//             <Box width="100%">
//               <Info label="Name" value={fullName} />
//               <Info label="Email" value={user.em} />
//               <Info label="Phone" value={user.phone_number} />
//               <Info label="Role" value={user.role} />
//               <Info label="Address" value={user.address} />
//               <Info label="Created At" value={formattedDate} />
//             </Box>
//           </Stack>
//         </DialogContent>

//         <DialogActions>
//           <Button variant="outlined" onClick={handleClose}>
//             Close
//           </Button>
//         </DialogActions>
//       </>
//     );
//   }
  
 /* ===================== VIEW USER ===================== */
if (dialogInfo?.check === "view_user") {
  return (
    <>
      {/* ===== Header ===== */}
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: "50%",
              bgcolor: "primary.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
            }}
          >
            <Visibility fontSize="small" />
          </Box>
          <Typography fontWeight={700} variant="h6">
            User Details
          </Typography>
        </Box>
        <IconButton onClick={handleClose}>
          <CloseRounded />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ backgroundColor: "#f5f7fb" }}>
        <Stack spacing={3}>
          {/* ===== Profile Card ===== */}
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
                width: 90,
                height: 90,
                mx: "auto",
                mb: 1.5,
                bgcolor: "primary.main",
                fontSize: "2rem",
                fontWeight: 700,
              }}
            >
              {fullName?.charAt(0)?.toUpperCase() || "U"}
            </Avatar>

            <Typography variant="h6" fontWeight={700}>
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
              }}
            >
              {user.role?.toUpperCase()}
            </Typography>
          </Paper>

          {/* ===== Details Card ===== */}
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


  /* ===================== DELETE USER ===================== */
  if (dialogInfo?.check === "delete_user") {
    return (
      <>
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                bgcolor: "error.main",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
              }}
            >
              <Delete fontSize="small" />
            </Box>
            <Typography fontWeight={700}>
              Delete User - {fullName}
            </Typography>
          </Box>
          <IconButton onClick={handleClose}>
            <CloseRounded />
          </IconButton>
        </DialogTitle>

        <Divider />

        <DialogContent>
          <Stack direction="row" spacing={2}>
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
              <Typography fontWeight={700}>
                Are you sure you want to delete this user?
              </Typography>
              <DialogContentText sx={{ mt: 1 }}>
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
            startIcon={
                loading ? <CircularProgress size={20} /> : <Delete />
            }
            sx={{
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

/* ===================== Helper ===================== */
const Info = ({ label, value }) => (
  <Box sx={{ mb: 1 }}>
    <Typography variant="caption" color="text.secondary" fontWeight={800}>
      {label}
    </Typography>
    <Typography variant="body1">
      {value || "—"}
    </Typography>
  </Box>
);
