import { Box, Paper, Typography } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

const AddMoreCourseCard = ({ title, onClick }) => {
  return (
    <Paper
      elevation={3}
      onClick={onClick}
      sx={{
        width: {
          xs: 120,
          sm: 150,
          md: 160,
        },
        height: {
          xs: 140,
          sm: 170,
          md: 180,
        },
        border: "dashed",
        borderRadius: 3,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transition: "0.3s ease",
        color: "#555",
        "&:hover": {
          transform: "scale(1.05)",
          boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
        },
      }}
    >
      <Box
        sx={{
          transition: "transform 0.3s ease",
          "&:hover": {
            transform: "scale(1.15)",
            bgcolor: "white",
          },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <AddCircleOutlineIcon
          sx={{
            fontSize: { xs: 30, sm: 38, md: 42 },
            color: "#1976d2",
          }}
        />

        <Typography
          sx={{
            fontWeight: 600,
            fontSize: {
              xs: "0.55rem",
              sm: "0.85rem",
              md: "0.9rem",
            },
            transition: "0.3s ease",
            color: "#1976d2",
          }}
        >
          {title}
        </Typography>
      </Box>
    </Paper>
  );
};

export default AddMoreCourseCard;
