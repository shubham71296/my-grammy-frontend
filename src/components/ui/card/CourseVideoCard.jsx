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
        width: {
          xs: 140,   
          sm: 160,   
          md: 180,   
        },
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
          height: {
            xs: 120,   
            sm: 150,   
            md: 180,   
          },
          backgroundColor:'black'
        }}
      >
       
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
            "&:hover": {
              bgcolor: "rgba(107, 171, 240, 0.4)", 
            },
          }}
        >
          <IconButton
            sx={{
              bgcolor: "white",
              width: { xs: 44, sm: 55, md: 60 },
              height: { xs: 44, sm: 55, md: 60 },
              borderRadius: "50%",
              transition: "transform 0.3s ease", 
              "&:hover": {
                transform: "scale(1.15)", 
                bgcolor: "white", 
              },
            }}
            onClick={() => openFullScreen(lec)}
          >
            <VideoLibrary fontSize="large" sx={{ fontSize: { xs: 28, sm: 34, md: 40 } }}/>
          </IconButton>
        </Box>
      </Box>

      <Box
        mt={1}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          mt={1}
          fontWeight={700}
          sx={{
           fontSize: {
              xs: "0.70rem",
              sm: "0.80rem",
              md: "0.85rem",
            },
            mr: 1,
          }}
        >
          {idx + 1}. {lec.lecture_title}
        </Typography>
        <IconButton
          onClick={handleMenuOpen}
          size="small"
          sx={{
            width: { xs: 24, sm: 28 },
            height: { xs: 24, sm: 28 },
            bgcolor: "#f1f1f1",
            "&:hover": {
              bgcolor: "#e0e0e0",
            },
          }}
        >
          <MoreVert fontSize="small" sx={{ fontSize: { xs: 18, sm: 20 } }} />
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
