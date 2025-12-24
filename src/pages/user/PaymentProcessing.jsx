import React, { useEffect } from "react";
import { Box, Typography, CircularProgress, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useDispatch } from "react-redux";
import { setCartCount } from "../../features/cartSlice";

const PaymentProcessing = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const syncCart = async () => {
      try {
        const res = await api.get("/user/getcartitems");
        const count = res.data?.data?.items?.length || 0;
        dispatch(setCartCount(count));
      } catch (err) {
        dispatch(setCartCount(0));
      }
    };

    syncCart();
    const timer = setTimeout(() => {
      navigate("/user/myorders");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate, dispatch]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f5f7fa",
        px: { xs: 2, sm: 0 },
      }}
    >
      <Paper
        elevation={4}
        sx={{
          p: { xs: 3, sm: 5 },
          borderRadius: 3,
          textAlign: "center",
          maxWidth: 400,
        }}
      >
        <CircularProgress size={60} sx={{ mb: 3 }} />

        <Typography
          variant="h6"
          fontWeight={700}
          gutterBottom
          sx={{
            fontSize: { xs: "1rem", sm: "1.25rem" },
          }}
        >
          Processing your payment
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontSize: { xs: "0.85rem", sm: "1rem" } }}
        >
          Please don’t close this page. We’re confirming your payment securely.
        </Typography>
      </Paper>
    </Box>
  );
};

export default PaymentProcessing;
