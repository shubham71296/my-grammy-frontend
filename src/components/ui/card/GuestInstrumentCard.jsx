import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
} from "@mui/material";
import { truncate } from "../../../utils/common-util";

export default function GuestInstrumentCard({
  image,
  price,
  title,
  description,
  onViewDetails,
  onAddToCart,
}) {
  return (
    <Box
      sx={{
        transition: "0.3s",
        "&:hover": { transform: "translateY(-6px)" },
      }}
    >
      <Card
        sx={{
          width: { xs: "100%", sm: 240, md: 220 },
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
            boxShadow: { sm: "0 20px 40px rgba(0,0,0,0.22)" },
          },
        }}
      >
        {/* Image + Price Tag */}
        <Box sx={{ position: "relative" }}>
          <CardMedia
            component="img"
            height="130"
            image={image}
            alt={title}
            sx={{
              objectFit: "cover",
              filter: "brightness(90%)",
              transition: ".3s ease",
              "&:hover": { filter: "brightness(75%)" },
            }}
          />

          {/* PRICE TAG */}
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
              zIndex: 2,
            }}
          >
            ₹ {price?.toLocaleString()}
          </Box>

          {/* Gradient Overlay */}
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              width: "100%",
              height: "50px",
              background:
                "linear-gradient(to top, rgba(0,0,0,0.6), transparent)",
            }}
          />
        </Box>

        {/* CONTENT */}
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
            {title}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              fontSize: { xs: "0.75rem", sm: "0.82rem" },
              color: "text.secondary",
              lineHeight: 1.4,
            }}
          >
            {truncate(description, 35)}
          </Typography>
        </CardContent>

        {/* ACTION BUTTONS */}
        <CardActions
          sx={{
            px: { xs: 1.2, sm: 1.6 },
            pb: { xs: 1.2, sm: 1.6 },
            gap: 1,
            justifyContent: "space-between",
          }}
        >
          <Button
            variant="outlined"
            size="large"
            fullWidth
            sx={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              minHeight: 32,
              textTransform: "none",
              borderRadius: "6px",
              color: "#1e88e5",
              fontSize: { xs: "0.65rem", sm: "0.72rem" },
              px: { xs: 1.2, sm: 1.6 },
              py: 0.4,
              fontWeight: 700,
              backdropFilter: "blur(4px)",
            }}
            onClick={onViewDetails}
          >
            View Details
          </Button>

          <Button
            variant="contained"
            size="large"
            fullWidth
            sx={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              minHeight: 32,
              textTransform: "none",
              borderRadius: "6px",
              fontSize: { xs: "0.65rem", sm: "0.72rem" },
              px: { xs: 1.2, sm: 1.6 },
              py: 0.4,
              fontWeight: 700,
              backdropFilter: "blur(4px)",
              background: "linear-gradient(135deg, #6366f1, #4338ca)",
              "&:hover": {
                background: "linear-gradient(135deg, #4338ca, #312e81)",
                boxShadow: "0 6px 18px rgba(49,46,129,0.5)",
              },
            }}
            onClick={onAddToCart}
          >
            Add To Cart
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
}
