// import {
//   Box,
//   Button,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Typography,
//   IconButton,
// } from "@mui/material";
// import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
// import LockRoundedIcon from "@mui/icons-material/LockRounded";
// import { closeDialog } from "../../../features/ui/uiSlice";
// import { useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";

// export default function LoginRequiredDialog() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const handleClose = () => dispatch(closeDialog());

//   return (
//     <>
//       <DialogTitle
//         sx={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           p: 2,
//         }}
//       >
//         <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
//           <Box
//             sx={{
//               width: 38,
//               height: 38,
//               borderRadius: "50%",
//               background: "linear-gradient(135deg, #7dd3fc, #2563eb)",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               color: "white",
//             }}
//           >
//             <LockRoundedIcon />
//           </Box>

//           <Typography
//             variant="h6"
//             sx={{
//               fontWeight: 700,
//               fontSize: { xs: "1rem", sm: "1.2rem" },
//             }}
//           >
//             Login Required
//           </Typography>
//         </Box>

//         <IconButton onClick={handleClose}>
//           <CloseRoundedIcon />
//         </IconButton>
//       </DialogTitle>

//       <DialogContent
//         sx={{
//           textAlign: "center",
//           py: 3,
//           px: { xs: 1, sm: 3 },
//         }}
//       >

//         <Typography
//           sx={{
//             fontSize: { xs: "0.85rem", sm: "1rem" },
//             color: "text.secondary",
//             lineHeight: 1.5,
//           }}
//         >
//           You must be logged in to perform this action
//         </Typography>

//         <Typography
//           sx={{
//             mt: 1,
//             fontSize: { xs: "0.9rem", sm: "1rem" },
//             fontWeight: 600,
//           }}
//         >
//           Please login to continue.
//         </Typography>
//       </DialogContent>

//       <DialogActions
//         sx={{
//           px: 3,
//           pb: 3,
//           display: "flex",
//           flexDirection: { xs: "column", sm: "row" },
//           gap: 1.5,
//           "& > :not(style) ~ :not(style)": {
//             marginLeft: 0,
//           },
//         }}
//       >
//         <Button
//           fullWidth
//           variant="outlined"
//           onClick={handleClose}
//           sx={{
//             textTransform: "none",
//             borderRadius: 2,
//             transition: "0.25s ease",
//             "&:hover": {
//               borderColor: "#6366f1",
//               backgroundColor: "rgba(99,102,241,0.08)",
//               transform: "scale(1.02)",
//             },
//           }}
//         >
//           Cancel
//         </Button>

//         <Button
//           fullWidth
//           variant="contained"
//           sx={{
//             textTransform: "none",
//             borderRadius: 2,
//             background: "linear-gradient(135deg, #6366f1, #4338ca)",
//             transition: "0.3s ease",
//             "&:hover": {
//               background: "linear-gradient(135deg, #6171fbff, #4f46e5)",
//               transform: "translateY(-2px)",
//             },
//           }}
//           onClick={() => {
//             dispatch(closeDialog());
//             navigate("/login");
//           }}
//         >
//           Login Now
//         </Button>
//       </DialogActions>
//     </>
//   );
// }


import {
  Box,
  Button,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  IconButton,
  Divider,
  Stack,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import { closeDialog } from "../../../features/ui/uiSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function LoginRequiredDialog() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClose = () => dispatch(closeDialog());

  return (
    <>
      {/* TITLE */}
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          {/* ICON WRAPPER */}
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
            <LockRoundedIcon
              sx={{ fontSize: { xs: 16, sm: 18, md: 20 } }}
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
            Login Required
          </Typography>
        </Box>

        <IconButton onClick={handleClose}>
          <CloseRoundedIcon />
        </IconButton>
      </DialogTitle>

      <Divider />

      {/* CONTENT */}
      <DialogContent>
        <Stack direction="row" spacing={2} alignItems="center">
          <Box
            sx={{
              bgcolor: "primary.main",
              color: "#fff",
              p: 1.2,
              borderRadius: 1,
            }}
          >
            <LockRoundedIcon />
          </Box>

          <Box>
            <Typography
              fontWeight={700}
              sx={{
                fontSize: {
                  xs: "0.9rem",
                  sm: "1.05rem",
                  md: "1.25rem",
                },
              }}
            >
              You must be logged in to continue.
            </Typography>

            <Typography
              sx={{
                mt: 1,
                fontSize: {
                  xs: "0.85rem",
                  sm: "0.95rem",
                  md: "1.1rem",
                },
                color: "text.secondary",
              }}
            >
              Please login to access this feature.
            </Typography>
          </Box>
        </Stack>
      </DialogContent>

      <Divider />

      {/* ACTION BUTTONS */}
      <DialogActions
        sx={{
          p: 2,
          display: "flex",
          gap: 1.5,
          flexDirection: { xs: "column-reverse", sm: "row" },
          "& > :not(style) ~ :not(style)": {
            marginLeft: 0,
          },
        }}
      >
        {/* CANCEL BUTTON */}
        <Button
          fullWidth
          onClick={handleClose}
          variant="outlined"
          sx={{
            flex: 1,
            borderRadius: 2,
            textTransform: "none",
            fontSize: { xs: "0.75rem", sm: "0.85rem", md: "0.95rem" },
            transition: "0.3s",
            "&:hover": {
              transform: "scale(1.03)",
              boxShadow: "0px 4px 12px rgba(0,0,0,0.15)",
            },
          }}
        >
          Cancel
        </Button>

        {/* LOGIN BUTTON */}
        <Button
          fullWidth
          variant="contained"
          sx={{
            flex: 1,
            borderRadius: 2,
            textTransform: "none",
            fontSize: { xs: "0.75rem", sm: "0.85rem", md: "0.95rem" },
            transition: "0.3s",
            backgroundColor: "primary.main",
            "&:hover": {
              backgroundColor: "primary.dark",
              transform: "scale(1.03)",
              boxShadow: "0px 4px 14px rgba(0,0,0,0.18)",
            },
          }}
          onClick={() => {
            dispatch(closeDialog());
            navigate("/login");
          }}
        >
          Login Now
        </Button>
      </DialogActions>
    </>
  );
}
