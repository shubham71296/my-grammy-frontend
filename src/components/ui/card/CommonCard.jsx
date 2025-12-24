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

const CommonCard = ({ it, idx, navTo, onAddToCart }) => {
  const navigate = useNavigate();

  return (
    <Card
      key={idx}
      sx={{
        width: {
          xs: "100%",
          sm: 240,
          md: 220,
        },
        maxWidth: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: { xs: 2, sm: 3 },
        overflow: "hidden",
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(6px)",
        boxShadow: {
          xs: "0 6px 14px rgba(0,0,0,0.12)",
          sm: "0 10px 25px rgba(0,0,0,0.12)",
        },
        transition: "all .3s ease",
        cursor: "pointer",
        "&:hover": {
          transform: { sm: "translateY(-6px)" },
          boxShadow: {
            sm: "0 20px 40px rgba(0,0,0,0.22)",
          },
        },
      }}
    >
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

            transition: "0.35s ease",
            "&:hover": {
              transform: "scale(1.08)",
              boxShadow: "0px 6px 22px rgba(0,255,0,0.65)",
            },

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

      <CardContent sx={{ p: 1.6 }}>
        <Typography
          variant="subtitle1"
          fontWeight={700}
          sx={{
            fontSize: { xs: "0.95rem", sm: "1rem" },
            color: "#151557",
            mb: 0.6,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {it?.instrument_title}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            fontSize: { xs: "0.75rem", sm: "0.82rem" },
            color: "text.secondary",
            lineHeight: 1.4,
          }}
        >
          {truncate(it?.instrurment_description, 55)}
        </Typography>
      </CardContent>

      <CardActions
        sx={{
          px: { xs: 1.2, sm: 1.6 },
          pb: { xs: 1.2, sm: 1.6 },
          gap: 1,
          justifyContent: "space-between",
        }}
      >
        <Button
          size="small"
          variant="outlined"
          onClick={() => navigate(navTo)}
          sx={{
            fontSize: { xs: "0.7rem", sm: "0.74rem" },
            px: { xs: 1.2, sm: 1.8 },
            borderRadius: "8px",
            fontWeight: 700,
          }}
        >
          View
        </Button>

        <Button
          size="small"
          variant="contained"
          onClick={() => onAddToCart()}
          sx={{
            fontSize: { xs: "0.7rem", sm: "0.74rem" },
            px: { xs: 1.2, sm: 1.8 },
            borderRadius: "8px",
            fontWeight: 700,
            background: "linear-gradient(135deg, #6366f1, #4338ca)",
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
