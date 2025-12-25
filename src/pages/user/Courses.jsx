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
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CourseCard from "../../components/ui/card/CourseCard";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { increaseCartCount } from "../../features/cartSlice";
import toast from "react-hot-toast";
import { ArrowBack, MenuBook } from "@mui/icons-material";
import api from "../../api/axios";

const Courses = () => {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [courseList, setCourseList] = useState([]);
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();

  const handleEditLecture = (course) => {};

  const handleDeleteLecture = (course) => {};

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
    getAllCoursesData({});
  }, []);

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

  useEffect(() => {
    const q = search.trim();

    if (q === "") {
      getAllCoursesData({});
      return;
    }

    const queryObj = {};

    if (!isNaN(q)) {
      queryObj.course_price = Number(q);
    } else {
      queryObj.course_title = { $regex: q, $options: "i" };
    }

    getAllCoursesData(queryObj);
  }, [search]);

  return (
    <Box sx={{ backgroundColor: "#f8f9fc", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="lg">
        <Paper elevation={4} sx={{ p: 3, borderRadius: 3 }}>
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
            <MenuBook
              sx={{
                fontSize: {
                  xs: "1.1rem",
                  sm: "1.4rem",
                  md: "1.6rem",
                },
                flexShrink: 0,
              }}
            />
            Courses
          </Typography>

          <Divider
            sx={{
              mt: 1.5,
              mb: 1.5,
              borderColor: "#1976d2",
              borderWidth: "1px",
              borderRadius: 1,
            }}
          />

          <Paper
            elevation={2}
            sx={{
              p: { xs: 1.5, sm: 2 },
              borderRadius: { xs: 1.5, sm: 2 },
              mb: { xs: 2, sm: 3 },
              background: "white",
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 700,
                mb: { xs: 0.8, sm: 1 },
                color: "primary.main",
                fontSize: {
                  xs: "0.9rem",
                  sm: "1.05rem",
                  md: "1.1rem",
                },
              }}
            >
              Search Courses
            </Typography>

            <TextField
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search courses by title or price..."
              size="small"
              fullWidth
              sx={{
                width: "100%",
                maxWidth: { sm: 420, md: 500 },
                mx: "auto",
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon
                      sx={{
                        fontSize: { xs: 18, sm: 20 },
                        color: "action.active",
                      }}
                    />
                  </InputAdornment>
                ),
              }}
            />
          </Paper>

          <Box sx={{ mt: 2 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                letterSpacing: { xs: "0.2px", sm: "0.5px" },
                color: "#1976d2",
                borderLeft: {
                  xs: "3px solid #1976d2",
                  sm: "5px solid #1976d2",
                },
                pl: { xs: 1.2, sm: 2 },
                fontSize: {
                  xs: "0.9rem",
                  sm: "1.15rem",
                  md: "1.25rem",
                },

                display: "flex",
                alignItems: "center",
                minHeight: { xs: 36, sm: 44 },
              }}
            >
              List of Courses
            </Typography>
            <Divider />
          </Box>

          <Grid container spacing={3} mt={2}>
            {courseList.length > 0 ? (
              courseList.map((course, idx) => (
                <Grid item xs={12} sm={6} md={4} key={course._id}>
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
          <Box display="flex" mt={5}>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<ArrowBack />}
              onClick={() => navigate(-1)}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                //px: { xs: 2, sm: 3 },
                //py: { xs: 0.8, sm: 1 },
                borderRadius: 2,
                fontSize: {
                  xs: "0.75rem",
                  sm: "0.9rem",
                  md: "1rem",
                },
                "& .MuiButton-startIcon": {
                  "& svg": {
                    fontSize: { xs: "1rem", sm: "1.2rem" },
                  },
                },
              }}
            >
              Back
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Courses;
