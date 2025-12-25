import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Grid,
  Box,
  Button,
  Paper,
  Typography,
  Divider,
  CircularProgress,
  LinearProgress,
  useTheme,
  useMediaQuery,
  Backdrop,
} from "@mui/material";

import lecturesInputs from "../../utils/add-lectures-inputs";
import InputText from "../../components/ui/inputs/InputText";
import InputFile from "../../components/ui/inputs/InputFile";
import FilePreview from "../../components/ui/inputs/FilePreview";
import { AddCircleRounded, ArrowBack, MenuBook, Visibility } from "@mui/icons-material";
import axios from "axios";
import {
  extractJsonObject,
  resetInputs,
  validateInputs,
} from "../../utils/common-util";
import {
  presignSmallUploads,
  uploadToPresignedUrl,
  uploadInBatches,
  uploadLargeFileMultipart,
} from "../../utils/s3-helpers";
import toast from "react-hot-toast";
import api from "../../api/axios";

export default function AddLectures() {
  const location = useLocation();
  const { course_id, course_title } = location.state || {};
  const [inputs, setInputs] = useState(lecturesInputs);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [progressMap, setProgressMap] = useState({});
  const [uploadedImagesMeta, setUploadedImagesMeta] = useState([]);
  const [uploadedVideosMeta, setUploadedVideosMeta] = useState([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const navigate = useNavigate();

  const setProgress = (fileKey, percent) =>
    setProgressMap((p) => ({ ...p, [fileKey]: percent }));

  const handleChange = async (e, p1, i1, updatedFiles = null) => {
    let tempInputs = [...inputs];
    if (p1._type === "file") {
      if (updatedFiles !== null) {
        tempInputs[i1]._value = updatedFiles;
        setInputs([...tempInputs]);
        return;
      }
      const files = e?.target?.files;
      if (files && files.length > 0) {
        const allowedVideoTypes = ["video/mp4", "video/mkv", "video/mov"];
        const maxVideoSize = 500 * 1024 * 1024;
        const validFiles = Array.from(files).filter((file) => {
          if (!allowedVideoTypes.includes(file.type)) {
            tempInputs[i1]._errorMsg =
              "Only mp4, webm and ogg videos are allowed";
            return false;
          }
          if (file.size > maxVideoSize) {
            tempInputs[i1]._errorMsg = "File size must be less than 500 MB";
            return false;
          }
          return true;
        });
        if (validFiles.length === 0) {
          setInputs([...tempInputs]);
          return;
        }

        const firstValid = validFiles[0];
        tempInputs[i1]._value = [firstValid];

        tempInputs[i1]._errorMsg = "";
        setInputs([...tempInputs]);

        if (e?.target) e.target.value = "";
      }
    } else {
      tempInputs[i1]._value = e.target.value;
      tempInputs[i1]._errorMsg = "";
    }
    setInputs(tempInputs);
  };

  const handleSubmit = async () => {
    if (loading) return;
    let obj1 = validateInputs(inputs);
    if (obj1.hasError) {
      setInputs(obj1.inputs);
    } else {
      try {
        setLoading(true);
        const payload = {};
        let videoFiles = [];
        inputs.forEach((item) => {
          if (item._type === "file") {
            if (item._key === "lecture_video" && Array.isArray(item._value))
              videoFiles = item._value;
          } else {
            payload[item._key] = item._value;
          }
        });

        let uploadedVideos = [];
        if (videoFiles.length > 0) {
          const smallFiles = videoFiles.filter(
            (f) => f.size <= 50 * 1024 * 1024
          );
          const largeFiles = videoFiles.filter(
            (f) => f.size > 50 * 1024 * 1024
          );

          if (smallFiles.length > 0) {
            const presigned = await presignSmallUploads(
              smallFiles,
              "private-course-videos"
            );

            const tasks = presigned.map((meta, idx) => async () => {
              const file = smallFiles[idx];
              const uploaded = await uploadToPresignedUrl(meta, file, (pct) =>
                setProgress(file.name, pct)
              );
              return uploaded;
            });

            uploadedVideos = await uploadInBatches(tasks, 4);
            setUploadedVideosMeta(uploadedVideos);
          }

          if (largeFiles.length > 0) {
            const largeUploadTasks = largeFiles.map((file) => async () => {
              return await uploadLargeFileMultipart(
                file,
                {
                  partSize: 5 * 1024 * 1024,
                  batchSize: 5,
                  onProgress: (pct) => setProgress(file.name, pct),
                },
                "private-course-videos"
              );
            });
            const largeResults = await uploadInBatches(largeUploadTasks, 3);
            uploadedVideos.push(...largeResults);
          }
        }
        payload.lecture_video = uploadedVideos;
        payload.course_id = course_id;

        const response = await api.post("/admin/addlecture", payload);
        toast.success(response.data.msg);
        setMessage(response.data.msg);
        setInputs(resetInputs(inputs));
        return response;
      } catch (err) {
        console.log("error", err);
        const errorMsg = err?.response?.data?.msg || "Something went wrong!";
        toast.error(errorMsg);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    setInputs(resetInputs(inputs));
    setMessage("");
  }, []);

  return (
    <>
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 999,
          flexDirection: "column",
          gap: 2,
        }}
        open={loading}
      >
        <CircularProgress color="inherit" />
        <Typography sx={{ fontSize: "0.9rem", mt: 1 }}>
          Uploading & Processing…
        </Typography>
      </Backdrop>

      <Paper
        elevation={4}
        sx={{
          p: 3,
          borderRadius: 2,
        }}
      >
        <Box mb={3}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              fontSize: {
                xs: "1rem",
                sm: "1.2rem",
                md: "1.5rem",
              },
              letterSpacing: "0.5px",
              color: "#1976d2",
              display: "flex",
              alignItems: "center",
              gap: 1,
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
            Add Lecture videos for course - {course_title}
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
        </Box>

        {message ? (
          <Box
            sx={{
              mb: 3,
              p: 2,
              borderRadius: "12px",
              backgroundColor: "#e6f4ea",
              border: "1px solid #a5d6a7",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
              color: "#2e7d32",
              fontWeight: 500,
              transition: "0.3s ease",
              "&:hover": {
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                backgroundColor: "#dcedc8",
              },
            }}
          >
            <Typography>{message}</Typography>
          </Box>
        ) : null}

        <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          {inputs.map((p1, i1) => {
            if (["text", "number", "password"].includes(p1._type)) {
              return (
                <Grid size={{ xs: 12, md: 12, lg: 6 }} key={i1}>
                  <InputText
                    {...p1}
                    onChange={(event) => handleChange(event, p1, i1)}
                  />
                </Grid>
              );
            }

            if (p1._type === "file") {
              return (
                <Grid size={{ xs: 12, md: 12, lg: 6 }} key={i1}>
                  <InputFile
                    {...p1}
                    onChange={(event) => handleChange(event, p1, i1)}
                  />

                  <FilePreview
                    files={p1._value}
                    onRemove={(fileIndex) => {
                      const updatedFiles = p1._value.filter(
                        (_, idx) => idx !== fileIndex
                      );
                      handleChange(null, p1, i1, updatedFiles);
                    }}
                  />
                  {Array.isArray(p1._value) &&
                    p1._value.map((f, idx) => (
                      <Box key={f.name + idx} sx={{ mt: 1 }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: 8,
                          }}
                        >
                          <div style={{ fontSize: 12 }}>{f.name}</div>
                          <div style={{ fontSize: 12 }}>
                            {progressMap[f.name]
                              ? `${progressMap[f.name]}%`
                              : ""}
                          </div>
                        </div>
                        <LinearProgress
                          variant="determinate"
                          value={progressMap[f.name] || 0}
                          sx={{ mt: 0.5 }}
                        />
                      </Box>
                    ))}
                </Grid>
              );
            }

            return null;
          })}

          <Grid size={{ xs: 12, md: 12, lg: 6 }}>
            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
              <Button
                variant="contained"
                size="large"
                fullWidth
                disabled={loading}
                startIcon={
                  loading ? (
                    <CircularProgress size={isMobile ? 16 : 20} />
                  ) : (
                    <AddCircleRounded />
                  )
                }
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  minHeight: 32,
                  fontSize: { xs: "0.65rem", sm: "0.72rem" },
                  "& .MuiButton-startIcon > *": {
                    fontSize: { xs: 18, sm: 20, md: 22 },
                  },
                  transition: "0.3s",
                  backgroundColor: "#1976d2",
                  "&:hover": {
                    backgroundColor: "#125aa0",
                    transform: loading ? "none" : "scale(1.03)",
                    boxShadow: loading
                      ? "none"
                      : "0px 4px 12px rgba(0,0,0,0.2)",
                    opacity: loading ? 0.8 : 1,
                    cursor: loading ? "not-allowed" : "pointer",
                  },
                }}
                onClick={handleSubmit}
              >
                {loading ? "Adding..." : message ? "Add More" : "Add Lecture"}
              </Button>

              {message ? (
                <Button
                  variant="outlined"
                  size="large"
                  fullWidth
                  startIcon={<Visibility />}
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    minHeight: 32,
                    fontSize: { xs: "0.65rem", sm: "0.72rem" },
                    "& .MuiButton-startIcon > *": {
                      fontSize: { xs: 18, sm: 20, md: 22 },
                    },
                    transition: "0.3s",
                    "&:hover": {
                      transform: "scale(1.03)",
                      boxShadow: "0px 4px 12px rgba(0,0,0,0.2)",
                      opacity: 1,
                      cursor: "pointer",
                    },
                  }}
                  onClick={() => navigate(`/admin/mycoursedetail/${course_id}`)}
                >
                  {"View Lectures"}
                </Button>
              ) : null}
            </Box>
          </Grid>
        </Grid>
        <Box sx={{ mt: 2, ml: 2 }}>
          <Box
            component={Link}
            to="/admin/createcourse"
            sx={{
              fontSize: { xs: "0.8rem", sm: "1rem" },
              fontWeight: 600,
              color: "#6993edff",
              textDecoration: "none",
              cursor: "pointer",
              transition: "0.2s",
              "&:hover": {
                color: "#464bf0ff",
                textDecoration: "underline",
              },
            }}
          >
            + Create New Course
          </Box>
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
    </>
  );
}
