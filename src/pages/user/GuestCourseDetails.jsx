import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardMedia,
  Chip,
  Dialog,
  DialogContent,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  Container,
} from "@mui/material";
import {
  MenuBook,
  VideoLibraryOutlined,
  ArrowBack,
  CloseRounded,
  VideoLibrary,
  MoreVert,
} from "@mui/icons-material";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import CourseVideoCard from "../../components/ui/card/CourseVideoCard";
import { useDispatch, useSelector } from "react-redux";
import { openDialogAction } from "../../features/ui/uiSlice";
import AppDialog from "../../components/ui/dialog/AppDialog";
import AddMoreCard from "../../components/ui/card/AddMoreCard";
import LectureCard from "../../components/ui/card/LectureCard";
import api from "../../api/axios";
import GuestLectureCard from "../../components/ui/card/GuestLectureCard";

const formatCurrency = (value) => {
  const n = Number(value);
  if (Number.isFinite(n)) {
    return n.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    });
  }
  return value;
};

const GuestCourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [course, setCourse] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewTitle, setPreviewTitle] = useState("");

  const [activeVideo, setActiveVideo] = useState(null);

  const openFullScreen = (lec) => {
    dispatch(
      openDialogAction({
        openDialog: true,
        dialogInfo: { check: "guest_login_required" },
      })
    );
  };

  useEffect(() => {
    if (!id) return;
    getCourseDetails(id);
  }, [id]);

  const getCourseDetails = async (courseId) => {
    setLoading(true);
    try {
      const response = await api.get(`/admin/guestcoursebyid/${courseId}`);
      const payload = response?.data?.data || response?.data;
      const courseData = payload?.course_data;
      const lecturesData = payload?.lectures_data || [];

      if (!courseData) {
        setCourse(null);
        setLectures([]);
      } else {
        setCourse(courseData);
        setLectures(Array.isArray(lecturesData) ? lecturesData : []);
      }
    } catch (err) {
      console.log("Error fetching course details:", err);
      setCourse(null);
      setLectures([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" py={8}>
        <CircularProgress />
      </Box>
    );
  }

  if (!course) {
    return (
      <Typography variant="h6" textAlign="center" mt={5}>
        Course not found.
      </Typography>
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
              My Course Detail
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
          
          
          <Box sx={{}}>
            <Typography sx={{ fontSize: "18px", color: "warning.main" }}>
              Instrument:{" "}
              <strong>
                {course.instrument?.instrument_title ||
                  course.instrument ||
                  "—"}
              </strong>
            </Typography>
          </Box>

          <Card
            sx={{
              mt: 2,
              width: "220px",
              borderRadius: 3,
              overflow: "hidden",
              mb: 3,
              cursor: "pointer",
              boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
              transition: "transform 0.2s ease",
              position: "relative",
              "&:hover": {
                transform: "scale(1.03)",
              },
              "&:hover .overlay": {
                opacity: 1,
              },
            }}
            onClick={() => {
              dispatch(
                openDialogAction({
                  openDialog: true,
                  selectedData: {
                    previewUrl: course.thumbnail_image?.[0]?.url,
                    title: course.instrument.instrument_title,
                  },
                  dialogInfo: {
                    check: "view_img_video",
                  },
                })
              );
            }}
          >
            <Box sx={{ position: "relative" }}>
              <CardMedia
                component="img"
                height="140"
                image={course.thumbnail_image?.[0]?.url || ""}
                alt={course.course_title}
                sx={{ objectFit: "cover" }}
              />

              <Box
                className="overlay"
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  bgcolor: "rgba(0,0,0,0.55)",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: 0,
                  transition: "opacity 0.3s ease",
                  fontSize: "18px",
                  fontWeight: "bold",
                  letterSpacing: "1px",
                }}
              >
                View
              </Box>
            </Box>
          </Card>

          <Box mb={3}>
            <Typography
              variant="h6"
              color="primary"
              //fontWeight={800}
              sx={{
                //mb:1,
                fontSize: {
                  xs: "0.8rem",
                  sm: "1rem",
                  md: "1.2rem",
                },
              }}
            >
              Course Name: <strong>{course.course_title}</strong>
            </Typography>
           
           <Paper
            elevation={0}
            sx={{
              p: { xs: 2, sm: 3 },
              mt:1,
              mb: 4,
              borderRadius: 3,
              background: "rgba(2, 2, 94, 0.04)",
              //border: "1px solid rgba(2, 2, 94, 0.1)",
               borderLeft: "4px solid #02025e",
            }}
          >
            <Typography
              color="text.secondary"
              sx={{
               fontSize: { xs: "14px", sm: "16px", md: "18px" },
              lineHeight: 1.8,
              color: "#1b085c",
              //textAlign: "center",
              maxWidth: 900,
              }}
            >
              {course.course_description}
            </Typography>
          </Paper>

            <Box display="flex" gap={2} mt={2} alignItems="center">
              {/* <Chip
                label={formatCurrency(course.course_price)}
                color="primary"
                sx={{
                  fontSize: {
                    xs: "0.8rem",
                    sm: "0.9rem",
                    md: "1rem",
                  },
                }}
              /> */}
              <Chip
                label={formatCurrency(course.course_price)}
                color={"primary"}
                sx={{
                  fontSize: {
                    xs: "0.8rem",
                    sm: "0.9rem",
                    md: "1rem",
                  },
                }}
              />
              {/* <Typography variant="body2" color="text.secondary">
                Instrument:{" "}
                <strong>
                  {course.instrument?.instrument_title ||
                    course.instrument ||
                    "—"}
                </strong>
              </Typography> */}
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box>
            <Typography
              variant="h6"
              fontWeight={700}
              mb={2}
              sx={{
                fontSize: {
                  xs: "0.8rem",
                  sm: "1rem",
                  md: "1.2rem",
                },
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              Lectures ({lectures.length})
              <Chip
                label={"PAID"}
                variant="outlined"
                color={"error"}
                sx={{
                  fontWeight: 700,
                  //borderWidth: "1px",
                  //px: 1.5,
                  //py: 0.5,
                  fontSize: {
                    xs: "0.6rem",
                    sm: "0.75rem",
                    md: "0.85rem",
                  },
                }}
              />
            </Typography>

            {lectures.length === 0 ? (
              <Typography
                color="text.secondary"
                sx={{
                  fontSize: {
                    xs: "0.8rem",
                    sm: "0.9rem",
                    md: "1rem",
                  },
                }}
              >
                No lectures available for this course.
              </Typography>
            ) : (
              <Grid container spacing={2}>
                {lectures.map((lec, idx) => {
                  const vidUrl = lec.lecture_video?.[0]?.url || "";

                  return (
                    <GuestLectureCard
                      key={lec._id}
                      lec={lec}
                      index={idx}
                      onPlay={openFullScreen}
                    />
                  );
                })}
              </Grid>
            )}
          </Box>
        
        
        
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
      <AppDialog />
    </Box>
  );
};

export default GuestCourseDetails;
