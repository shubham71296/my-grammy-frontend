import { Box, CircularProgress } from "@mui/material";

const PageSpinner = () => {
  return (
    <Box
      sx={{
        height: "70vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CircularProgress size={45} />
    </Box>
  );
};

export default PageSpinner;
