import { useEffect, useState } from "react";
import { Box, Fab, Zoom, Typography } from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

const ScrollToTopButton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <Zoom in={visible}>
      <Box
        onClick={scrollToTop}
        sx={{
          position: "fixed",
          bottom: { xs: 60, sm: 70 },
          right: { xs: 16, sm: 24 },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          cursor: "pointer",
          zIndex: 2000,
        }}
      >
        {/* Small text */}
        <Typography
          sx={{
            fontSize: "10px",
            mb: 0.5,
            color: "#ffffff",
            background: "#ff4081",
            px: 0.8,
            py: 0.2,
            borderRadius: "6px",
            boxShadow: "0 0 8px rgba(255, 64, 129, 0.5)",
            fontWeight: 600,
          }}
        >
          Go Top
        </Typography>

        {/* Floating Button */}
        <Fab
          size="small" // changed from "medium" to "small"
          sx={{
            bgcolor: "#ff4081",
            color: "white",
            boxShadow: "0 4px 12px rgba(255,64,129,0.4)",
            border: "2px solid white",
            "&:hover": {
              bgcolor: "#ff5c98",
              boxShadow: "0 6px 18px rgba(255,64,129,0.6)",
              transform: "translateY(-2px)",
            },
            transition: "all 0.3s ease",
          }}
        >
          <KeyboardArrowUpIcon sx={{ fontSize: 20 }} /> {/* smaller icon */}
        </Fab>
      </Box>
    </Zoom>
  );
};

export default ScrollToTopButton;
