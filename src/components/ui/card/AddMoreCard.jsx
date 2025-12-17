import { Box, Paper, Typography } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

const AddMoreCourseCard = ({ title, onClick }) => {
  return (
    <Paper
      elevation={3}
      onClick={onClick}
      sx={{
        width: 160,
        height: 180,
        border:"dashed",
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
          transition: "transform 0.3s ease", // smooth zoom
            "&:hover": {
             transform: "scale(1.15)", // zoom effect on hover
             bgcolor: "white", // prevent dimming
            },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <AddCircleOutlineIcon
          sx={{
            fontSize: 36,
            color: "#1976d2",
          }}
        />

        <Typography
          //mt={1}
          sx={{
            fontWeight: 600,
            fontSize: 12,
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
