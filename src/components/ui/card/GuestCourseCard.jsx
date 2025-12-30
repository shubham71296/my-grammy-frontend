import {
  Box,
  Card,
  CardMedia,
  Typography,
  CardContent,
  CardActions,
  Button,
  Chip,
} from "@mui/material";
import { PlayCircleFilledWhite } from "@mui/icons-material";
import { truncate } from "../../../utils/common-util";

export default function GuestCourseCard({
  image,
  title,
  description,
  price,
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
          mt: 1,
          width: { xs: "100%", sm: 260, md: 220 },
          borderRadius: { xs: 2, sm: 3 },
          overflow: "hidden",
          background: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(8px)",
          boxShadow: {
            xs: "0 4px 12px rgba(0,0,0,0.12)",
            sm: "0 6px 20px rgba(0,0,0,0.15)",
          },
          transition: "all 0.3s ease",
          cursor: "pointer",
          "&:hover": {
            transform: { sm: "translateY(-4px)" },
            boxShadow: {
              sm: "0 16px 32px rgba(0,0,0,0.25)",
            },
          },
        }}
      >
        {/* ===== IMAGE SECTION ===== */}
        <Box sx={{ position: "relative" }}>
          <CardMedia
            component="img"
            height="130"
            image={image}
            alt={title}
            sx={{
              objectFit: "cover",
              transition: "0.3s ease",
              "&:hover": { filter: "brightness(85%)" },
            }}
          />

          {/* Play Icon */}
          <PlayCircleFilledWhite
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontSize: { xs: 48, sm: 42 },
              color: "white",
              opacity: 0.9,
            }}
          />

          {/* Bottom Overlay */}
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              width: "100%",
              height: "55px",
              background:
                "linear-gradient(to top, rgba(0,0,0,0.65), rgba(0,0,0,0))",
            }}
          />

          {/* Course Title over Image */}
          <Typography
            variant="subtitle1"
            sx={{
              position: "absolute",
              bottom: 12,
              left: 12,
              maxWidth: "90%",
              color: "#fff",
              fontWeight: 700,
              px: 1.3,
              py: 0.6,
              borderRadius: 1.5,
              backdropFilter: "blur(6px)",
              background:
                "linear-gradient(135deg, rgba(0,0,0,0.65), rgba(0,0,0,0.25))",
              fontSize: { xs: "0.85rem", sm: "0.95rem" },
              textShadow: "0px 2px 6px rgba(0,0,0,0.5)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {title}
          </Typography>
        </Box>

        {/* ===== CONTENT SECTION ===== */}
        <CardContent sx={{ p: { xs: 1.4, sm: 1.8 } }}>
          <Typography
            variant="body2"
            sx={{
              fontSize: { xs: "0.75rem", sm: "0.82rem" },
              color: "text.secondary",
              lineHeight: 1.4,
            }}
          >
            {truncate(description, 55)}
          </Typography>

          {/* Price */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
              mt: 1,
            }}
          >
            <Chip
              label={`₹ ${price}`}
              size="small"
              sx={{
                height: { xs: 24, sm: 28 },
                fontSize: { xs: "0.65rem", sm: "0.75rem" },
                fontWeight: 800,
                borderRadius: 2,
                background: "#fde6e3ff",
                color: "#a51106ff",
              }}
            />
          </Box>

          {/* Buttons */}
          <Box sx={{ display: "flex", gap: 1 }}>
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
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
