// src/components/Navbar.jsx
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import HomeIcon from "@mui/icons-material/Home";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import SchoolIcon from "@mui/icons-material/School";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import { AccountCircle, Logout, ShoppingBag  } from "@mui/icons-material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useDispatch, useSelector } from "react-redux";
import WebsiteLogoImage from "../assets/grammy-icon1.jpg"
import { logout } from "../features/auth/authSlice";

//myorders
const menuItems = [
  { id: "Home", label: "Home", icon: <HomeIcon />, to: "/user" },
  { id: "Instruments", label: "Instruments", icon: <MusicNoteIcon />, to: "/user/instruments" },
  { id: "Courses", label: "Courses", icon: <SchoolIcon />, to: "/user/courses" },
  // { id: "Contact", label: "Contact", icon: <ContactMailIcon />, to: "/user/contact" },
  { id: "Cart", label: "Cart", icon: <ShoppingCartIcon  />, to: "/user/cart" },
  { id: "MyOrder", label: "My Orders", icon: <ShoppingBag  />, to: "/user/myorders" },
];

const Navbar = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { count } = useSelector((state) => state.cart);

  const [active, setActive] = useState("Home"); // optional fallback state
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  // avatar menu state
  const [anchorEl, setAnchorEl] = useState(null);
  const avatarMenuOpen = Boolean(anchorEl);

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleAvatarClose = () => {
    setAnchorEl(null);
  };

  const handleMyProfile = () => {
    handleAvatarClose();
    navigate("/user/userprofile");
  };

  const handleLogout = () => {
    handleAvatarClose();
    //handleMenuClose();
    dispatch(logout()); 
    // place your logout logic here (clear auth, etc.)
    //navigate("/");
  };

  const CartIconWithBadge = () => (
  <Box sx={{ position: "relative", display: "inline-flex" }}>
    <ShoppingCartIcon />

    {count > 0 && (
      <Box
        sx={{
          position: "absolute",
          top: -6,
          right: -8,
          background: "red",
          color: "white",
          width: 18,
          height: 18,
          borderRadius: "50%",
          fontSize: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {count}
      </Box>
    )}
  </Box>
);


  return (
    <>
      <AppBar
        position="fixed"
        elevation={6}
        sx={{
          // background:
          //   "linear-gradient(90deg, rgba(2,2,94,1) 0%, rgba(6,45,112,1) 50%, rgba(21,93,140,1) 100%)",
           background:
            "linear-gradient(90deg, rgba(7, 7, 62, 1) 0%, rgba(2, 30, 69, 1) 50%, rgba(10, 47, 72, 1) 100%)",
          color: "#fff",
          backdropFilter: "saturate(140%) blur(6px)",
        }}
      >
        <Toolbar sx={{ px: { xs: 1, sm: 3 }, py: { xs: 0.5, sm: 1 } }}>
          {/* Left: Hamburger (mobile) + Logo */}
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mr: 2 }}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={() => setOpen(true)}
              sx={{ display: { xs: "inline-flex", sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>

            

            {/* <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "rgba(255,255,255,0.08)",
                mr: 1,
                boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 800, fontSize: 16 }}>
                M
              </Typography>
              
            </Box>

            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: 700,
                letterSpacing: 0.4,
                display: { xs: "none", sm: "block" },
              }}
            >
              Musically
            </Typography> */}
            <img
                src={WebsiteLogoImage}
                alt="Musically"
                style={{
                  width: 100,
                height: 82,
                borderRadius:20
                  //objectFit: "contain",
                  //padding: 4,
                }}
              />
          </Stack>

          {/* Center: Desktop Nav (uses NavLink for routing + active class) */}
          <Box sx={{ flexGrow: 1, display: { xs: "none", sm: "flex" }, gap: 1 }}>
            {menuItems.map((it) => (
              <Button
                key={it.id}
                component={NavLink}
                to={it.to}
                onClick={() => setActive(it.id)}
                end={it.to === "/user"} // ensure exact match for home
                sx={{
                  color: "rgba(255,255,255,0.95)",
                  textTransform: "none",
                  px: 2,
                  py: 1.25,
                  borderRadius: 2,
                  fontSize:12,
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  position: "relative", // needed for ::after underline
                  // default hover/active color
                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.06)",
                    transform: "translateY(-2px)",
                  },
                  // when NavLink adds `active` class this rule applies
                  "&.active": {
                    color: "#d3dbe8",
                    bgcolor: "rgba(255,255,255,0.08)",
                  },
                  // create the bottom border / underline using ::after for active state
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
                {it.id === "Cart" ? <CartIconWithBadge /> : it.icon}
                <Box component="span" sx={{ ml: 1 }}>
                  {it.label}
                </Box>
              </Button>
            ))}
          </Box>

          {/* spacer for mobile so avatar stays right */}
          <Box sx={{ flexGrow: 1, display: { xs: "block", sm: "none" } }} />

          {/* Right: Avatar */}
          {/* <Stack direction="row" spacing={1} alignItems="center" sx={{ ml: { xs: 0, sm: 0 } }}>
            <IconButton
              onClick={handleAvatarClick}
              size="small"
              aria-controls={avatarMenuOpen ? "avatar-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={avatarMenuOpen ? "true" : undefined}
              sx={{ p: 0 }}
            >
              {user.em}
              <Avatar
                alt="User"
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: "rgba(255,255,255,0.12)",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                S
              </Avatar>
            </IconButton>
          </Stack> */}
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
    {/* USER EMAIL / NAME */}
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

        ".MuiIconButton-root:hover &": {
          color: "#fff",
        },
      }}
    >
      {user?.em || "User"}
    </Typography>

    {/* AVATAR */}
    <Avatar
      alt="User"
      sx={{
        width: 36,
        height: 36,
        bgcolor: "rgba(255,255,255,0.15)",
        fontWeight: 700,
        cursor: "pointer",
        transition: "all 0.3s ease",

        // Avatar hover glow
        ".MuiIconButton-root:hover &": {
          boxShadow: "0 0 10px rgba(255,255,255,0.8)",
          transform: "scale(1.05)",
          bgcolor: "rgba(255,255,255,0.25)",
        },
      }}
    >
      {user?.em?.[0]?.toUpperCase() || "U"}
    </Avatar>
  </IconButton>
</Stack>



          {/* Avatar Menu */}
          <Menu
            id="avatar-menu"
            anchorEl={anchorEl}
            open={avatarMenuOpen}
            onClose={handleAvatarClose}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuItem onClick={handleMyProfile}>
              <AccountCircle sx={{ mr: 1, color: "#02025e" }} /> My Profile
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <Logout sx={{ mr: 1, color: "error.main" }} /> Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Drawer for Mobile Menu */}
      <Drawer anchor="left" open={open} onClose={() => setOpen(false)}>
        <Box sx={{ width: 280, position: "relative" }}>
          {/* Close Icon */}
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

          {/* Drawer Header */}
          <Box sx={{ p: 3, pt: 5, display: "flex", alignItems: "center", gap: 2 }}>
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

          {/* Menu Items (navigate + close drawer) */}
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
                {/* <ListItemIcon>{it.icon}</ListItemIcon> */}
                <ListItemIcon>{it.id === "Cart" ? <CartIconWithBadge /> : it.icon}</ListItemIcon>
                <ListItemText primary={it.label} />
              </ListItemButton>
            ))}
            {/* Also add Profile item inside drawer */}
            {/* <ListItemButton
              onClick={() => {
                setActive("Profile");
                navigate("/profile");
                setOpen(false);
              }}
            >
              <ListItemIcon>
                <AccountCircle />
              </ListItemIcon>
              <ListItemText primary="Profile" />
            </ListItemButton> */}
          </List>

          <Divider />

          {/* User Info (clickable avatar opens same menu) */}
          {/* <Box sx={{ p: 2 }}>
            <Typography variant="subtitle2">Signed in as</Typography>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
              <IconButton
                onClick={(e) => {
                  // open avatar menu anchored to this button on mobile drawer
                  setAnchorEl(e.currentTarget);
                }}
                sx={{ p: 0 }}
              >
                <Avatar sx={{ width: 40, height: 40 }}>S</Avatar>
              </IconButton>
              <Box>
                <Typography sx={{ fontWeight: 700 }}>Shubham</Typography>
                <Typography variant="body2" color="text.secondary">
                  shubham@example.com
                </Typography>
              </Box>
            </Stack>
          </Box> */}
        </Box>
      </Drawer>

      {/* Toolbar spacer so content doesn't hide under AppBar */}
      <Toolbar />
    </>
  );
};

export default Navbar;
