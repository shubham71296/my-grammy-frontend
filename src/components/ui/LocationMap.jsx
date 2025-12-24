import LocationOnIcon from "@mui/icons-material/LocationOn";
import { Box, Typography, Paper, Stack } from "@mui/material";

const LocationMap = ({ city }) => {
  const mapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(
    city
  )}&output=embed`;

  const openInMaps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    city
  )}`;

  return (
    <Box sx={{ mt: 4, p:1 }}>
      {/* MAP */}
      <Paper
        elevation={3}
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          height: { xs: 260, sm: 340, md: 420 },
        }}
      >
        <iframe
          title="Maestro Music Classes Location"
          src={mapUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
        />
      </Paper>

      {/* ADDRESS */}
      <Stack
        direction="row"
        spacing={1}
        alignItems="flex-start"
        justifyContent="center"
        mt={2}
        px={2}
        onClick={() => window.open(openInMaps, "_blank")}
        sx={{
          cursor: "pointer",
          borderRadius: 2,
          p: 2,
          transition: "all 0.3s ease",
          backgroundColor: "transparent",

          "&:hover": {
            backgroundColor: "rgba(25,118,210,0.06)",
            transform: "translateY(-3px)",
            boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
          },

          "&:hover .location-icon": {
            transform: "scale(1.15)",
          },

          "&:hover .location-title": {
            textDecoration: "underline",
          },
        }}
      >
        <LocationOnIcon 
          color="error" 
          sx={{
            mt: "2px",
            transition: "transform 0.3s ease",
          }}
        />

        <Box textAlign="left">
          <Typography fontWeight={700} sx={{ transition: "all 0.3s ease" }}>
            Maestro Music Classes – Flute, Guitar, Piano & Singing Academy
          </Typography>

          <Typography variant="body2" color="text.secondary">
            H16, Keshar Bagh Rd, near Charming Kidz School, Nalanda Parisar,
            Indore, Madhya Pradesh 452009, India
          </Typography>

          <Typography
            variant="caption"
            sx={{ color: "primary.main", fontWeight: 600 }}
          >
            Open Mon–Sat • 10:00 AM – 8:00 PM (Tap to open map)
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
};

export default LocationMap;

