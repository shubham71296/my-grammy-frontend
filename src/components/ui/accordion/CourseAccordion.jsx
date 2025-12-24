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
          transform: "scale(1.01)",
        },
      }}
    >
      <AccordionSummary
        expandIcon={
          <ArrowDownwardOutlined
            sx={{
              fontSize: { xs: 18, sm: 22, md: 24 },
            }}
          />
        }
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
        <Avatar
          sx={{
            bgcolor: "#1976d2",
            width: { xs: 28, sm: 32, md: 36 },
            height: { xs: 28, sm: 32, md: 36 },
            fontSize: { xs: 14, sm: 16, md: 18 },
            fontWeight: 600,
          }}
        >
          {title ? title.charAt(0).toUpperCase() : "C"}
        </Avatar>

        <Typography
          sx={{
            fontWeight: 600,
            fontSize: {
              xs: "0.9rem",
              sm: "1rem",
              md: "1.1rem",
            },
          }}
        >
          {title}
        </Typography>
      </AccordionSummary>

      <AccordionDetails
        sx={{
          bgcolor: "#fff",
          borderTop: "1px solid #e0e0e0",
        }}
      >
        {children}
      </AccordionDetails>
    </Accordion>
  );
}
