import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  VideoLibrary,
  MoreVert,
  Edit,
  Delete,
  Close,
  CheckCircle,
} from "@mui/icons-material";
import PlayCircleFilledWhiteIcon from "@mui/icons-material/PlayCircleFilledWhite";
import { useNavigate } from "react-router-dom";
import { truncate } from "../../../utils/common-util";

export default function CourseCard({
  type,
  course,
  idx,
  onEdit,
  onDelete,
  onAddToCart,
}) {
  const navigate = useNavigate();
  const videoCount = course.course_video?.length || 0;

  const [anchorEl, setAnchorEl] = React.useState(null);
  const menuOpen = Boolean(anchorEl);

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleEdit = () => {
    handleMenuClose();
    if (onEdit) onEdit(course);
  };

  const handleDelete = () => {
    handleMenuClose();
    if (onDelete) onDelete(course);
  };

  return (
    <Card
      sx={{
        marginTop: 1,
        width: 220,
        borderRadius: 2,
        overflow: "hidden",
        background: "rgba(255,255,255,0.9)",
        backdropFilter: "blur(8px)",
        boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
        transition: "all 0.35s ease",
        cursor: "pointer",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 16px 32px rgba(0,0,0,0.25)",
        },
      }}
    >
      {/* Image Wrapper */}
      <Box sx={{ position: "relative" }}>
        <CardMedia
          component="img"
          height="130"
          image={course.thumbnail_image?.[0]?.url}
          alt={course.course_title}
          sx={{
            objectFit: "cover",
            transition: "0.3s ease",
            "&:hover": { filter: "brightness(85%)" },
          }}
        />

        {/* Play Icon */}
        <PlayCircleFilledWhiteIcon
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: 42,
            color: "white",
            opacity: 0.85,
          }}
        />

        {/* Video Count Badge */}
        <Box
          sx={{
            position: "absolute",
            top: 8,
            right: 40,
            background: "rgba(0,0,0,0.6)",
            color: "#fff",
            px: 1,
            py: "2px",
            fontSize: "0.75rem",
            borderRadius: "20px",
            backdropFilter: "blur(3px)",
          }}
        >
          🎬 {videoCount} Videos
        </Box>

        {/* Gradient Overlay */}
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: "55px",
            background:
              "linear-gradient(to top, rgba(0,0,0,0.65), rgba(0,0,0,0))",
          }}
        />

        {/* Title */}
        <Typography
          variant="subtitle1"
          sx={{
            position: "absolute",
            bottom: 10,
            left: 14,
            color: "white",
            fontWeight: 700,
            fontSize: "1rem",
            textShadow: "0px 2px 6px rgba(0,0,0,0.5)",
          }}
        >
          {course.course_title}
        </Typography>
      </Box>

      {/* Content */}
      <CardContent sx={{}}>
        {type === "admin" ? (
          <IconButton
            onClick={handleMenuOpen}
            size="small"
            sx={{
              position: "absolute",
              top: 4,
              right: 4,
              bgcolor: "#f1f1f1",
              boxShadow: "0px 2px 6px rgba(0,0,0,0.15)",
              "&:hover": {
                bgcolor: "#e0e0e0",
              },
            }}
          >
            <MoreVert fontSize="small" />
          </IconButton>
        ) : null}

        {/* Description */}
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            minHeight: 30,
            //mb: 1,
            fontSize: "0.82rem",
            //lineHeight: 1.35,
          }}
        >
          {/* {course.course_description.substring(0, 59) + "..."} */}
          {truncate(course.course_description, 55)}
        </Typography>

        {/* Price + Instrument */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1,
            mt: 1,
          }}
        >
          <Chip
            label={course.isPurchased && type === "user" ? "FREE" : `${course.course_price} ₹`}
            //label={`${course.course_price}  ₹`}
            size="small"
            sx={{
              fontWeight: 800,
              borderRadius: 2,
              // background: "#fde6e3ff",
              // color: "#a51106ff",
              background: course.isPurchased ? "#e6f4ea" : "#fde6e3ff",
              color: course.isPurchased && type === "user" ? "#1e7e34" : "#a51106ff",
            }}
          />
        </Box>

        {/* Buttons */}
        <Box
          sx={{
            display: "flex",
            gap: 1,
            //mt: 1,
          }}
        >
          {/* View Details Button */}
          <Button
            variant="outlined"
            size="small"
            sx={{
              textTransform: "none",
              borderRadius: "6px",
              borderColor: "#1e88e5",
              color: "#1e88e5",
              fontWeight: 700,
              px: 1.6,
              py: 0.3,
              fontSize: "0.58rem",
              backdropFilter: "blur(4px)",
              transition: "0.25s ease",
              "&:hover": {
                background: "linear-gradient(135deg, #2196f3, #1e88e5)",
                borderColor: "transparent",
                color: "#fff",
                boxShadow: "0 4px 12px rgba(30,136,229,0.4)",
                transform: "translateY(-2px)",
              },
            }}
            //onClick={() => type==="admin" ? navigate(`/admin/mycoursedetail/${course._id}`) : navigate("")}
            onClick={() =>
              type === "admin"
                ? navigate(`/admin/mycoursedetail/${course._id}`)
                : navigate(`/user/courses/${course._id}`)
            }
          >
            View Details
          </Button>

          {/* Buy Course Button */}

          {/* {type === "admin" ? null : course.isPurchased ? (
             <Button
              variant="contained"
              size="small"
              disabled
              sx={{
                textTransform: "none",
                borderRadius: "6px",
                background: "linear-gradient(135deg, #1e88e5, #4d81bdff)",
                fontWeight: 700,
                px: 1.6,
                py: 0.3,
                fontSize: "0.58rem",
                boxShadow: "0 4px 10px rgba(21,101,192,0.35)",
                transition: "0.25s ease",
                "&:hover": {
                  background: "linear-gradient(135deg, #0d47a1, #1976d2)",
                  boxShadow: "0 5px 16px rgba(13,71,161,0.5)",
                  transform: "translateY(-2px)",
                },
              }}
            >
              ✔ Purchased
            </Button>
          ) : (
            <Button
              variant="contained"
              size="small"
              sx={{
                textTransform: "none",
                borderRadius: "6px",
                background: "linear-gradient(135deg, #1e88e5, #4d81bdff)",
                fontWeight: 700,
                px: 1.6,
                py: 0.3,
                fontSize: "0.58rem",
                boxShadow: "0 4px 10px rgba(21,101,192,0.35)",
                transition: "0.25s ease",
                "&:hover": {
                  background: "linear-gradient(135deg, #0d47a1, #1976d2)",
                  boxShadow: "0 5px 16px rgba(13,71,161,0.5)",
                  transform: "translateY(-2px)",
                },
              }}
              onClick={() => onAddToCart?.()}
              //onClick={() => navigate(`/buy/${course._id}`)}
            >
              Add to cart
            </Button>
          )} */}
          {type !== "admin" &&
            (course.isPurchased ? (
              <Chip
                //icon={<CheckCircle sx={{ color: "#1b5e20" }} />}
                label="Purchased"
                size="small"
                sx={{
                  height: 26,
                  fontSize: "0.62rem",
                  fontWeight: 800,
                  borderRadius: "14px",
                  px: 0.5,
                  color: "#1b5e20",
                  background: "linear-gradient(135deg, #c8e6c9, #a5d6a7)",
                  boxShadow: "0 3px 8px rgba(46,125,50,0.35)",
                  border: "1px solid #81c784",
                  "& .MuiChip-icon": {
                    fontSize: "0.9rem",
                  },
                }}
              />
            ) : (
              <Button
                variant="contained"
                size="small"
                sx={{
                  textTransform: "none",
                  borderRadius: "6px",
                  background: "linear-gradient(135deg, #1e88e5, #4d81bdff)",
                  fontWeight: 700,
                  px: 1.6,
                  py: 0.3,
                  fontSize: "0.58rem",
                  boxShadow: "0 4px 10px rgba(21,101,192,0.35)",
                  transition: "0.25s ease",
                  "&:hover": {
                    background: "linear-gradient(135deg, #0d47a1, #1976d2)",
                    boxShadow: "0 5px 16px rgba(13,71,161,0.5)",
                    transform: "translateY(-2px)",
                  },
                }}
                onClick={() => onAddToCart?.()}
                //onClick={() => navigate(`/buy/${course._id}`)}
              >
                Add to cart
              </Button>
            ))}
        </Box>

        <Menu
          id={`course-menu-${idx}`}
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
      </CardContent>
    </Card>
  );
}
