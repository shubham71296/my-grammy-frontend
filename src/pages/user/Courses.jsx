// src/pages/Courses.jsx
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
import CourseCard from "../../components/ui/card/CourseCard";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { increaseCartCount } from "../../features/cartSlice";
import toast from "react-hot-toast";
import { MenuBook } from "@mui/icons-material";
import api from "../../api/axios";


const Courses = () => {
  const { token } = useSelector((state) => state.auth);
  const [courseList, setCourseList] = useState([]);
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();

  const handleEditLecture = (course) => {};

  const handleDeleteLecture = (course) => {};

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
    getAllCoursesData({});
  }, []);

  // Fetch API
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

  // When user types in search
  useEffect(() => {
    const q = search.trim();

    if (q === "") {
      getAllCoursesData({});
      return;
    }

    const queryObj = {};

    // If numeric → treat as price
    if (!isNaN(q)) {
      queryObj.course_price = Number(q);
    } else {
      // Search title using regex
      queryObj.course_title = { $regex: q, $options: "i" };
    }

    getAllCoursesData(queryObj);
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
              fontSize: { xs: "1.1rem", sm: "1.4rem" },
              gap: 1,
              mb: 1,
            }}
          >
            <MenuBook />
            Courses
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
                  Search Courses
                </Typography>

                <TextField
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search courses by title or price..."
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

              {/* List Header */}
              <Box sx={{ mt: 2 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    letterSpacing: "0.5px",
                    color: "#1976d2",
                    borderLeft: "5px solid #1976d2",
                    fontSize: { xs: "1rem", sm: "1.25rem" },
                    pl: 2,
                  }}
                >
                  List of Courses
                </Typography>
                <Divider />
              </Box>
      

          {/* Search */}

          {/* Card List */}
          <Grid container spacing={3} mt={2}>
            {courseList.length > 0 ? (
              courseList.map((course, idx) => (
                <Grid item xs={12} sm={6} md={4} key={course.id}>
                  {/* <CommonCard
                    title={course.title}
                    description={course.description}
                    image={course.image}
                    price={course.price}
                    navTo={`/courses/${course.id}`}
                  /> */}

                  <CourseCard
                    type="user"
                    idx={idx}
                    course={course}
                    onEdit={handleEditLecture}
                    onDelete={handleDeleteLecture}
                    onAddToCart={() => addToCart(course, "course")}
                  />
                </Grid>
              ))
            ) : (
              <Typography
                textAlign="center"
                width="100%"
                py={10}
                color="gray"
                fontSize="18px"
              >
                No courses found
              </Typography>
            )}
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default Courses;

