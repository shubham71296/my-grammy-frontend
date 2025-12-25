import React from "react";
import { Box } from "@mui/material";

function DynamicAmount({ val }) {
  
  return (
    <Box
      sx={{
        fontWeight: 600,
        fontSize: "0.95rem",
        color: "#0f766e",
        backgroundColor: "rgba(16, 185, 129, 0.12)",
        padding: "4px 10px",
        borderRadius: "6px",
        display: "inline-block",
      }}
    >
     ₹ {val}
    </Box>
  );
}

export default DynamicAmount;
