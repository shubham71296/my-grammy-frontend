import React from "react";
import {
  AppBar,
  Avatar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  Badge,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SettingsIcon from "@mui/icons-material/Settings";
import PeopleIcon from "@mui/icons-material/People";
import LogoutIcon from "@mui/icons-material/Logout";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Group, LibraryMusic, ListAlt, Logout, MenuBook, Person, ShoppingBag } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";
import WebsiteLogoImage from "../assets/grammy-icon1.jpg"


const drawerWidth = 260;

export default function AdminLayout() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  // Profile Menu State
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openMenu = Boolean(anchorEl);

  const handleProfileClick = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleDrawerToggle = () => setMobileOpen((s) => !s);

  const handleLogout = () => {
      handleMenuClose();
      dispatch(logout());      
  }

  const menuItems = [
    // Dashboard - use '/admin' so it matches the index route
    { title: "Dashboard", icon: <DashboardIcon />, route: "/admin" },
    { title: "Add Instruments", icon: <LibraryMusic />, route: "/admin/addinstruments" },
    { title: "Create Courses", icon: <MenuBook />, route: "/admin/createcourse" },
    // { title: "Add Courses", icon: <MenuBook />, route: "/admin/addcourses" },
    { title: "Instruments List", icon: <ListAlt />, route: "/admin/myinstrumentslist" }, //?offset=0&page=1&limit=5
    { title: "Courses List", icon: <MenuBook />, route: "/admin/mycourseslist" },
    { title: "Users", icon: <Group />, route: "/admin/allusers" },
    { title: "Orders", icon: <ShoppingBag />, route: "/admin/allorders" },
  ];

  //allorders

  const selectedRoute = location.pathname; // e.g. "/admin/addcourses/123"

  const drawer = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Toolbar sx={{ alignItems: "center", gap: 1 }}>
        {/* <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "rgba(255,255,255,0.06)",
            mr: 1,
            boxShadow: "0 6px 18px rgba(2,6,23,0.6)",
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 900, fontSize: 16 }}>
            G
          </Typography>
        </Box> */}
        <img
                        src={WebsiteLogoImage}
                        alt="Musically"
                        style={{
                          width: 100,
                        height: 82,
                        borderRadius:20,
                          //objectFit: "contain",
                          padding: 4,
                        }}
                      />

        <Box>
          <Typography variant="h6" sx={{ lineHeight: 1 }}>
            Grammy
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.8 }}>
            Admin Panel
          </Typography>
        </Box>
      </Toolbar>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.06)" }} />

      <Box sx={{ p: 2 }}>
        <List>
          {menuItems.map((item, index) => {
            // normalize full path for matching against location.pathname
            const itemPath = item.route?.startsWith("/")
              ? item.route
              : `/admin${item.route ? `/${item.route}` : ""}`;

            // Dashboard should match only '/admin' or '/admin/dashboard' (if present)
            if (itemPath === "/admin") {
              const isSelected =
                selectedRoute === "/admin" || selectedRoute === "/admin/dashboard";
              return (
                <ListItem key={index} disablePadding sx={{ mb: 0.5 }}>
                  <ListItemButton
                    onClick={() => {
                      navigate(item.route),
                      setMobileOpen(false);
                    }}
                    selected={isSelected}
                    sx={{
                      borderRadius: 1.5,
                      py: 1.2,
                      pl: 1.6,
                      pr: 2,
                      color: "#fff",
                      transition: "all 260ms ease",
                      position: "relative",
                      "&.Mui-selected": {
                        background:
                          "linear-gradient(90deg, rgba(108,99,255,0.25) 0%, rgba(72,61,255,0.12) 100%)",
                        boxShadow: "inset 0 0 12px rgba(108,99,255,0.35)",
                      },
                      "&:hover": {
                        background:
                          "linear-gradient(90deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.06) 100%)",
                        boxShadow: "inset 0 0 10px rgba(255,255,255,0.1)",
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        color: "inherit",
                        minWidth: 40,
                        "& svg": { fontSize: 18 },
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.title}
                      sx={{
                        "& .MuiListItemText-primary": {
                          fontWeight: 600,
                          fontSize: "0.85rem",
                        },
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              );
            }

            // default matching for other items: exact or children
            const isSelected =
              selectedRoute === itemPath || selectedRoute.startsWith(itemPath + "/");

            return (
              <ListItem key={index} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => {
                      navigate(item.route);
                      setMobileOpen(false); // <<-- closes drawer when clicked
                    }}
                  selected={isSelected}
                  sx={{
                    borderRadius: 1.5,
                    py: 1.2,
                    pl: 1.6,
                    pr: 2,
                    color: "#fff",
                    transition: "all 260ms ease",
                    position: "relative",
                    "&.Mui-selected": {
                      background:
                        "linear-gradient(90deg, rgba(108,99,255,0.25) 0%, rgba(72,61,255,0.12) 100%)",
                      boxShadow: "inset 0 0 12px rgba(108,99,255,0.35)",
                    },
                    "&:hover": {
                      background:
                        "linear-gradient(90deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.06) 100%)",
                      boxShadow: "inset 0 0 10px rgba(255,255,255,0.1)",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: "inherit",
                      minWidth: 40,
                      "& svg": { fontSize: 18 },
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.title}
                    sx={{
                      "& .MuiListItemText-primary": {
                        fontWeight: 600,
                        fontSize: "0.85rem",
                      },
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      <Box sx={{ flexGrow: 1 }} />

      <Box sx={{ p: 2 }}>
        <Divider sx={{ borderColor: "rgba(255,255,255,0.04)", mb: 1.5 }} />
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="caption" sx={{ opacity: 0.85 }}>
            © {new Date().getFullYear()} Musically
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.7 }}>v1.2</Typography>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* AppBar */}
      <AppBar
        position="fixed"
        elevation={6}
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` }, // keep appbar shifted to the right on md+
          background: "#2b437bff",
          //boxShadow: "0 8px 30px rgba(11,22,47,0.5)",
        }}
      >
        <Toolbar>
          {/* Mobile Menu Button */}
          <IconButton color="inherit" edge="start" sx={{ mr: 2, display: { md: "none" } }} onClick={handleDrawerToggle}>
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" noWrap sx={{ flexGrow: 1, fontWeight: 700 }}>
            
          </Typography>

          {/* -------- PROFILE SECTION -------- */}
          <Typography variant="body2" sx={{ mr: 2, opacity: 0.9 }}>{user?.em}</Typography>

          <IconButton onClick={handleProfileClick} sx={{ p: 0 }}>
            <Avatar alt="Profile" />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={openMenu}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            {/* <MenuItem
              onClick={() => {
                handleMenuClose();
                //navigate("/admin/profile");
              }}
            >
               <ListItemIcon>
                <Person fontSize="small" />
              </ListItemIcon>
              <ListItemText>Profile</ListItemText>
            </MenuItem> */}
            <MenuItem
              onClick={handleLogout}
            >
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              <ListItemText>Logout</ListItemText>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Drawer – Mobile */}
      <Box component="nav" aria-label="mailbox folders">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              background: "linear-gradient(180deg,#0f172a 0%,#1b2a4e 100%)",
              color: "#fff",
              position: "fixed",
            },
          }}
        >
          {drawer}
        </Drawer>

        {/* Drawer – Desktop */}
        <Drawer
          variant="permanent"
          open
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              background: "#093560ff",
              color: "#fff",
              borderRight: "1px solid rgba(255,255,255,0.04)",
              position: "fixed",
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          ml: { md: `${drawerWidth}px` }, // push right on desktop
          width: { md: `calc(100% - ${drawerWidth}px)` },
          minHeight: "100vh",
          background: "linear-gradient(180deg, #f6f8fb 0%, #eef3fb 100%)",
        }}
      >
        {/* Toolbar spacer pushes content below AppBar */}
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
