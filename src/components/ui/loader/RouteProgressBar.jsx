import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { useLocation } from "react-router-dom";

const RouteProgressBar = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Start loading when route changes
    setLoading(true);

    // Stop after small delay
    const timer = setTimeout(() => setLoading(false), 400);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return loading ? (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "3px",
        width: "100%",
        zIndex: 9999,
        background: "linear-gradient(90deg, #1976d2, #42a5f5)",
        animation: "progressAnim 1s infinite",
        "@keyframes progressAnim": {
          "0%": { width: "0%" },
          "100%": { width: "100%" },
        },
      }}
    />
  ) : null;
};

export default RouteProgressBar;
