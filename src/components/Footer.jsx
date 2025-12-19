// src/components/Footer.jsx
import React from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  IconButton,
  Link,
} from "@mui/material";
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  Phone,
  YouTube,
} from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#020247ff",
        color: "white",
        py: 4,
        mt: 8,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Logo / Name */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Grammy
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Bringing music and learning together — explore instruments,
              courses, and creativity.
            </Typography>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography fontWeight="bold" gutterBottom>
              Quick Links
            </Typography>
            {/* {["Home", "About", "Courses", "Contact"].map((item) => (
              <Typography key={item} variant="body2" sx={{ opacity: 0.8, "&:hover": { opacity: 1 } }}>
                <Link href={`/${item.toLowerCase()}`} color="inherit" underline="none">
                  {item}
                </Link>
              </Typography>
            ))} */}
            <Typography variant="body2">
              <Link
                component={RouterLink}
                to="/user"
                color="inherit"
                underline="none"
                sx={{ opacity: 0.8, "&:hover": { opacity: 1 } }}
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

          {/* Support */}
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
            {/* {["FAQ", "Privacy Policy", "Terms of Service"].map((item) => (
              <Typography key={item} variant="body2" sx={{ opacity: 0.8, "&:hover": { opacity: 1 } }}>
                <Link href={`/${item.toLowerCase().replace(/\s+/g, "-")}`} color="inherit" underline="none">
                  {item}
                </Link>
              </Typography>
            ))} */}
          </Grid>

          {/* Social Icons */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography fontWeight="bold" gutterBottom>
              Follow Us
            </Typography>
            <Box>
              <IconButton color="inherit" href="https://www.facebook.com/shubh.patidarr">
                <Facebook />
              </IconButton>
              {/* <IconButton color="inherit" href="https://twitter.com">
                <Twitter />
              </IconButton> */}
              <IconButton color="inherit" href="https://www.instagram.com/shubhampatidar_o1?igsh=ZXR6NDdnb3I5bnBv">
                <Instagram />
              </IconButton>
              {/* <IconButton color="inherit" href="https://linkedin.com">
                <LinkedIn />
              </IconButton> */}
               <IconButton color="inherit" href="https://youtube.com/@keymelodies?si=O_jdBIjP5R_BjkWg">
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
        </Grid>

        {/* Bottom Line */}
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
