import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  Stack,
  Divider,
  Paper,
  Chip,
} from "@mui/material";
import { ArrowBack, LibraryMusic, ShoppingCart } from "@mui/icons-material";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { increaseCartCount } from "../../features/cartSlice";
import { useDispatch } from "react-redux";

const InstrumentDetail = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();

  const [instrument, setInstrument] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {
    getInstrumentDetails(id);
  }, [id]);

  const getInstrumentDetails = async (id) => {
    try {
      const response = await api.get(`/admin/instumntbyid/${id}`);
      const data = response.data?.data;
      setInstrument(data);

      if (data?.instrument_images?.length > 0) {
        setSelectedImage(data.instrument_images[0].url);
      }
    } catch (error) {
      console.error("Error fetching instruments:", error);
    }
  };

  const addToCart = async (item, type) => {
    try {
      const response = await api.post("/user/addtocart", {
        productId: item._id,
        productType: type,
      });
      toast.success(response.data.msg);
      dispatch(increaseCartCount());
    } catch (err) {
      console.log("error", err);
      const errorMsg = err?.response?.data?.msg || "Something went wrong!";
      toast.error(errorMsg);
    }
  };

  if (!instrument) {
    return (
      <Container sx={{ py: 10, textAlign: "center" }}>
        <Typography variant="h6" color="error">
          Instrument not found.
        </Typography>
        <Button
          sx={{ mt: 2 }}
          variant="contained"
          onClick={() => navigate("/instruments")}
        >
          Go Back
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ backgroundColor: "#f8f9fc", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="lg">
        <Paper elevation={4} sx={{ p: 3, borderRadius: 2 }}>
          <Box mb={3}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                color: "#1976d2",
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
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
              <LibraryMusic
                sx={{
                  fontSize: {
                    xs: "1.1rem",
                    sm: "1.4rem",
                    md: "1.6rem",
                  },
                  flexShrink: 0,
                }}
              />
              Instrument Detail - {instrument.instrument_title}
            </Typography>

            <Divider
              sx={{
                mt: 1,
                mb: 5,
                borderColor: "#1976d2",
                borderWidth: "1px",
                borderRadius: 1,
              }}
            />
          </Box>

          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  borderRadius: 3,
                  overflow: "hidden",
                  cursor: "pointer",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
                  transition: "transform 0.2s ease",
                  mb: 2,
                  "&:hover": { transform: "scale(1.03)" },
                }}
              >
                <CardMedia
                  component="img"
                  image={selectedImage}
                  alt={instrument.instrument_title}
                  sx={{
                    objectFit: "cover",
                    height: { xs: 220, sm: 280, md: 300 },
                  }}
                />
              </Card>

              <Grid container spacing={1}>
                {instrument.instrument_images?.map((img, index) => (
                  <Grid item xs={3} sm={2} key={index}>
                    <Box
                      sx={{
                        borderRadius: 2,
                        overflow: "hidden",
                        cursor: "pointer",
                        border:
                          selectedImage === img.url
                            ? "3px solid #1976d2"
                            : "2px solid #ddd",
                        transition: "0.3s",
                        "&:hover": { borderColor: "#1976d2" },
                      }}
                      onClick={() => setSelectedImage(img.url)}
                    >
                      <CardMedia
                        component="img"
                        image={img.url}
                        sx={{
                          height: 70,
                          width: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography
                variant="h5"
                fontWeight={700}
                sx={{
                  fontSize: {
                    xs: "1.2rem",
                    sm: "1.5rem",
                    md: "1.8rem",
                  },
                }}
              >
                {instrument.instrument_title}1
              </Typography>

              <Chip
                label={`₹${instrument.instrument_price || 0}`}
                color="primary"
                sx={{
                  mt: 2,
                  fontSize: {
                    xs: "0.8rem",
                    sm: "0.9rem",
                    md: "1rem",
                  },
                }}
              />

              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ mt: 2, lineHeight: 1.7 }}
              >
                {instrument.instrurment_description ||
                  instrument.instrument_description ||
                  "A beautifully crafted musical instrument."}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Stack component="ul" sx={{ pl: 2, mb: 2 }}>
                <Typography
                  component="li"
                  variant="body2"
                  sx={{
                    fontSize: {
                      xs: "0.8rem",
                      sm: "0.9rem",
                    },
                  }}
                  color="text.secondary"
                >
                  Smooth playability & ergonomic design
                </Typography>
                <Typography
                  component="li"
                  variant="body2"
                  sx={{
                    fontSize: {
                      xs: "0.8rem",
                      sm: "0.9rem",
                    },
                  }}
                  color="text.secondary"
                >
                  Rich, balanced tone ideal for any level
                </Typography>
                <Typography
                  component="li"
                  variant="body2"
                  sx={{
                    fontSize: {
                      xs: "0.8rem",
                      sm: "0.9rem",
                    },
                  }}
                  color="text.secondary"
                >
                  High-quality craftsmanship
                </Typography>
              </Stack>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                sx={{ mt: 2 }}
              >
                <Button
                  variant="outlined"
                  startIcon={<ArrowBack />}
                  sx={{
                    fontSize: { xs: "0.85rem", sm: "0.95rem", md: "1rem" },
                    "& .MuiButton-startIcon > *": {
                      fontSize: { xs: 18, sm: 20, md: 22 },
                    },
                    textTransform: "none",
                    borderColor: "#1976d2",
                    color: "#1976d2",
                    fontWeight: 700,
                    px: 3,
                    borderRadius: "10px",
                    "&:hover": {
                      backgroundColor: "#1976d2",
                      color: "#fff",
                    },
                  }}
                  onClick={() => navigate(-1)}
                >
                  Back
                </Button>

                <Button
                  onClick={() => addToCart(instrument, "instrument")}
                  variant="contained"
                  startIcon={<ShoppingCart />}
                  sx={{
                    fontSize: { xs: "0.85rem", sm: "0.95rem", md: "1rem" },
                    "& .MuiButton-startIcon > *": {
                      fontSize: { xs: 18, sm: 20, md: 22 },
                    },
                    textTransform: "none",
                    fontWeight: 700,
                    px: 3,
                    borderRadius: "10px",
                  }}
                >
                  Add to Cart
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default InstrumentDetail;
