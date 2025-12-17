// LectureCard.jsx
import React from "react";
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from "@mui/material";
import {
  VideoLibrary,
  MoreVert,
  Edit,
  Delete,
  Close,
} from "@mui/icons-material";

const CourseVideoCard = ({ lec, idx, openFullScreen, onEdit, onDelete }) => {
  const vidUrl = lec?.lecture_video?.[0]?.url || "";

  const [anchorEl, setAnchorEl] = React.useState(null);
  const menuOpen = Boolean(anchorEl);

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleEdit = () => {
    handleMenuClose();
    if (onEdit) onEdit(lec);
  };

  const handleDelete = () => {
    handleMenuClose();
    if (onDelete) onDelete(lec);
  };

  return (
    <Paper
      elevation={4}
      sx={{
        p: 1,
        borderRadius: 1,
        width: "180px",
        transition: "all 0.35s ease",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: "0 16px 32px rgba(0,0,0,0.25)",
        },
      }}
    >
      <Box
        sx={{
          position: "relative",
          borderRadius: 2,
          overflow: "hidden",
          boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
          height: "180px",
          backgroundColor:'black'
          //width: "165px", // SMALL PREVIEW HEIGHT
        }}
      >
        {/* <video
          src={vidUrl}
          muted
          controls
          preload="metadata"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
          onLoadedMetadata={(e) => (e.target.currentTime = 0.1)} // freeze first frame
        /> */}

        <Box
          sx={{
            position: "absolute",
            inset: 0,
            bgcolor: "rgba(0,0,0,0.4)",
            opacity: 1,
            transition: "0.3s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            //pointerEvents: "none",          // allow hover to pass through
            "&:hover": {
              bgcolor: "rgba(107, 171, 240, 0.4)", // hover effect works!
            },
          }}
        >
          <IconButton
            sx={{
              bgcolor: "white",
              width: 60,
              height: 60,
              borderRadius: "50%",
              transition: "transform 0.3s ease", // smooth zoom
              "&:hover": {
                transform: "scale(1.15)", // zoom effect on hover
                bgcolor: "white", // prevent dimming
              },
            }}
            onClick={() => openFullScreen(lec)}
          >
            <VideoLibrary fontSize="large" />
          </IconButton>
        </Box>
      </Box>

      <Box
        mt={1}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          //width: "180px",
        }}
      >
        <Typography
          mt={1}
          fontWeight={700}
          sx={{
            //flexGrow: 1,
            fontSize: 12,
            mr: 1,
          }}
        >
          {idx + 1}. {lec.lecture_title}
        </Typography>
        <IconButton
          onClick={handleMenuOpen}
          size="small"
          sx={{
            bgcolor: "#f1f1f1",
            "&:hover": {
              bgcolor: "#e0e0e0",
            },
          }}
        >
          <MoreVert fontSize="small" />
        </IconButton>

        <Menu
          id={`lec-menu-${idx}`}
          anchorEl={anchorEl}
          open={menuOpen}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          PaperProps={{
            sx: { minWidth: 150, p: 0 },
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              px: 1,
              py: 0.5,
              //bgcolor: "rgba(0,0,0,0.04)",
              borderBottom: "1px solid rgba(0,0,0,0.08)",
              borderTopLeftRadius: "8px",
              borderTopRightRadius: "8px",
            }}
          >
            <IconButton
              size="small"
              onClick={handleMenuClose}
              sx={{
                color: "#555555ff",
                transition: "0.25s ease",
                "&:hover": {
                  color: "#2f71d3ff",
                  transform: "scale(1.15)",
                  backgroundColor: "rgba(211,47,47,0.08)",
                },
              }}
            >
              <Close fontSize="small" />
            </IconButton>
          </Box>

          <MenuItem onClick={handleEdit}>
            <ListItemIcon>
              <Edit fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Edit" />
          </MenuItem>

          <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
            <ListItemIcon>
              <Delete fontSize="small" sx={{ color: "error.main" }} />
            </ListItemIcon>
            <ListItemText primary="Delete" />
          </MenuItem>
        </Menu>
      </Box>
    </Paper>
  );
};

export default CourseVideoCard;
