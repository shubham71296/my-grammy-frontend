// LectureCard.jsx
import React from "react";
import { Paper, Grid, Box, IconButton, Typography } from "@mui/material";
import { VideoLibrary } from "@mui/icons-material";

const LectureCard = ({ lec, index, onPlay }) => {
  return (
    <Paper
      elevation={4}
      sx={{
        p: 1,
        borderRadius: 1,
        width: "fit-content",
         transition: "all 0.35s ease",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: "0 16px 32px rgba(0,0,0,0.25)",
        },
      }}
    >
      <Grid item xs={12} sm={6} md={4}>
        {/* Thumbnail Box */}
        <Box
          sx={{
            position: "relative",
            borderRadius: 2,
            overflow: "hidden",
            boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
            height: "120px",
            width: "120px",
            bgcolor: "#18243aff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Play Icon */}
          <IconButton
            sx={{
              bgcolor: "white",
              width: 40,
              height: 40,
              borderRadius: "50%",
              boxShadow: "0 2px 12px rgba(0,0,0,0.2)",
              transition: "transform 0.3s ease",
              "&:hover": {
                transform: "scale(1.15)",
                bgcolor: "white",
              },
            }}
            onClick={() => onPlay(lec)}
          >
            <VideoLibrary fontSize="medium" />
          </IconButton>
        </Box>

        {/* Title */}
        <Box
          mt={1}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "120px",
          }}
        >
          <Typography
            mt={1}
            fontWeight={700}
            sx={{
              flexGrow: 1,
              fontSize: 11,
              mr: 1,
              lineHeight: 1.2,
            }}
          >
            {index + 1}. {lec.lecture_title}
          </Typography>
        </Box>
      </Grid>
    </Paper>
  );
};

export default LectureCard;
