import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Avatar,
  Stack,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import api from "../../api/axios";


export default function PaymentSuccess() {
  const { token } = useSelector((state) => state.auth || {});
  const [status, setStatus] = useState("verifying");
  const [order, setOrder] = useState(null);
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const sessionId = new URLSearchParams(window.location.search).get("session_id");
    if (!sessionId) {
      setStatus("invalid");
      return;
    }

    const verifyPayment = async () => {
      try {
        setStatus("verifying");
        // const res = await axios.get(`/api/user/verify-payment/${sessionId}`, {
        //   headers: { Authorization: `Bearer ${token}` },
        // });
         const res = await api.get(`/user/verify-payment/${sessionId}`);

        if (res.data && res.data.success) {
          setStatus(res.data.paymentStatus || "paid");
          setOrder(res.data.order || null);
        } else {
          setStatus("error");
        }
      } catch (err) {
        console.error("Verification error:", err?.response || err);
        setStatus("error");
      }
    };

    verifyPayment();
  }, [token]);

  const Icon = () => {
    if (status === "verifying") return <CircularProgress size={48} />;
    if (status === "paid") return <CheckCircleOutlineIcon sx={{ fontSize: 48 }} />;
    if (status === "pending") return <HourglassEmptyIcon sx={{ fontSize: 48 }} />;
    return <ErrorOutlineIcon sx={{ fontSize: 48 }} />;
  };

  const titleMap = {
    verifying: "Verifying payment...",
    paid: "Payment successful",
    pending: "Payment pending",
    invalid: "Session missing",
    error: "Verification error",
    failed: "Payment failed",
  };

  return (
    <Box
      sx={{
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        bgcolor: 'background.paper'
      }}
    >
      <Card elevation={3} sx={{ width: isSm ? '92%' : 560, borderRadius: 2 }}>
        <CardContent sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
          <Avatar sx={{ bgcolor: 'transparent', width: 72, height: 72 }}>
            <Icon />
          </Avatar>

          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {titleMap[status] || 'Status'}
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {status === 'paid' && 'Thanks — we received your payment. Your order is confirmed.'}
              {status === 'verifying' && 'Please wait while we confirm your transaction.'}
              {status === 'pending' && 'Your payment is being processed by the provider.'}
              {status === 'invalid' && 'No session id found in the URL.'}
              {status === 'error' && 'There was an error verifying your payment. Please try again or contact support.'}
              {status === 'failed' && 'Your payment did not complete. Try again or contact support.'}
            </Typography>

            {order && status === 'paid' && (
              <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary">Order:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>{order._id}</Typography>
              </Stack>
            )}

            <Stack direction={isSm ? 'column' : 'row'} spacing={2} sx={{ mt: 3 }}>
              <Button variant="contained" onClick={() => (window.location.href = '/')}>
                Continue shopping
              </Button>

              <Button variant="outlined" onClick={() => (window.location.href = '/user/myorders')}>
                View orders
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
