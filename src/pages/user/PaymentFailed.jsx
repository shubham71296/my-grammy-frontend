import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const PaymentFailed = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const retryPayment = async () => {
    try {
      setLoading(true);

      const res = await api.post("/user/create-checkout-session");
      const { razorpayOrderId, amount, currency, key } = res.data.data;

      const options = {
        key,
        amount,
        currency,
        name: "Music Academy",
        description: "Retry Payment",
        order_id: razorpayOrderId,

        handler: () => navigate("/user/payment-processing"),

        modal: {
          ondismiss: () => navigate("/user/payment-failed"),
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", () => {
        navigate("/user/payment-failed");
      });

      razorpay.open();
    } catch {
      alert("Retry failed. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Paper sx={{ p: 4, textAlign: "center", maxWidth: 420 }}>
        <Typography variant="h5" color="error" fontWeight={700}>
          Payment Failed
        </Typography>

        <Typography sx={{ mt: 2 }}>
          Your payment could not be completed. No money was deducted.
        </Typography>

        <Button
          variant="contained"
          sx={{ mt: 3 }}
          onClick={retryPayment}
          disabled={loading}
          startIcon={loading && <CircularProgress size={18} />}
        >
          Retry Payment
        </Button>

        <Button sx={{ mt: 2 }} onClick={() => navigate("/user/cart")}>
          Back to Cart
        </Button>
      </Paper>
    </Box>
  );
};

export default PaymentFailed;
