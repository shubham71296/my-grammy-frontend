import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Divider,
  Chip,
  TextField,
  InputAdornment,
} from "@mui/material";
import {
  LibraryMusic,
  ReceiptLong,
  SearchOutlined,
  ShoppingBag,
} from "@mui/icons-material";
import SearchIcon from "@mui/icons-material/Search";
import { useSelector } from "react-redux";
import axios from "axios";
import api from "../../api/axios";


const MyOrders = () => {
  const { token } = useSelector((state) => state.auth);
  const [orderList, setOrderList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getAllOrdersData();
  }, []);

  const getAllOrdersData = async (queryVal = {}) => {
    console.log("queryVal", queryVal);
    try {
      const body = {
        query: queryVal,
        projection: {},
        options: {
          skip: 0,
          limit: 0,
          sort: { createdAt: -1 },
        },
      };

      // const response = await axios.post("/api/user/getmyorders", body, {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //   },
      // });
      const response = await api.post("/user/getmyorders", body);

      setOrderList(response.data.data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "success";
      case "pending":
        return "warning";
      case "failed":
        return "error";
      default:
        return "default";
    }
  };

  useEffect(() => {
    const q = search.trim();
    if (q === "") {
      getAllOrdersData({});
      return;
    }
    const queryObj = {};

    if (!isNaN(q)) {
      // numeric search → amount
      queryObj.amount = Number(q);
    } else {
      // text search → search inside items title
      queryObj["items.title"] = { $regex: q, $options: "i" };
    }

    getAllOrdersData(queryObj);
  }, [search]);

  return (
    <Box sx={{ backgroundColor: "#eef2f7", minHeight: "100vh", py: 6 }}>
      <Container maxWidth="lg">
        <Paper
          elevation={4}
          sx={{
            p: 2,
            borderRadius: 2,
            background: "linear-gradient(135deg, #ffffff, #f3f6fb)",
          }}
        >
          {/* Header */}
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              color: "#1976d2",
              display: "flex",
              alignItems: "center",
              gap: 1,
              mb: 1,
              fontSize: { xs: "1.1rem", sm: "1.4rem" },
            }}
          >
            <ShoppingBag />
            My Orders
          </Typography>

          <Divider sx={{ mb: 3 }} />

              <Paper
                elevation={2}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  mb: 3,
                  background: "white",
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: "bold", mb: 1, color: "primary.main" }}
                >
                  Search Orders
                </Typography>
                <TextField
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search orders by title..."
                  size="small"
                  fullWidth
                  sx={{ width: { xs: "100%", sm: 500 } }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Paper>

              <Box sx={{ mt: 2 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    letterSpacing: "0.5px",
                    color: "#1976d2",
                    borderLeft: "5px solid #1976d2",
                    pl: 2,
                    fontSize: { xs: "1rem", sm: "1.25rem" },
                  }}
                >
                  List of Orders
                </Typography>
                <Divider />
              </Box>
         

          {loading ? (
            <Typography
              variant="h6"
              align="center"
              sx={{ color: "#777", py: 5 }}
            >
              Loading orders...
            </Typography>
          ) : orderList.length === 0 ? (
            <Typography
              textAlign="center"
              width="100%"
              py={10}
              color="gray"
              fontSize="18px"
            >
              No orders found.
            </Typography>
          ) : (
            orderList.map((order) => (
              <Paper
                key={order._id}
                elevation={3}
                sx={{
                  p: 2,
                  mb: 3,
                  mt: 3,
                  borderRadius: 3,
                  transition: "0.3s",
                  cursor: "pointer",
                  "&:hover": {
                    transform: "scale(1.01)",
                    boxShadow: "0px 10px 22px rgba(0,0,0,0.15)",
                  },
                }}
              >
                {/* Order Header */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1,
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 700, color: "#333" }}
                  >
                    <ReceiptLong sx={{ mr: 1 }} />
                    Order ID: {order._id}
                  </Typography>

                  <Chip
                    label={order.paymentStatus.toUpperCase()}
                    color={getStatusColor(order.paymentStatus)}
                    size="small"
                    sx={{ fontWeight: 600 }}
                  />
                </Box>

                {/* Amount */}
                <Typography
                  variant="body1"
                  sx={{
                    mb: 2,
                    fontWeight: 600,
                    color: "#444",
                  }}
                >
                  Total Amount:{" "}
                  <span style={{ color: "#1976d2" }}>
                    ₹{order.amount} {order.currency}
                  </span>
                </Typography>

                <Divider sx={{ my: 2 }} />

                {/* Items */}
                {order.items.map((item, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      mb: 2,
                      p: 1.2,
                      borderRadius: 2,
                      border: "1px solid #e0e0e0",
                      backgroundColor: "#fafafa",
                    }}
                  >
                    <img
                      src={item.thumbnail?.[0]?.url}
                      alt={item.title}
                      style={{
                        width: "65px",
                        height: "65px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        boxShadow: "0 3px 6px rgba(0,0,0,0.12)",
                      }}
                    />

                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        {item.title}
                      </Typography>
                      
                      {item.price !== 0 && (
                        <Typography variant="body2" sx={{ color: "#555" }}>
                          Qty: {item.qty}
                        </Typography>
                      )}

                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 700, color: "#1976d2" }}
                      >
                        {/* ₹{item.price} */}
                        {item.price === 0 ? "Free Course With this Instrument" : `₹${item.price}`}
                      </Typography>
                    </Box>
                  </Box>
                ))}

                <Divider sx={{ mt: 2 }} />

                {/* Footer */}
                <Typography variant="caption" sx={{ color: "#666" }}>
                  Ordered on: {new Date(order.createdAt).toLocaleString()}
                </Typography>
              </Paper>
            ))
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default MyOrders;
