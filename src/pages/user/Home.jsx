import React, { useEffect, useState } from "react";
import {
  Typography,
  Button,
  Box,
  Container,
  Grid,
  useTheme,
  useMediaQuery,
  Paper,
  Avatar,
  Stack,
  Divider,
} from "@mui/material";
import { Link } from "react-router-dom";
import bannerImg from "../../assets/bannerImg.JPG";

// instrument images
import guitarImg from "../../assets/guitar.jpg";

import CommonCard from "../../components/ui/card/CommonCard";
import axios from "axios";
import CourseCard from "../../components/ui/card/CourseCard";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { increaseCartCount } from "../../features/cartSlice";
import api from "../../api/axios";

export default function Home() {
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down("sm")); // phones
  const isMd = useMediaQuery(theme.breakpoints.down("md")); // tablets and below

  const [instrumentList, setInstrumentList] = useState([]);
  const [courseList, setCourseList] = useState([]);
  const [limit, setLimit] = useState(4);
  const [offset, setOffset] = useState(0);
  const [query, setQuery] = useState({}); // empty means get all

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
    getAllInstrumentsData(limit, offset, query);
    getAllCoursesData({});
  }, []);

  const getAllInstrumentsData = async (limitVal, offsetVal, queryVal = {}) => {
    try {
      const body = {
        query: queryVal,
        projection: { pwd: 0 },
        options: {
          skip: offsetVal,
          limit: limitVal,
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

  const handleEditLecture = (course) => {};

  const handleDeleteLecture = (course) => {};

  const getAllCoursesData = async (queryVal = {}) => {
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

      // const response = await axios.post("/api/admin/allcourses", body, {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //   },
      // });
      const response = await api.post("/admin/allcourses", body);
      setCourseList(response.data.data || []);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  return (
    <div>
      {/* Banner */}
      <Box
        component="section"
        aria-label="Hero banner"
        sx={{
          mt:4,
          height: { xs: "50vh", sm: "50vh", md: "60vh", lg: "68vh" },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          color: "#fff",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* blurred background image */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${bannerImg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(3px)",
            transform: "scale(1.06)",
            zIndex: 0,
          }}
        />

        {/* dark overlay for contrast */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.45)",
            zIndex: 1,
          }}
        />

        {/* foreground content */}
        <Box
          sx={{
            position: "relative",
            zIndex: 2,
            px: { xs: 2, sm: 4 },
            width: "100%",
            maxWidth: 1100,
          }}
        >
          <Typography
            component="h1"
            variant="h2"
            fontWeight={800}
            gutterBottom
            sx={{
              // responsive font sizes and line-height
              fontSize: {
                xs: "1.45rem",
                sm: "1.9rem",
                md: "2.6rem",
                lg: "3rem",
              },
              lineHeight: { xs: 1.08, sm: 1.03, md: 1.02 },
              mb: { xs: 1, sm: 1.5, md: 2 },
              textShadow: "0 6px 18px rgba(0,0,0,0.45)",
            }}
          >
            Welcome to Our Music World
          </Typography>

          <Typography
            variant="h6"
            component="p"
            sx={{
              fontSize: { xs: "0.95rem", sm: "1.05rem", md: "1.15rem" },
              maxWidth: { xs: "95%", sm: 640 },
              mx: "auto",
              color: "rgba(255,255,255,0.95)",
              mb: { xs: 2, sm: 3 },
            }}
          >
            Discover premium instruments and professional courses that help you
            master your musical passion.
          </Typography>

          {/* CTAs: stacked on mobile, inline on larger screens */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={{ xs: 1.25, sm: 2 }}
            justifyContent="center"
            alignItems="center"
            sx={{ mt: 0.5 }}
          >
            <Button
              component={Link}
              to="/user/instruments"
              variant="contained"
              size={isSm ? "medium" : "large"}
              fullWidth={isSm}
              sx={{
                borderRadius: "30px",
                px: { xs: 2.5, sm: 4 },
                py: { xs: 0.9, sm: 1.1 },
                fontWeight: 700,
                boxShadow: "0 10px 30px rgba(25,118,210,0.14)",
                textTransform: "none",
              }}
            >
              Browse Instruments
            </Button>

            <Button
              component={Link}
              to="/user/courses"
              variant="outlined"
              size={isSm ? "medium" : "large"}
              fullWidth={isSm}
              sx={{
                borderRadius: "30px",
                px: { xs: 2.5, sm: 4 },
                py: { xs: 0.9, sm: 1.1 },
                fontWeight: 700,
                textTransform: "none",
                color: "#fff",
                borderColor: "rgba(255,255,255,0.18)",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.04)",
                  borderColor: "rgba(255,255,255,0.28)",
                },
              }}
            >
              View Courses
            </Button>
          </Stack>
        </Box>
      </Box>

      {/* Quick Stats / Trust */}
      <Container sx={{ py: 4 }}>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={6} sm={3}>
            <Paper elevation={1} sx={{ p: 2, textAlign: "center" }}>
              <Typography variant="h5" fontWeight={700}>
                10+
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Happy Students
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Paper elevation={1} sx={{ p: 2, textAlign: "center" }}>
              <Typography variant="h5" fontWeight={700}>
                20+
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Instruments Sold
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Paper elevation={1} sx={{ p: 2, textAlign: "center" }}>
              <Typography variant="h5" fontWeight={700}>
                4.9/5
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Average Rating
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Featured Instruments */}
      <Container sx={{ py: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            //alignItems: "center",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "flex-start", sm: "center" },
            mb: 2,
            gap: 2,
          }}
        >
          <Typography variant="h5" fontWeight={700} >
            Featured Instruments
          </Typography>
          <Button
            variant="outlined"
            sx={{
              borderColor: "#02025e", // custom outline color
              color: "#02025e", // text color
              fontWeight: 600,
              textTransform: "none",
              borderRadius: "8px",
              "&:hover": {
                backgroundColor: "#02025e",
                color: "#fff",
                borderColor: "#02025e",
              },
            }}
            component={Link}
            to="/user/instruments"
            size="small"
          >
            View all
          </Button>
        </Box>

        <Divider />

        <Paper
          elevation={3}
          sx={{
            p: { xs: 2, sm: 3 },
            mt: 2,
            mb: 3,
            borderRadius: 2,
            backgroundColor: "#fefefe",
          }}
        >
          <Typography
            variant="body1"
            sx={{
              //fontSize: { xs: "14px", sm: "16px", md: "18px" },
              color: "#1b085cff",
              fontWeight: 200,
              margin: "0 auto",
              marginBottom: "0",
              fontSize: { xs: "13.5px", sm: "15px", md: "18px" },
              //lineHeight: 1.8,
            }}
          >
            Our featured instruments are carefully selected to provide students
            with the perfect blend of quality, comfort, and musical expression.
            Each instrument is chosen for its rich sound, ease of learning, and
            ability to inspire creativity in learners of all ages.
          </Typography>
        </Paper>

        <Grid container spacing={2}>
          {instrumentList.map((it, idx) => (
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
          ))}
        </Grid>
      </Container>

      {/* Featured Courses */}
      <Container sx={{ py: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            //alignItems: "center",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "flex-start", sm: "center" },
            mb: 2,
            gap: 2,
          }}
        >
          <Typography variant="h5" fontWeight={700}>
            Popular Courses
          </Typography>
          <Button
            variant="outlined"
            sx={{
              borderColor: "#02025e", // custom outline color
              color: "#02025e", // text color
              fontWeight: 600,
              textTransform: "none",
              borderRadius: "8px",
              "&:hover": {
                backgroundColor: "#02025e",
                color: "#fff",
                borderColor: "#02025e",
              },
            }}
            component={Link}
            to="/user/courses"
            size="small"
          >
            View all courses
          </Button>
        </Box>

        <Typography
          variant="body2"
          sx={{
            //fontSize: { xs: "14px", sm: "16px", md: "18px" },
            lineHeight: 1.8,
            color: "#706c6cff",
            fontWeight: 400,
            //textAlign: "center",
            //maxWidth: "800px",
            margin: "0 auto",
            marginBottom: "30px",
            fontSize: { xs: "13.5px", sm: "15px", md: "18px" },
            //padding: "0 16px",
            letterSpacing: "0.3px",
          }}
        >
          Explore our most popular courses, crafted to help learners grow with
          clarity, confidence, and creativity. Each course is designed to offer
          a perfect blend of engaging lessons, practical guidance, and
          real-world application — ensuring that every student receives a
          meaningful and enjoyable learning experience. Whether you're starting
          your journey or looking to level up your skills, our popular courses
          provide the inspiration and structure you need to achieve your musical
          goals.
        </Typography>

        <Grid container spacing={3} mt={2}>
          {courseList.map((course, idx) => (
            <Grid item xs={12} sm={6} md={4} key={course._id}>
              <CourseCard
                type="user"
                idx={idx}
                course={course}
                onAddToCart={() => addToCart(course, "course")}
                onEdit={handleEditLecture}
                onDelete={handleDeleteLecture}
              />
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Testimonial / CTA */}
      <Container sx={{ py: 6 }}>
        <Paper
          elevation={2}
          sx={{
            p: { xs: 2, md: 4 },
            display: "flex",
            gap: 3,
            alignItems: "center",
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          <Avatar
            src={guitarImg}
            alt="student"
            sx={{ width: 72, height: 72 }}
          />
          <Box>
            <Typography variant="h6" fontWeight={700}>
              What our students say
            </Typography>
            <Typography variant="body2" color="text.secondary">
              "Amazing lessons and friendly instructors — I went from zero to
              playing my first song in 6 weeks!"
            </Typography>
          </Box>
          <Box sx={{ ml: "auto", mt: { xs: 2, md: 0 } }}>
            <Button component={Link} to="/user/courses" variant="contained">
              Start Learning
            </Button>
          </Box>
        </Paper>
      </Container>
    </div>
  );
}
