// MyCourseDetail.jsx
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
import { useDispatch } from "react-redux";
import { openDialogAction } from "../../features/ui/uiSlice";
import AppDialog from "../../components/ui/dialog/AppDialog";
import AddMoreCard from "../../components/ui/card/AddMoreCard";
import LectureCard from "../../components/ui/card/LectureCard";
import LecturePlayer from "../../components/ui/LecturePlayer";
import api from "../../api/axios";


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

const MyCourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [course, setCourse] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewUrl, setPreviewUrl] = useState(null); // url of video to preview
  const [previewTitle, setPreviewTitle] = useState("");

  const [activeVideo, setActiveVideo] = useState(null);

  // const [activeVideoKey, setActiveVideoKey] = useState(null);
  // const [activeLectureTitle, setActiveLectureTitle] = useState("");

  const openFullScreen = (lec) => {
    //setActiveVideo(lec.lecture_video?.[0]?.url); //edit_lecture
    dispatch(
      openDialogAction({
        openDialog: true,
        selectedData: { lectureId: lec._id, videoKey: lec.lecture_video?.[0]?.key, title: lec.lecture_title },
        dialogInfo: {
          check: "view_video"
        }
      })
    );
  };

  // const openFullScreen = (lec) => {
  //   const videoKey = lec.lecture_video?.[0]?.key; // IMPORTANT: key, not url
  //   if (!videoKey) return;

  //   setActiveVideoKey(videoKey);
  //   setActiveLectureTitle(lec.lecture_title);
  // };

  const handleEditLecture = (lec) => {
    dispatch(
      openDialogAction({
        openDialog: true,
        selectedData: lec,
        dialogInfo: {
          check: "edit_lecture"
        }
      })
    );
  }

  const handleDeleteLecture = (lec) => {
    dispatch(
      openDialogAction({
        openDialog: true,
        selectedData: lec,
        dialogInfo: {
          check: "delete_lecture"
        }
      })
    );
  }

  // const closeFullScreen = () => {
  //   setActiveVideo(null);
  // };

  useEffect(() => {
    if (!id) return;
    getCourseDetails(id);
  }, [id]);

  const getCourseDetails = async (courseId) => {
    setLoading(true);
    try {
      // const response = await axios.get(`/api/admin/coursebyid/${courseId}`);
      const response = await api.get(`/admin/coursebyid/${courseId}`);
      console.log("response", response);
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

  const openPreview = (lecture) => {
    const firstVideoUrl = lecture?.lecture_video?.[0]?.url;
    if (!firstVideoUrl) return;
    setPreviewTitle(lecture.lecture_title || "Preview");
    setPreviewUrl(firstVideoUrl);
  };

  const closePreview = () => {
    setPreviewUrl(null);
    setPreviewTitle("");
  };

  return (
    <>
    <Paper elevation={4} sx={{ p: 3, borderRadius: 2 }}>
      {/* Header */}
      <Box mb={3}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            letterSpacing: "0.5px",
            color: "#1976d2",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <MenuBook />
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
       <Typography sx={{ fontSize:"18px", color:"warning.main" }}>
            Instrument:{" "}
            <strong>
              {course.instrument?.instrument_title || course.instrument || "—"}
            </strong>
          </Typography>
     </Box>
      

      {/* Thumbnail */}
      {/* Thumbnail (smaller + clickable preview) */}
      <Card
        sx={{
          mt:2,
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
        // onClick={() => setPreviewUrl(course.thumbnail_image?.[0]?.url)}
        onClick={() => {
          dispatch(
                openDialogAction({
                  openDialog: true,
                  selectedData: {
                    previewUrl: course.thumbnail_image?.[0]?.url,
                    title: course.instrument.instrument_title
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

          {/* Overlay */}
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

      {/* Course meta */}
      <Box mb={3}>
        <Typography variant="h6" fontWeight={700}>
          {course.course_title}
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>
          {course.course_description}
        </Typography>

        <Box display="flex" gap={2} mt={2} alignItems="center">
          <Chip label={formatCurrency(course.course_price)} color="primary" />
          <Typography variant="body2" color="text.secondary">
            Instrument:{" "}
            <strong>
              {course.instrument?.instrument_title || course.instrument || "—"}
            </strong>
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Inline Video Player */}
        {/* {activeVideoKey && (
          <Paper
            elevation={4}
            sx={{
              p: 2,
              mb: 3,
              borderRadius: 2,
              backgroundColor: "#000",
            }}
          >
            <Typography
              sx={{
                color: "#fff",
                mb: 1,
                fontWeight: 600,
              }}
            >
              ▶ {activeLectureTitle}
            </Typography>

            <LecturePlayer videoKey={activeVideoKey} />
          </Paper>
        )} */}


      {/* Lectures */}
      <Box>
        <Typography variant="h6" fontWeight={700} mb={2}>
          Lectures ({lectures.length})
        </Typography>

        {lectures.length === 0 ? (
          <Typography color="text.secondary">
            No lectures available for this course.
          </Typography>
        ) : (
          <Grid container spacing={2}>
            {/* {lectures.map((lec, idx) => {
              const vidUrl = lec.lecture_video?.[0]?.url || "";

              return (
                <Paper
                elevation={4}
                sx={{
                  p: 1,
                  borderRadius: 1,
                }}
              >
                <Grid item xs={12} sm={6} md={4} key={lec._id}>
                  <Box
                    sx={{
                      position: "relative",
                      borderRadius: 2,
                      overflow: "hidden",
                      boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
                      height: "180px",
                      width:"180px" // SMALL PREVIEW HEIGHT
                    }}
                  >
                    <video
                      src={vidUrl}
                      muted
                      controls
                      preload="metadata"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                      onLoadedMetadata={(e) => (e.target.currentTime = 0.1)} // freeze first frame
                    />

                    <Box
                      sx={{
                        position: "absolute",
                        inset: 0,
                        bgcolor: "rgba(0,0,0,0.4)",
                        opacity: 1,
                        transition: "0.3s ease",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        //pointerEvents: "none",          // allow hover to pass through
                        "&:hover": {
                          bgcolor: "rgba(107, 171, 240, 0.4)", // hover effect works!
                        },
                      }}
                    >
                      <IconButton
                        sx={{
                          bgcolor: "white",
                          width: 60,
                          height: 60,
                          borderRadius: "50%",
                          transition: "transform 0.3s ease", // smooth zoom
                          "&:hover": {
                            transform: "scale(1.15)", // zoom effect on hover
                            bgcolor: "white", // prevent dimming
                          },
                        }}
                        onClick={() => openFullScreen(lec)}
                      >
                        <VideoLibrary fontSize="large" />
                      </IconButton>
                    </Box>
                  </Box>

                  <Box
                    mt={1}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      width:"180px"
                    }}
                  >
                  <Typography mt={1}
                    fontWeight={700}
                    sx={{
                      flexGrow: 1,
                      fontSize:12,
                      mr: 1,
                    }}>
                    {idx + 1}. {lec.lecture_title}
                  </Typography>
                <IconButton
                  size="small"
                  sx={{
                    bgcolor: "#f1f1f1",
                    "&:hover": {
                      bgcolor: "#e0e0e0",
                    },
                  }}
                >
                  <MoreVert fontSize="small" />
                </IconButton>
              </Box>
                </Grid>
                </Paper>
              );
            })} */}
            {lectures.map((lec, idx) => (
              <Grid item xs={12} sm={6} md={4} key={lec._id}>
                <CourseVideoCard 
                  lec={lec} 
                  idx={idx} 
                  openFullScreen={openFullScreen}
                  onEdit={handleEditLecture}
                  onDelete={handleDeleteLecture} 
                />
                {/* <LectureCard
                  key={lec._id}
                  lec={lec}
                  index={idx}
                  onPlay={openFullScreen}
                  onEdit={handleEditLecture}
                  onDelete={handleDeleteLecture} 
                /> */}
              </Grid>
            ))}
            {/* <Grid item xs={12} sm={6} md={4}>
              <AddMoreCard title="Add More Lectures" onClick={() => {
                navigate("/admin/addlectures", {
                  state: {
                    course_id: id,
                    course_title: course.course_title,
                  }
                });
              }} />
            </Grid> */}
          </Grid>
        )}
        <Grid container spacing={2} sx={{mt:2}}>
        <Grid item xs={12} sm={6} md={4}>
              <AddMoreCard title="Add More Lectures" onClick={() => {
                navigate("/admin/addlectures", {
                  state: {
                    course_id: id,
                    course_title: course.course_title,
                  }
                });
              }} />
            </Grid>
            </Grid>
      </Box>
    </Paper>
    <AppDialog />
    </>
  );
};

export default MyCourseDetail;
