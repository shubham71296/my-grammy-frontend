import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Paper,
  Typography,
  Divider,
  CircularProgress,
  Container,
} from "@mui/material";
import { MenuBook } from "@mui/icons-material";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import CartItemCard from "../../components/ui/card/CartItemCard";
import AppDialog from "../../components/ui/dialog/AppDialog";
import { setCartCount } from "../../features/cartSlice";
import api from "../../api/axios";
import { getFullName } from "../../utils/common-util";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);
  const [loadingButton, setLoadingButton] = useState(false);
  const [cart, setCart] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    getCartItems();
  }, []);

  const getCartItems = async () => {
    setLoading(true);
    try {
      const response = await api.get("/user/getcartitems");
      const payload = response?.data?.data;

      setCart(payload);
    } catch (err) {
      console.log("Error fetching cart details:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleIncrease = async (item) => {
    try {
      const res = await api.post("/user/increasequantity", {
        productId: item.productId._id,
        productType: item.productType,
      });

      const updatedCart = { ...cart };
      const index = updatedCart.items.findIndex(
        (i) => i.productId._id === item.productId._id
      );
      if (index !== -1) {
        updatedCart.items[index].qty += 1;
      }
      setCart(updatedCart);
    } catch (err) {
      console.log("Error increasing quantity:", err);
    }
  };

  const handleDecrease = async (item) => {
    try {
      const res = await api.post("/user/decreasequantity", {
        productId: item.productId._id,
        productType: item.productType,
      });

      const updatedCart = { ...cart };
      const index = updatedCart.items.findIndex(
        (i) => i.productId._id === item.productId._id
      );

      if (index !== -1) {
        if (updatedCart.items[index].qty > 1) {
          updatedCart.items[index].qty -= 1;
        }
      }
      setCart(updatedCart);
    } catch (err) {
      console.log("Error increasing quantity:", err);
    }
  };

  const handleRemoveCart = async (item) => {
    try {
      
      const productId =
        typeof item.productId === "string"
          ? item.productId
          : item.productId?._id;
      const productType = item.productType;

      if (!productId || !productType) {
        console.error("Invalid remove payload:", item);
        return;
      }

      const res = await api.post("/user/removefromcart", {
        productId,
        productType,
      });

      setCart(res.data.data);

      dispatch(setCartCount(res.data.data.items.length));
    } catch (err) {
      console.log("Error remove cart:", err);
    }
  };

  const subtotal = cart?.items?.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );
  const discount = 50;
  const total = subtotal;

  const handleCheckout = async () => {
    try {
      setLoadingButton(true);

      const res = await api.post("/user/create-checkout-session");

      const { razorpayOrderId, amount, currency, key, orderId } = res.data.data;

      const options = {
        key,
        amount,
        currency,
        name: "Music Academy",
        description: "Course / Instrument Purchase",
        order_id: razorpayOrderId,

        handler: function (response) {
          console.log("Payment initiated:", response);

          navigate("/user/payment-processing");
        },

        modal: {
          ondismiss: function () {
            navigate("/user/payment-failed");
          },
        },

        prefill: {
          email: user?.em,
          name: getFullName(user?.firstname, user?.lastname),
        },

        theme: {
          color: "#3399cc",
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", function () {
        navigate("/user/payment-failed");
      });

      razorpay.open();
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Payment failed. Please try again.");
    } finally {
      setLoadingButton(false);
    }
  };

  return (
    <Box sx={{ backgroundColor: "#f0f4f8", minHeight: "100vh", py: 6 }}>
      <Container maxWidth="lg">
        <Paper
          elevation={4}
          sx={{
            p: 3,
            borderRadius: 2,
          }}
        >
          <Box mb={4}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                color: "#1976d2",
                display: "flex",
                alignItems: "center",
                gap: { xs: 0.8, sm: 1 },
                fontSize: {
                  xs: "1rem",
                  sm: "1.2rem",
                  md: "1.5rem",
                },
                lineHeight: 1.2,
                letterSpacing: { xs: "0.2px", sm: "0.5px" },
              }}
            >
              <MenuBook
                sx={{
                  fontSize: {
                    xs: "1.1rem",
                    sm: "1.4rem",
                    md: "1.6rem",
                  },
                  flexShrink: 0,
                }}
              />{" "}
              My Cart
            </Typography>
            <Divider
              sx={{
                mt: 1.5,
                borderColor: "#1976d2",
                borderWidth: "1px",
                borderRadius: 1,
              }}
            />
          </Box>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
              <CircularProgress />
            </Box>
          ) : cart?.items?.length === 0 ? (
            <Typography
              variant="h6"
              sx={{ textAlign: "center", color: "#999", py: 6 }}
            >
              Your cart is empty
            </Typography>
          ) : (
            <Box
              sx={{
                display: { xs: "block", md: "flex" },
                gap: 4,
                alignItems: "flex-start",
              }}
            >
              <Box sx={{ flex: 2 }}>
                {cart?.items?.map((item, index) => (
                  <CartItemCard
                    // key={index}
                    key={`${item.productType}-${item.productId._id}`}
                    item={item}
                    onRemove={() => handleRemoveCart(item)}
                    onIncrease={() => handleIncrease(item)}
                    onDecrease={() => handleDecrease(item)}
                  />
                ))}
              </Box>

              {cart?.items?.length > 0 ? (
                <Box
                  sx={{
                    flex: 1,
                    mt: { xs: 4, md: 0 },
                    position: "sticky",
                    top: 20,
                    transition: "all .35s ease",
                    cursor: "pointer",
                    "&:hover": {
                      transform: "translateY(-6px)",
                      boxShadow: "0 20px 40px rgba(0,0,0,0.22)",
                    },
                  }}
                >
                  <Paper
                    elevation={4}
                    sx={{
                      p: 3,
                      borderRadius: 2,
                    }}
                  >
                    <Typography
                      variant="h6"
                      fontWeight={700}
                      mb={3}
                      color="#1976d2"
                      sx={{ fontSize: { xs: "0.95rem", sm: "1.25rem" } }}
                    >
                      Order Summary
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography
                        variant="h6"
                        fontWeight={700}
                        sx={{ fontSize: { xs: "0.9rem", sm: "1.25rem" } }}
                      >
                        Total
                      </Typography>
                      <Typography
                        variant="h6"
                        fontWeight={700}
                        color="#1976d2"
                        sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
                      >
                        ₹{total}
                      </Typography>
                    </Box>

                    <Button
                      variant="contained"
                      fullWidth
                      size="large"
                      onClick={handleCheckout}
                      disabled={loadingButton}
                      startIcon={
                        loadingButton ? (
                          <CircularProgress size={18} color="inherit" />
                        ) : null
                      }
                      sx={{
                        mt: 3,
                        borderRadius: 2,
                        py: 1,
                        textTransform: "none",
                        fontSize: { xs: "0.9rem", sm: "1rem" },
                        background: "linear-gradient(90deg, #1976d2, #42a5f5)",
                        ":hover": {
                          background:
                            "linear-gradient(90deg, #1565c0, #1e88e5)",
                        },
                      }}
                    >
                      {loadingButton ? "Redirecting..." : "Pay"}
                    </Button>
                  </Paper>
                </Box>
              ) : null}
            </Box>
          )}
        </Paper>
      </Container>
      <AppDialog />
    </Box>
  );
};

export default Cart;
