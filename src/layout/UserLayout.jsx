// src/layouts/MainLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";

import { Box } from "@mui/material";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useSelector } from "react-redux";

const UserLayout = () => {
  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      {/* Navbar */}
      <Navbar />

      {/* Page content */}
      <Box component="main" flexGrow={1}>
        <Outlet />
      </Box>

      {/* Footer */}
      <Footer />
    </Box>
  );
};

export default UserLayout;
