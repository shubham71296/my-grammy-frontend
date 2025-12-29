import React, { useEffect, useState } from "react";
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
  LibraryMusic,
} from "@mui/icons-material";
import api from "../../api/axios";

const StatCard = ({ icon, title, value, color }) => (
  <Paper
    elevation={3}
    sx={{
      p: { xs: 2, sm: 3 },
      borderRadius: 2,
      display: "flex",
      alignItems: "center",
      gap: { xs: 1.5, sm: 2 },
      transition: "0.3s",
      "&:hover": {
        transform: "translateY(-4px)",
        boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
      },
    }}
  >
    <Box
      sx={{
        width: { xs: 42, sm: 50 },
        height: { xs: 42, sm: 50 },
        borderRadius: "50%",
        bgcolor: `${color}.light`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: `${color}.main`,
        "& svg": {
          fontSize: { xs: 20, sm: 24 },
        },
      }}
    >
      {icon}
    </Box>

    <Box>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ fontSize: { xs: "0.75rem", sm: "0.85rem" } }}
      >
        {title}
      </Typography>
      <Typography
        fontWeight={700}
        sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
      >
        {value}
      </Typography>
    </Box>
  </Paper>
);


const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  
  useEffect(() => {
    const loadSummary = async () => {
      try {
        const res = await api.get("/admin/getdashboardsummary");
        if (res.data.success) {
          setSummary(res.data.data);
        }
      } catch (err) {
        console.log("Dashboard error:", err);
      }
    };
    loadSummary();
  }, []);

  if (!summary) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography>Loading summary...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f4f6f8", py: { xs: 2, sm: 3 } }}>
      <Container maxWidth="lg">
        <Paper
          sx={{
            p: { xs: 2, sm: 3 },
            mb: { xs: 3, sm: 4 },
            borderRadius: 2,
          }}
          elevation={2}
        >
          <Typography
            fontWeight={700}
            sx={{ fontSize: { xs: "1.2rem", sm: "1.5rem" } }}
          >
            👋 Welcome back
          </Typography>
          <Typography
            color="text.secondary"
            sx={{ fontSize: { xs: "0.85rem", sm: "1rem" }, mt: 0.5 }}
          >
            Here’s what’s happening with your account today
          </Typography>
        </Paper>

        <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid size={{ xs: 12, md: 12, lg: 4 }} sx={{mb:1}}>
            <StatCard icon={<ListAlt />} title="Total Orders" value={summary.orders} color="primary" />
          </Grid>

           <Grid size={{ xs: 12, md: 12, lg: 4 }} sx={{mb:1}}>
            <StatCard icon={<LibraryMusic />} title="Total Instruments" value={summary.instruments} color="warning" />
          </Grid>

          <Grid size={{ xs: 12, md: 12, lg: 4 }} sx={{mb:1}}>
            <StatCard icon={<School />} title="Total Courses" value={summary.courses} color="success" />
          </Grid>

          <Grid size={{ xs: 12, md: 12, lg: 4 }} sx={{mb:1}}>
            <StatCard icon={<CurrencyRupee />} title="Revenue" value={`₹${summary.revenue}`} color="error" />
          </Grid>

          <Grid size={{ xs: 12, md: 12, lg: 4 }} sx={{mb:1}}>
            <StatCard icon={<ShoppingCart />} title="Paid Orders" value={summary.paidOrders} color="info" />
          </Grid>

          {/* <Grid item xs={12} sm={6} md={3}>
            <StatCard icon={<CurrencyRupee />} title="Today’s Revenue" value={`₹${summary.todaysRevenue}`} color="secondary" />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatCard icon={<CurrencyRupee />} title="Razorpay Collected" value={`₹${summary.razorpayCollected}`} color="success" />
          </Grid> */}
        </Grid>

        <Paper
          sx={{
            mt: { xs: 1, sm: 2 },
            p: { xs: 2, sm: 3 },
            borderRadius: 2,
          }}
          elevation={2}
        >
          <Typography
            fontWeight={700}
            sx={{ fontSize: { xs: "1rem", sm: "1.25rem" }, mb: 1.5 }}
          >
            Recent Activity
          </Typography>

          <Divider sx={{ mb: 2 }} />

          <Typography sx={{ fontSize: { xs: "0.85rem", sm: "1rem" } }} color="text.secondary">
            • Purchased Guitar Basics Course
          </Typography>
          <Typography sx={{ fontSize: { xs: "0.85rem", sm: "1rem" } }} color="text.secondary">
            • Added Piano Course to cart
          </Typography>
          <Typography sx={{ fontSize: { xs: "0.85rem", sm: "1rem" } }} color="text.secondary">
            • Completed payment successfully
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};


export default Dashboard;
