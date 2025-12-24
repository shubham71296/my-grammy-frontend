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

import guitarImg from "../../assets/guitar.jpg";

import CommonCard from "../../components/ui/card/CommonCard";
import LocationMap from "../../components/ui/LocationMap";
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
  const isSm = useMediaQuery(theme.breakpoints.down("sm"));
  const isMd = useMediaQuery(theme.breakpoints.down("md"));

  const [instrumentList, setInstrumentList] = useState([]);
  const [courseList, setCourseList] = useState([]);
  const [limit, setLimit] = useState(4);
  const [offset, setOffset] = useState(0);
  const [query, setQuery] = useState({});

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

      const response = await api.post("/admin/allcourses", body);
      setCourseList(response.data.data || []);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  return (
    <div>
      <Box
        component="section"
        aria-label="Hero banner"
        sx={{
          mt: 4,
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

        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.45)",
            zIndex: 1,
          }}
        />

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

      <Container sx={{ py: { xs: 3, md: 5 } }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, sm: 3, md: 4 },
            textAlign: "center",
            borderRadius: 3,
            background: "linear-gradient(135deg, #02025e, #5b5bff)",
            color: "#fff",
          }}
        >
          <Typography
            variant="h4"
            fontWeight={800}
            sx={{
              fontSize: {
                xs: "1.2rem",
                sm: "1.6rem",
                md: "1.6rem",
              },
              mb: 1,
            }}
          >
            Buy Any Instrument & Get Course related to that instrument FREE 🎶
          </Typography>

          <Typography
            variant="body1"
            sx={{
              maxWidth: 720,
              mx: "auto",
              opacity: 0.95,
              fontSize: {
                xs: "0.85rem",
                sm: "0.95rem",
                md: "1.05rem",
              },
            }}
          >
            When you purchase any instrument, the course related to that
            instrument is absolutely <strong>FREE</strong>. Learn faster with
            the perfect instrument–course combo.
          </Typography>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent="center"
            sx={{ mt: 3 }}
          >
            <Button
              component={Link}
              to="/user/instruments"
              variant="contained"
              sx={{
                bgcolor: "#fff",
                color: "#02025e",
                fontWeight: 700,
                borderRadius: "30px",
                px: 4,
                "&:hover": {
                  bgcolor: "#f0f0ff",
                },
              }}
            >
              Buy Instrument
            </Button>

            <Button
              component={Link}
              to="/user/courses"
              variant="outlined"
              sx={{
                borderColor: "#fff",
                color: "#fff",
                fontWeight: 700,
                borderRadius: "30px",
                px: 4,
                "&:hover": {
                  bgcolor: "rgba(255,255,255,0.1)",
                },
              }}
            >
              View Courses
            </Button>
          </Stack>
        </Paper>
      </Container>

      {/* <Container sx={{ py: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "flex-start", sm: "center" },
            mb: 2,
            gap: 2,
          }}
        >
          <Typography variant="h5" fontWeight={700}>
            Featured Instruments
          </Typography>
          <Button
            variant="outlined"
            sx={{
              borderColor: "#02025e",
              color: "#02025e",
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
              color: "#1b085cff",
              fontWeight: 200,
              margin: "0 auto",
              marginBottom: "0",
              fontSize: { xs: "13.5px", sm: "15px", md: "18px" },
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
                navTo={`/user/instrument/${it._id}`}
              />
            </Grid>
          ))}
        </Grid>
      </Container> */}
      <Container sx={{ py: { xs: 4, md: 6 } }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "flex-start", sm: "center" },
            mb: 3,
            gap: 2,
          }}
        >
          <Box>
            <Typography
              variant="h4"
              fontWeight={800}
              sx={{
                color: "#02025e",
                fontSize: { xs: "1.6rem", sm: "2rem" },
              }}
            >
              Featured Instruments
            </Typography>

            <Typography
              variant="body2"
              sx={{
                mt: 0.5,
                color: "text.secondary",
                maxWidth: 480,
              }}
            >
              Hand-picked instruments designed to inspire creativity and
              accelerate your musical journey.
            </Typography>
          </Box>

          <Button
            component={Link}
            to="/user/instruments"
            variant="contained"
            size="medium"
            sx={{
              borderRadius: "30px",
              px: 3.5,
              fontWeight: 700,
              textTransform: "none",
              background: "linear-gradient(90deg, #02025e, #5b5bff)",
              boxShadow: "0 8px 24px rgba(2,2,94,0.25)",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 12px 30px rgba(2,2,94,0.35)",
              },
              transition: "all 0.3s ease",
            }}
          >
            View All
          </Button>
        </Box>

        {/* Description Card */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, sm: 3 },
            mb: 4,
            borderRadius: 3,
            background: "rgba(2, 2, 94, 0.04)",
            //border: "1px solid rgba(2, 2, 94, 0.1)",
            borderLeft: 3,
          }}
        >
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: "14px", sm: "16px", md: "18px" },
              lineHeight: 1.8,
              color: "#1b085c",
              //textAlign: "center",
              maxWidth: 900,
              //mx: "auto",
            }}
          >
            Our featured instruments are carefully curated to offer the perfect
            balance of sound quality, comfort, and durability. Whether you're a
            beginner or an advanced learner, each instrument is chosen to help
            you learn faster and play with confidence.
          </Typography>
        </Paper>

        {/* Instruments Grid */}
        <Grid container spacing={3}>
          {instrumentList.map((it, idx) => (
            <Grid item xs={12} sm={6} md={4} key={it._id}>
              <Box
                sx={{
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-6px)",
                  },
                }}
              >
                <CommonCard
                  it={it}
                  idx={idx}
                  onAddToCart={() => addToCart(it, "instrument")}
                  navTo={`/user/instrument/${it._id}`}
                />
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Container sx={{ py: { xs: 4, md: 6 } }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "flex-start", sm: "center" },
            mb: { xs: 2.5, md: 3.5 },
            gap: 2,
          }}
        >
          <Box>
            <Typography
              variant="h4"
              fontWeight={800}
              sx={{
                fontSize: { xs: "1.4rem", sm: "1.7rem", md: "2rem" },
                color: "#02025e",
              }}
            >
              Popular Courses
            </Typography>

            <Typography
              variant="body2"
              sx={{
                mt: 0.6,
                color: "#6b7280",
                maxWidth: "520px",
                fontSize: { xs: "0.85rem", sm: "0.95rem" },
              }}
            >
              Learn from expertly crafted courses designed to help you grow
              musically.
            </Typography>
          </Box>

          <Button
            component={Link}
            to="/user/courses"
            size="medium"
            sx={{
              px: 3,
              py: 1,
              borderRadius: "999px",
              fontWeight: 600,
              textTransform: "none",
              background: "linear-gradient(135deg, #02025e, #1e40af)",
              color: "#fff",
              boxShadow: "0 8px 20px rgba(2,2,94,0.25)",
              "&:hover": {
                background: "linear-gradient(135deg, #01013d, #1e3a8a)",
                boxShadow: "0 12px 28px rgba(2,2,94,0.35)",
              },
            }}
          >
            View all
          </Button>
        </Box>

        {/* Description */}
        <Box
          sx={{
            //maxWidth: "900px",
            mb: { xs: 3, md: 4 },
            p: { xs: 2, sm: 2.5 },
            borderRadius: "14px",
            background:
              "linear-gradient(90deg, rgba(2,2,94,0.06), rgba(30,64,175,0.02))",
            borderLeft: "4px solid #02025e",
          }}
        >
          <Typography
            sx={{
              lineHeight: 1.9,
              color: "#374151",
              fontWeight: 400,
              fontSize: { xs: "0.95rem", sm: "1.05rem", md: "1.1rem" },
              letterSpacing: "0.2px",
            }}
          >
            Explore our most popular courses, crafted to help learners grow with{" "}
            <Box component="span" sx={{ fontWeight: 600, color: "#02025e" }}>
              clarity
            </Box>
            ,{" "}
            <Box component="span" sx={{ fontWeight: 600, color: "#02025e" }}>
              confidence
            </Box>
            , and{" "}
            <Box component="span" sx={{ fontWeight: 600, color: "#02025e" }}>
              creativity
            </Box>
            . Each course blends engaging lessons, practical guidance, and
            real-world application — ensuring a meaningful and enjoyable
            learning experience for every student.
          </Typography>
        </Box>

        {/* Courses Grid */}
        <Grid container spacing={{ xs: 2.5, md: 3 }}>
          {courseList.map((course, idx) => (
            <Grid item xs={12} sm={6} md={4} key={course._id}>
              <Box
                sx={{
                  height: "100%",
                  transition: "all .35s ease",
                  "&:hover": {
                    transform: "translateY(-6px)",
                  },
                }}
              >
                <CourseCard
                  type="user"
                  idx={idx}
                  course={course}
                  onAddToCart={() => addToCart(course, "course")}
                  onEdit={handleEditLecture}
                  onDelete={handleDeleteLecture}
                />
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

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

      <Container sx={{ py: { xs: 4, md: 6 } }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "flex-start", sm: "center" },
            mb: { xs: 2.5, md: 3.5 },
            gap: 2,
          }}
        >
          <Box>
            <Typography
              variant="h4"
              fontWeight={800}
              sx={{
                fontSize: { xs: "1.4rem", sm: "1.7rem", md: "2rem" },
                color: "#02025e",
              }}
            >
              Visit our Location
            </Typography>

            <Typography
              variant="body2"
              sx={{
                mt: 0.6,
                color: "#6b7280",
                maxWidth: "520px",
                fontSize: { xs: "0.85rem", sm: "0.95rem" },
              }}
            >
              Discover a welcoming space where music comes alive and learning
              feels inspiring.
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            mb: { xs: 3, md: 4 },
            p: { xs: 2, sm: 2.5 },
            borderRadius: "14px",
            background:
              "linear-gradient(90deg, rgba(2,2,94,0.06), rgba(30,64,175,0.02))",
            borderLeft: "4px solid #02025e",
          }}
        >
          <Typography
            sx={{
              lineHeight: 1.9,
              color: "#374151",
              fontWeight: 400,
              fontSize: { xs: "0.95rem", sm: "1.05rem", md: "1.1rem" },
              letterSpacing: "0.2px",
            }}
          >
            Visit our academy and experience music learning in a{" "}
            <Box component="span" sx={{ fontWeight: 600, color: "#02025e" }}>
              welcoming
            </Box>
            ,{" "}
            <Box component="span" sx={{ fontWeight: 600, color: "#02025e" }}>
              creative
            </Box>{" "}
            and{" "}
            <Box component="span" sx={{ fontWeight: 600, color: "#02025e" }}>
              inspiring
            </Box>{" "}
            environment. Our location is thoughtfully designed to provide
            students with a comfortable space where passion meets practice.
            <br />
            <br />
            Conveniently located in{" "}
            <Box component="span" sx={{ fontWeight: 600, color: "#02025e" }}>
              Indore
            </Box>
            , our academy is easily accessible and equipped with modern
            classrooms, professional instruments, and expert mentors to guide
            you at every step. Whether you're a beginner or an advanced learner,
            we invite you to visit us and begin your musical journey with
            confidence.
          </Typography>
        </Box>

        <LocationMap city="Maestro Music Classes - Flute, Guitar, Piano & Singing Academy, Indore" />
      </Container>
    </div>
  );
}
