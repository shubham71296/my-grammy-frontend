import React from "react";
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Tooltip,
  Chip,
} from "@mui/material";
import { Delete, Add, Remove } from "@mui/icons-material";

const CartItemCard = ({ item, onRemove, onIncrease, onDecrease }) => {
  const title = item?.title;
  const price = item?.price;
  const thumbnail = item?.thumbnail?.[0]?.url;
  const isInstrument = item.productType === "instruments";

  return (
    <Card
      sx={{
        display: "flex",
        alignItems: "center",
        borderRadius: 2,
        gap:2,
        p: 1.2,
        mb: 1.4,
        overflow: "hidden",
        //background: "rgba(255,255,255,0.9)",
        backdropFilter: "blur(8px)",
        boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
        transition: "all 0.35s ease",
        cursor: "pointer",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 16px 32px rgba(0,0,0,0.25)",
        },
      }}
    >
      {/* IMAGE */}
      <CardMedia
        component="img"
        sx={{
          width: 75,
          height: 75,
          objectFit: "cover",
          borderRadius: 2.5,
          mr: 1.3,
        }}
        image={thumbnail}
        alt={title}
        onError={(e) => {
          e.target.src = "https://via.placeholder.com/150?text=No+Image";
        }}
      />

      {/* CONTENT */}
      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        <CardContent sx={{ p: 0 }}>
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 700,
              fontSize: "0.92rem",
              color: "#2a2a2a",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "180px",
            }}
          >
            {title}
          </Typography>

          <Chip
            label={item.productType === "instruments" ? "Instrument" : "Course"}
            size="small"
            sx={{
              mt: 0.5,
              background: "#e8f3ff",
              color: "#1976d2",
              fontWeight: 600,
              height: 20,
              fontSize: "0.68rem",
              px: 0.6,
            }}
          />

          <Typography
            variant="subtitle1"
            sx={{
              mt: 0.7,
              color: "#1a73e8",
              fontWeight: 700,
              fontSize: "0.95rem",
            }}
          >
            {/* ₹{price} */}
            {price === 0 ? "Free with this instrument": `₹${price}`}
            
          </Typography>

          {/* QUANTITY CONTROLS */}
          {isInstrument && (
            <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mt: 0.5,
              gap: 0.8,
            }}
          >
            <IconButton
              disabled={item.qty === 1}
              size="small"
              sx={{
                border: "1px solid #ccc",
                p: 0.5,
                ":hover": { background: "#f0f0f0" },
              }}
              onClick={() => onDecrease(item)}
            >
              <Remove fontSize="small" />
            </IconButton>

            <Typography sx={{ minWidth: 20, textAlign: "center", fontWeight: 600 }}>
              {item.qty}
            </Typography>

            <IconButton
              size="small"
              sx={{
                border: "1px solid #ccc",
                p: 0.5,
                ":hover": { background: "#f0f0f0" },
              }}
              onClick={() => onIncrease(item)}
            >
              <Add fontSize="small" />
            </IconButton>
          </Box>
          )}
          
        </CardContent>
      </Box>

      {/* DELETE BUTTON */}
      {price === 0 ? null : (
        <CardActions sx={{ p: 0, pl: 1 }}>
        <Tooltip title="Remove from Cart">
          <IconButton
            onClick={() => onRemove(item)}
            sx={{
              background: "#ffe5e5",
              color: "#d32f2f",
              p: "3px",
              borderRadius: 2,
              ":hover": { background: "#ffcccc" },
            }}
          >
            <Delete sx={{ fontSize: 17 }} />
          </IconButton>
        </Tooltip>
      </CardActions>
      )}
      
    </Card>
  );
};

export default CartItemCard;
