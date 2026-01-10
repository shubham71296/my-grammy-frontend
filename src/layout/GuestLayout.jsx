import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  Drawer,
  Grid,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Facebook,
  Instagram,
  Login,
  Phone,
  YouTube,
} from "@mui/icons-material";
import WebsiteLogoImage from "../assets/grammy-icon1.jpg";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import HomeIcon from "@mui/icons-material/Home";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import SchoolIcon from "@mui/icons-material/School";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";

const menuItems = [
  { id: "Home", label: "Home", icon: <HomeIcon />, to: "/guest" },
  {
    id: "Instruments",
    label: "Instruments",
    icon: <MusicNoteIcon />,
    to: "/guest/guestinstruments",
  },
  {
    id: "Courses",
    label: "Courses",
    icon: <SchoolIcon />,
    to: "/guest/guestcourses",
  },
];

const GuestLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [active, setActive] = useState("Home");
  const [anchorEl, setAnchorEl] = useState(null);
  const avatarMenuOpen = Boolean(anchorEl);

  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down("sm"));

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleAvatarClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (location.pathname === "/guest") {
      setActive("Home");
    } else if (
      location.pathname.includes("guestcourses") ||
      location.pathname.includes("guestcourse/")
    ) {
      setActive("Courses");
    } else if (
      location.pathname.includes("guestinstruments") ||
      location.pathname.includes("guestinstrument/")
    ) {
      setActive("Instruments");
    }
  }, [location.pathname]);

  return (
    <>
      <AppBar
        position="fixed"
        elevation={6}
        sx={{
          background:
            "linear-gradient(90deg, rgba(7, 7, 62, 1) 0%, rgba(2, 30, 69, 1) 50%, rgba(10, 47, 72, 1) 100%)",
          color: "#fff",
          backdropFilter: "saturate(140%) blur(6px)",
        }}
      >
        <Toolbar sx={{ px: { xs: 1, sm: 3 }, py: { xs: 0.5, sm: 1 } }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={() => setOpen(true)}
              sx={{ display: { xs: "inline-flex", sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            <img
              src={WebsiteLogoImage}
              alt="Musically"
              style={{
                width: 90,
                height: 52,
                borderRadius: 20,
              }}
            />
          </Stack>

          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", sm: "flex" },
              gap: 1,
              ml: 2,
            }}
          >
            {menuItems.map((it) => (
              <Button
                key={it.id}
                component={NavLink}
                to={it.to}
                onClick={() => setActive(it.id)}
                end={it.to === "/guest"}
                sx={{
                  color: "rgba(255,255,255,0.95)",
                  textTransform: "none",
                  px: 2,
                  py: 1.25,
                  borderRadius: 2,
                  fontSize: 12,
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  position: "relative",
                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.06)",
                    transform: "translateY(-2px)",
                  },
                  "&.active": {
                    color: "#d3dbe8",
                    bgcolor: "rgba(255,255,255,0.08)",
                  },
                  "&.active::after": {
                    content: '""',
                    position: "absolute",
                    left: 12,
                    right: 12,
                    bottom: 6,
                    height: 3,
                    borderRadius: 2,
                    backgroundColor: "rgba(211,219,232,0.95)",
                    transition: "all 180ms ease",
                  },
                }}
              >
                {it.icon}
                <Box component="span" sx={{ ml: 1 }}>
                  {it.label}
                </Box>
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: "block", sm: "none" } }} />

          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ ml: { xs: 0, sm: 0 } }}
          >
            <IconButton
              onClick={handleAvatarClick}
              size="small"
              aria-controls={avatarMenuOpen ? "avatar-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={avatarMenuOpen ? "true" : undefined}
              sx={{
                p: 0.8,
                pr: 1.2,
                borderRadius: "50px",
                display: "flex",
                alignItems: "center",
                gap: 1,
                transition: "all 0.3s ease",
                backgroundColor: "transparent",

                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.1)",
                  transform: "scale(1.03)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                },
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  maxWidth: { xs: 80, sm: 120, md: 150 },
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  fontWeight: 600,
                  letterSpacing: "0.3px",
                  color: "rgba(255,255,255,0.9)",
                  transition: "color 0.3s ease",
                  fontSize: { xs: "0.8rem", sm: "1.15rem" },
                  ".MuiIconButton-root:hover &": {
                    color: "#fff",
                  },
                }}
              >
                Guest User
              </Typography>

              <Avatar
                alt="User"
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: "rgba(255,255,255,0.15)",
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  ".MuiIconButton-root:hover &": {
                    boxShadow: "0 0 10px rgba(255,255,255,0.8)",
                    transform: "scale(1.05)",
                    bgcolor: "rgba(255,255,255,0.25)",
                  },
                }}
              >
                {"G"}
              </Avatar>
            </IconButton>
          </Stack>

          <Menu
            id="avatar-menu"
            anchorEl={anchorEl}
            open={avatarMenuOpen}
            onClose={handleAvatarClose}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuItem onClick={() => navigate("/login")}>
              <Login sx={{ mr: 1, color: "success.main" }} /> Login / Signup
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={open} onClose={() => setOpen(false)}>
        <Box sx={{ width: 280, position: "relative" }}>
          <IconButton
            onClick={() => setOpen(false)}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              color: "text.secondary",
              "&:hover": { color: "error.main" },
            }}
            aria-label="close drawer"
          >
            <CloseIcon />
          </IconButton>

          <Box
            sx={{ p: 3, pt: 5, display: "flex", alignItems: "center", gap: 2 }}
          >
            <Box
              sx={{
                width: 52,
                height: 52,
                borderRadius: 2,
                bgcolor: "primary.main",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: 700,
                boxShadow: 2,
              }}
            >
              G
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                Grammy
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Discover instruments & courses
              </Typography>
            </Box>
          </Box>

          <Divider />

          <List>
            {menuItems.map((it) => (
              <ListItemButton
                key={it.id}
                selected={active === it.id}
                onClick={() => {
                  setActive(it.id);
                  navigate(it.to);
                  setOpen(false);
                }}
              >
                <ListItemIcon>{it.icon}</ListItemIcon>
                <ListItemText primary={it.label} />
              </ListItemButton>
            ))}
          </List>

          <Divider />
        </Box>
      </Drawer>

      <Toolbar />
      <Outlet />
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
                    H16, Keshar Bagh Rd, near Charming Kidz School, Nalanda
                    Parisar, Indore, Madhya Pradesh 452009
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
    </>
  );
};

export default GuestLayout;
