import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  CardActions,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { truncate } from "../../../utils/common-util";

// const CommonCard = ({ title, description, image, price, navTo }) => {
const CommonCard = ({it, idx, navTo, onAddToCart }) => {
  const navigate = useNavigate();

  return (
    <Card
      key={idx}
      sx={{
        //maxWidth: 250,
        //height: 300,
        width: 220,
        display: "flex",
        flexDirection: "column",
        borderRadius: 3,
        overflow: "hidden",
        background: "rgba(255,255,255,0.8)",
        backdropFilter: "blur(6px)",
        boxShadow: "0 10px 25px rgba(0,0,0,0.12)",
        transition: "all .35s ease",
        cursor: "pointer",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.22)",
        },
      }}
    >
      {/* ⭐ Image Section */}
      <Box sx={{ position: "relative" }}>
        <CardMedia
          component="img"
          alt={it?.title}
          height="130"
          image={it?.instrument_images?.[0]?.url}
          sx={{
            objectFit: "cover",
            filter: "brightness(90%)",
            transition: ".3s ease",
            "&:hover": { filter: "brightness(75%)" },
          }}
        />

        {/* Price Tag Floating */}
        <Box
          sx={{
            position: "absolute",
            bottom: 8,
            right: 8,
            background: "linear-gradient(135deg, #3bd43b, #27b827)",
            color: "#fff",
            padding: "4px 14px",
            borderRadius: "20px",
            fontSize: "0.78rem",
            fontWeight: 700,
            letterSpacing: "0.5px",
            backdropFilter: "blur(4px)",
            boxShadow: "0px 4px 15px rgba(0,255,0,0.4)",
            overflow: "hidden",
            zIndex: 2,

            // Hover Shine Glow
            transition: "0.35s ease",
            "&:hover": {
              transform: "scale(1.08)",
              boxShadow: "0px 6px 22px rgba(0,255,0,0.65)",
            },

            // ✨ Shining Swipe Animation
            "&::after": {
              content: '""',
              position: "absolute",
              top: 0,
              left: "-100%",
              width: "100%",
              height: "100%",
              background:
                "linear-gradient(120deg, transparent, rgba(255,255,255,0.6), transparent)",
              transform: "skewX(-20deg)",
              animation: "shine 2.3s infinite",
            },

            "@keyframes shine": {
              "0%": { left: "-100%" },
              "50%": { left: "100%" },
              "100%": { left: "100%" },
            },
          }}
        >
          ₹{it?.instrument_price?.toLocaleString()}
        </Box>

        {/* Soft Gradient Overlay */}
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            width: "100%",
            height: "50px",
            background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent)",
          }}
        />
      </Box>

      {/* ⭐ Content Section */}
      <CardContent sx={{ p: 1.6 }}>
        <Typography
          variant="subtitle1"
          fontWeight={700}
          sx={{
            fontSize: "1rem",
            color: "#151557",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            mb: 0.8,
          }}
        >
          {it?.instrument_title}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            fontSize: "0.82rem",
            // lineHeight: 1.45,
            // height: 38,
            overflow: "hidden",
            color: "text.secondary",
          }}
        >
          {truncate(it?.instrurment_description, 55)}
          {/* {it?.instrurment_description} */}
        </Typography>
      </CardContent>

      {/* ⭐ Actions */}
      <CardActions
        sx={{
          px: 1.6,
          pb: 1.6,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {/* View Details */}
        <Button
          size="small"
          variant="outlined"
          onClick={() => navigate(navTo)}
          sx={{
            textTransform: "none",
            borderRadius: "10px",
            borderColor: "#1e40af",
            color: "#1e40af",
            fontWeight: 700,
            px: 1.8,
            py: 0.4,
            fontSize: "0.74rem",
            transition: ".25s ease",
            "&:hover": {
              background: "#1e40af",
              color: "#fff",
              boxShadow: "0 4px 12px rgba(30,64,175,0.35)",
            },
          }}
        >
          View
        </Button>

        {/* Add to Cart */}
        <Button
          size="small"
          variant="contained"
          onClick={() => onAddToCart()}
          sx={{
            textTransform: "none",
            borderRadius: "10px",
            background: "linear-gradient(135deg, #6366f1, #4338ca)",
            fontWeight: 700,
            px: 1.8,
            py: 0.4,
            fontSize: "0.74rem",
            transition: ".25s ease",
            boxShadow: "0 4px 12px rgba(67,56,202,0.35)",
            "&:hover": {
              background: "linear-gradient(135deg, #4338ca, #312e81)",
              boxShadow: "0 6px 18px rgba(49,46,129,0.5)",
            },
          }}
        >
          Add to Cart
        </Button>
      </CardActions>
    </Card>
  );
};

export default CommonCard;
