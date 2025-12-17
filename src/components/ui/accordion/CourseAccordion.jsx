import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Avatar,
  Box,
  Typography,
} from "@mui/material";
import {
  ArrowDownward,
  ArrowDownwardOutlined,
  ArrowDropUpOutlined,
} from "@mui/icons-material";

export default function CourseAccordion({ title, children }) {
  return (
    <Accordion
      sx={{
        mb: 1,
        borderRadius: 2,
        overflow: "hidden",
        transition: "transform 0.25s ease, box-shadow 0.25s ease",
        transformOrigin: "center",
        "&:hover": {
          transform: "scale(1.01)", // slight pop-out zoom
        },
      }}
    >
      <AccordionSummary
        expandIcon={<ArrowDownwardOutlined />}
        aria-controls="panel-content"
        id="panel-header"
        sx={{
          bgcolor: "#f7f9fc",
          "& .MuiAccordionSummary-content": {
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          },
        }}
      >
        {/* Avatar Icon */}
        <Avatar
          sx={{
            bgcolor: "#1976d2",
            width: 32,
            height: 32,
            fontSize: 16,
            fontWeight: 600,
          }}
        >
          {title ? title.charAt(0).toUpperCase() : "C"}
        </Avatar>

        {/* Title */}
        <Typography sx={{ fontWeight: 600, fontSize: "1rem" }}>
          {title}
        </Typography>
      </AccordionSummary>

      <AccordionDetails
        sx={{
          bgcolor: "#fff",
          borderTop: "1px solid #e0e0e0",
          //margin:"10px"
        }}
      >
        {children}
      </AccordionDetails>
    </Accordion>
  );
}
