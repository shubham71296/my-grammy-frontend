import React from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Container,
  Divider,
} from "@mui/material";
import {
  ShoppingCart,
  School,
  CurrencyRupee,
  ListAlt,
} from "@mui/icons-material";

const StatCard = ({ icon, title, value, color }) => (
  <Paper
    elevation={3}
    sx={{
      p: 3,
      borderRadius: 2,
      display: "flex",
      alignItems: "center",
      gap: 2,
      transition: "0.3s",
      "&:hover": {
        transform: "translateY(-4px)",
        boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
      },
    }}
  >
    <Box
      sx={{
        width: 50,
        height: 50,
        borderRadius: "50%",
        bgcolor: `${color}.light`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: `${color}.main`,
      }}
    >
      {icon}
    </Box>

    <Box>
      <Typography variant="body2" color="text.secondary">
        {title}
      </Typography>
      <Typography variant="h6" fontWeight={700}>
        {value}
      </Typography>
    </Box>
  </Paper>
);

const Dashboard = () => {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f4f6f8" }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }} elevation={2}>
          <Typography variant="h5" fontWeight={700}>
            👋 Welcome back
          </Typography>
          <Typography color="text.secondary" mt={0.5}>
            Here’s what’s happening with your account today
          </Typography>
        </Paper>

        {/* Stats */}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<ListAlt />}
              title="Total Orders"
              value="12"
              color="primary"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<School />}
              title="My Courses"
              value="5"
              color="success"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<ShoppingCart />}
              title="Cart Items"
              value="2"
              color="warning"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<CurrencyRupee />}
              title="Total Spent"
              value="₹4,500"
              color="error"
            />
          </Grid>
        </Grid>

        {/* Recent Activity */}
        <Paper sx={{ mt: 5, p: 3, borderRadius: 2 }} elevation={2}>
          <Typography variant="h6" fontWeight={700} mb={2}>
            Recent Activity
          </Typography>

          <Divider sx={{ mb: 2 }} />

          <Typography color="text.secondary">
            • Purchased Guitar Basics Course  
          </Typography>
          <Typography color="text.secondary">
            • Added Piano Course to cart  
          </Typography>
          <Typography color="text.secondary">
            • Completed payment successfully  
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default Dashboard;
