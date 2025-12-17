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


const Cart = () => {
  const { token } = useSelector((state) => state.auth);
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
      // const response = await axios.get("/api/user/getcartitems", {
      //   headers: { Authorization: `Bearer ${token}` },
      // });
      const response = await api.get("/user/getcartitems");
      const payload = response?.data?.data;
      console.log("payload response cart", response)
      //console.log("payload",payload)
      setCart(payload);
      //dispatch(setCartCount(payload.items.length));
    } catch (err) {
      console.log("Error fetching cart details:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleIncrease = async (item) => {
    console.log("item on increase", item);
    try {
      // const res = await axios.post(
      //   "/api/user/increasequantity",
      //   { productId: item.productId._id, productType: item.productType },
      //   { headers: { Authorization: `Bearer ${token}` } }
      // );
       const res = await api.post(
        "/user/increasequantity",
        { productId: item.productId._id, productType: item.productType }
      );

      const updatedCart = { ...cart }; // clone cart
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
      const res = await api.post(
        "/user/decreasequantity",
        { productId: item.productId._id, productType: item.productType }
      );

      const updatedCart = { ...cart }; // clone cart
      const index = updatedCart.items.findIndex(
        (i) => i.productId._id === item.productId._id
      );

      if (index !== -1) {
        if (updatedCart.items[index].qty > 1) {
          updatedCart.items[index].qty -= 1; // decrease quantity
        }
      }
      setCart(updatedCart);
    } catch (err) {
      console.log("Error increasing quantity:", err);
    }
  };

  const handleRemoveCart = async (item) => {
    try {
      // const res = await axios.post(
      //   "/api/user/removefromcart",
      //   { productId: item.productId._id, productType: item.productType },
      //   { headers: { Authorization: `Bearer ${token}` } }
      // );
      const res = await api.post(
        "/user/removefromcart",
        { productId: item.productId._id, productType: item.productType }
      );

      const updatedItems = cart.items.filter(
        (i) => i.productId._id !== item.productId._id
      );

      setCart({ ...cart, items: updatedItems });
      dispatch(setCartCount(updatedItems.length));
    } catch (err) {
      console.log("Error remove cart:", err);
    }
  };

  const subtotal = cart?.items?.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );
  const discount = 50; // Example discount

  // const total = subtotal - discount;
  const total = subtotal;
  
  
  const handleCheckout = async () => {
  try {
    setLoadingButton(true);
    // const res = await axios.post(
    //   "/api/user/create-checkout-session",
    //   {
    //     discount
    //   },
    //   { headers: { Authorization: `Bearer ${token}` } }
    // );
    const res = await api.post(
      "/user/create-checkout-session",
      {
        discount
      }
    );

    window.location.href = res.data.url;
  } catch (err) {
    console.log(err);
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
          {/* Header */}
          <Box mb={4}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: "#1976d2",
                display: "flex",
                alignItems: "center",
                gap: 1,
                fontSize: { xs: "1.1rem", sm: "1.4rem" },
              }}
            >
              <MenuBook fontSize="medium" /> My Cart
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
              {/* Cart Items */}
              <Box sx={{ flex: 2 }}>
                {cart?.items?.map((item, index) => (
                  <CartItemCard
                    key={index}
                    item={item}
                    onRemove={() => handleRemoveCart(item)}
                    onIncrease={() => handleIncrease(item)}
                    onDecrease={() => handleDecrease(item)}
                  />
                ))}
              </Box>

              {/* Order Summary */}
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
                    sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
                  >
                    Order Summary
                  </Typography>

                  {/* <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography variant="body1">Subtotal</Typography>
                    <Typography variant="body1">₹{subtotal}</Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mt: 1,
                    }}
                  >
                    <Typography variant="body1">Discount</Typography>
                    <Typography variant="body1" color="success.main">
                      - ₹{discount}
                    </Typography>
                  </Box> */}

                  <Divider sx={{ my: 2 }} />

                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography variant="h6" fontWeight={700} sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}>
                      Total
                    </Typography>
                    <Typography variant="h6" fontWeight={700} color="#1976d2" sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}>
                      ₹{total}
                    </Typography>
                  </Box>

                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    onClick={handleCheckout}
                    disabled={loadingButton}
                    startIcon={loadingButton ? <CircularProgress size={18} color="inherit" /> : null}
                    sx={{
                      mt: 3,
                      borderRadius: 2,
                      py: 1.5,
                      textTransform: "none",
                      fontSize: { xs: "0.95rem", sm: "1rem" },
                      background: "linear-gradient(90deg, #1976d2, #42a5f5)",
                      ":hover": {
                        background: "linear-gradient(90deg, #1565c0, #1e88e5)",
                      },
                    }}
                  >
                    {loadingButton ? "Redirecting..." : "Pay"}
                  </Button>
                </Paper>
              </Box>
              ): null}
             
            </Box>
          )}
        </Paper>
      </Container>
      <AppDialog />
    </Box>
  );
};

export default Cart;
