// src/pages/Instruments.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Paper,
  Divider,
  TextField,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { LibraryMusic } from "@mui/icons-material";
import CommonCard from "../../components/ui/card/CommonCard";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { increaseCartCount } from "../../features/cartSlice";
import api from "../../api/axios";

const Instruments = () => {
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [instrumentList, setInstrumentList] = useState([]);
  const [search, setSearch] = useState("");

  const addToCart = async (item, type) => {
    try {
      // const response = await axios.post(
      //   "/api/user/addtocart",
      //   {
      //     productId: item._id,
      //     productType: type,
      //   },
      //   {
      //     headers: {
      //       Authorization: `Bearer ${token}`,
      //     },
      //   }
      // );
      const response = await api.post(
        "/user/addtocart",
        {
          productId: item._id,
          productType: type,
        }
      );
      toast.success(response.data.msg);
      dispatch(increaseCartCount());
    } catch (err) {
      console.log("error", err);
      const errorMsg = err?.response?.data?.msg || "Something went wrong!";
      toast.error(errorMsg);
    }
  };

  useEffect(() => {
    getAllInstrumentsData({});
  }, []);

  // Fetch API
  const getAllInstrumentsData = async (queryVal = {}) => {
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

      // const response = await axios.post("/api/admin/allinstumnts", body);
      const response = await api.post("/admin/allinstumnts", body);
      setInstrumentList(response.data.data || []);
    } catch (error) {
      console.error("Error fetching instruments:", error);
    }
  };

  // When user types in search
  useEffect(() => {
    const q = search.trim();

    if (q === "") {
      getAllInstrumentsData({});
      return;
    }

    const queryObj = {};

    // If numeric → treat as price
    if (!isNaN(q)) {
      queryObj.instrument_price = Number(q);
    } else {
      // Search title using regex
      queryObj.instrument_title = { $regex: q, $options: "i" };
    }

    getAllInstrumentsData(queryObj);
  }, [search]);

  return (
    <Box sx={{ backgroundColor: "#f8f9fc", minHeight: "100vh", py: 6 }}>
      <Container maxWidth="lg">
        <Paper elevation={4} sx={{ p: 3, borderRadius: 3 }}>
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
                flexWrap: "wrap",
   fontSize: { xs: "1.1rem", sm: "1.4rem" },
            }}
          >
            <LibraryMusic />
            Our Instruments
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
                  Search Instruments
                </Typography>

                <TextField
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search instruments by title or price..."
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
                  List of Instruments
                </Typography>
                <Divider />
              </Box>
          
         

          {/* Card List */}
          <Grid container spacing={3} mt={2}>
            {/* {instrumentList.map((it, idx) => (
                        <Grid item xs={12} sm={6} md={4} key={it._id}>
                          <CommonCard
                            it={it}
                            idx={idx}
                            onAddToCart={() => addToCart(it, "instrument")}
                            // title={it.instrument_title}
                            // description={it.instrurment_description}
                            // //image={it.instrument_images}
                            // image={it.instrument_images?.[0]?.url}
                            // price={it.instrument_price}
                            navTo={`/user/instrument/${it._id}`}
                          />
                        </Grid>
                      ))} */}
            {instrumentList.map((it, idx) => (
              <Grid item xs={12} sm={6} md={4} key={it._id}>
                <CommonCard
                  it={it}
                  idx={idx}
                  onAddToCart={() => addToCart(it, "instrument")}
                  // title={it.instrument_title}
                  // description={it.instrurment_description}
                  // image={it.instrument_images?.[0]?.url}
                  // price={it.instrument_price}
                  navTo={`/user/instrument/${it._id}`}
                />
              </Grid>
            ))}

            {/* No Data */}
            {instrumentList.length === 0 && (
              <Typography
                textAlign="center"
                width="100%"
                py={10}
                color="gray"
                fontSize="18px"
              >
                No instruments found
              </Typography>
            )}
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default Instruments;
