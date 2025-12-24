// src/components/Footer.jsx
import React from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  IconButton,
  Link,
  Stack,
} from "@mui/material";
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  Phone,
  YouTube,
} from "@mui/icons-material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { Link as RouterLink } from "react-router-dom";

const Footer = () => {

  //const openInMaps = "https://www.google.com/maps/search/?api=1&query=Maestro+Music+Classes+Indore";
  const city = "Maestro Music Classes - Flute, Guitar, Piano & Singing Academy, Indore"
  const openInMaps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    city
  )}`;
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#020247ff",
        color: "white",
        py: { xs: 4, sm: 6 },
        mt: { xs: 6, sm: 8 },
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography
              variant="h6"
              fontWeight="bold"
              gutterBottom
              sx={{
                fontSize: {
                  xs: "1rem",
                  sm: "1.25rem",
                  md: "1.4rem",
                },
              }}
            >
              Grammy
            </Typography>
            <Typography
              variant="body2"
              sx={{
                opacity: 0.8,
                fontSize: {
                  xs: "0.8rem",
                  sm: "0.875rem",
                  md: "0.95rem",
                },
              }}
            >
              Bringing music and learning together — explore instruments,
              courses, and creativity.
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography fontWeight="bold" gutterBottom>
              Quick Links
            </Typography>
            <Typography variant="body2">
              <Link
                component={RouterLink}
                to="/user"
                color="inherit"
                underline="none"
                sx={{
                  opacity: 0.8,
                  "&:hover": { opacity: 1 },
                  fontSize: {
                    xs: "0.75rem",
                    sm: "0.85rem",
                    md: "0.9rem",
                  },
                }}
              >
                Home
              </Link>
            </Typography>

            <Typography variant="body2">
              <Link
                component={RouterLink}
                to="/user/courses"
                color="inherit"
                underline="none"
                sx={{ opacity: 0.8, "&:hover": { opacity: 1 } }}
              >
                Courses
              </Link>
            </Typography>

            <Typography variant="body2">
              <Link
                component={RouterLink}
                to="/user/instruments"
                color="inherit"
                underline="none"
                sx={{ opacity: 0.8, "&:hover": { opacity: 1 } }}
              >
                Instruments
              </Link>
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography fontWeight="bold" gutterBottom>
              Support
            </Typography>

            <Typography variant="body2">
              <Link
                component={RouterLink}
                to="/user/faq"
                color="inherit"
                underline="none"
                sx={{ opacity: 0.8, "&:hover": { opacity: 1 } }}
              >
                FAQ
              </Link>
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography fontWeight="bold" gutterBottom>
              Follow Us
            </Typography>
            <Box>
              <IconButton
                color="inherit"
                href="https://www.facebook.com/shubh.patidarr"
              >
                <Facebook />
              </IconButton>

              <IconButton
                color="inherit"
                href="https://www.instagram.com/shubhampatidar_o1?igsh=ZXR6NDdnb3I5bnBv"
              >
                <Instagram />
              </IconButton>

              <IconButton
                color="inherit"
                href="https://youtube.com/@keymelodies?si=O_jdBIjP5R_BjkWg"
              >
                <YouTube />
              </IconButton>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography fontWeight="bold" gutterBottom>
              Contact Us
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                opacity: 0.85,
                "&:hover": { opacity: 1 },
              }}
            >
              <Phone fontSize="small" />

              <Typography
                variant="body2"
                sx={{ fontWeight: 500, color: "inherit" }}
              >
                +917880222377
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography fontWeight="bold" gutterBottom>
              Our Location
            </Typography>
            <Stack
              direction="row"
              spacing={1}
              alignItems="flex-start"
              sx={{
                cursor: "pointer",
                opacity: 0.85,
                "&:hover": { opacity: 1 },
              }}
              onClick={() => window.open(openInMaps, "_blank")}
            >
              <LocationOnIcon color="error" sx={{ mt: "2px" }} />

              <Box>
                <Typography
                  variant="body2"
                  fontWeight={600}
                  sx={{ lineHeight: 1.4 }}
                >
                  Maestro Music Classes
                </Typography>

                <Typography
                  variant="caption"
                  sx={{
                    display: "block",
                    opacity: 0.85,
                    lineHeight: 1.5,
                  }}
                >
                  H16, Keshar Bagh Rd, near Charming Kidz School, Nalanda Parisar,
                  Indore, Madhya Pradesh 452009
                </Typography>

              </Box>
            </Stack>
          </Grid>
        </Grid>

        

        <Box
          sx={{
            textAlign: "center",
            mt: 4,
            borderTop: "1px solid rgba(255,255,255,0.2)",
            pt: 2,
          }}
        >
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            © {new Date().getFullYear()} Grammy. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
