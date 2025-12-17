import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Box,
  Stack,
  Typography,
  Chip,
  Grid,
  IconButton,
  ImageList,
  ImageListItem,
  DialogContentText,
  Avatar,
  useTheme,
  Paper,
  CircularProgress,
  LinearProgress,
} from "@mui/material";
import lecturesInputs from "../../../utils/add-lectures-inputs";
import InputText from "../../../components/ui/inputs/InputText";
import InputFile from "../../../components/ui/inputs/InputFile";
import FilePreview from "../../../components/ui/inputs/FilePreview";
import axios from "axios";
import {
  extractJsonObject,
  resetInputs,
  validateInputs,
} from "../../../utils/common-util";
import {
  presignSmallUploads,
  uploadToPresignedUrl,
  uploadInBatches,
  uploadLargeFileMultipart,
} from "../../../utils/s3-helpers";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { closeDialog } from "../../../features/ui/uiSlice";
import { Delete, Edit, Visibility } from "@mui/icons-material";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";

export default function LectureDialog() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedData, dialogInfo } = useSelector((state) => state.ui.dialog);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [inputs, setInputs] = useState(lecturesInputs);
  const [loading, setLoading] = useState(false);
  const [progressMap, setProgressMap] = useState({}); // { fileName: percent }
  const [uploadedImagesMeta, setUploadedImagesMeta] = useState([]); // metadata to show
  const [uploadedVideosMeta, setUploadedVideosMeta] = useState([]);

  const setProgress = (fileKey, percent) => setProgressMap((p) => ({ ...p, [fileKey]: percent }));

  const handleClose = () => dispatch(closeDialog());

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
        const maxVideoSize = 50 * 1024 * 1024; //50mb
        const validFiles = Array.from(files).filter((file) => {
          if (!allowedVideoTypes.includes(file.type)) {
            tempInputs[i1]._errorMsg =
              "Only mp4, webm and ogg videos are allowed";
            return false;
          }
          if (file.size > maxVideoSize) {
            tempInputs[i1]._errorMsg = "File size must be less than 15 MB";
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
        let payload = {};
        let existingVideos = [];
        let newLocalFiles = [];
        inputs.forEach((item) => {
          if (item._type !== "file") {
            payload[item._key] = item._value;
            return;
          }
          const exist = item._value.filter((f) => f.isExisting);
          const news = item._value.filter((f) => !f.isExisting);

          existingVideos = exist;
          newLocalFiles = news;
        });
        let uploadedVideos = [];

        if (newLocalFiles.length > 0) {
          const smallFiles = newLocalFiles.filter(
            (f) => f.size <= 50 * 1024 * 1024
          );
          const largeFiles = newLocalFiles.filter(
            (f) => f.size > 50 * 1024 * 1024
          );
          if (smallFiles.length > 0) {
            const presigned = await presignSmallUploads(
              smallFiles,
              "private-course-videos"
            );

            const tasks = presigned.map((meta, idx) => async () => {
              const file = smallFiles[idx];
              // const uploaded = await uploadToPresignedUrl(meta, file);
              // setProgress(file.name, 100); // update progress instantly
              const uploaded = await uploadToPresignedUrl(meta, file, (pct) =>
                setProgress(file.name, pct)
              );
              return uploaded;
            });

            uploadedVideos = await uploadInBatches(tasks, 4);
            setUploadedVideosMeta(uploadedVideos);
          }
          if (largeFiles.length > 0) {
            const largeTasks = largeFiles.map((file) => async () => {
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
            const largeResults = await uploadInBatches(largeTasks, 3);
            uploadedVideos.push(...largeResults);
          }
        }

        payload.existing_videos = existingVideos;
        payload.new_videos = uploadedVideos;
        // const response = await axios.post(
        //   `/api/admin/updatelecture/${selectedData?._id}`,
        //   payload
        // );
        const response = await api.post(
          `/admin/updatelecture/${selectedData?._id}`,
          payload
        );
        dispatch(closeDialog());
        toast.success(response.data.msg);
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

  const handleDelete = async () => {
    if (loading) return;
      try {
        setLoading(true);
        //const response = await axios.delete(`/api/admin/deletelecture/${selectedData?._id}`);
        const response = await api.delete(`/admin/deletelecture/${selectedData?._id}`);
        dispatch(closeDialog());
        toast.success(response.data.msg);
        //navigate("/admin/myinstrumentslist");
        return response;
      } catch (err) {
        console.log("error", err);
        const errorMsg = err?.response?.data?.msg || "Something went wrong!";
        toast.error(errorMsg);
      } finally {
        setLoading(false);
      }
  }

  useEffect(() => {
    if (!selectedData || dialogInfo?.check !== "edit_lecture") return;

    const updated = lecturesInputs.map((item) => {
      const key = item._key;
      if (item._type !== "file") {
        return {
          ...item,
          _value: selectedData[key] || "",
          _errorMsg: "",
        };
      }

      const existingVideos =
        selectedData?.lecture_video.map((video) => {
          return {
            key: video.key,
            url: video.url,
            originalName: video.originalName || "",
            mimeType: video.mimeType || video.type || "",
            size: video.size || 0,
            isExisting: true,
          };
        }) || [];

      return {
        ...item,
        _value: existingVideos,
        _errorMsg: "",
      };
    });

    setInputs(updated);
  }, [selectedData, dialogInfo]);

  if (dialogInfo?.check === "edit_lecture") {
    return (
      <>
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #9c9affff, #4d53ffff)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                boxShadow: "0 3px 8px rgba(107, 77, 255, 0.4)",
              }}
            >
              <Edit fontSize="small" />
            </Box>

            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Edit Lecture - {selectedData?.lecture_title}
            </Typography>
          </Box>

          <IconButton
            onClick={handleClose}
            size="small"
            sx={{ color: "rgba(142, 144, 240, 0.9)" }}
          >
            <CloseRoundedIcon />
          </IconButton>
        </DialogTitle>
        <Divider />

        <DialogContent>
          <Grid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          >
            {inputs.map((p1, i1) => {
              if (["text", "number", "password"].includes(p1._type)) {
                return (
                  <Grid item size={{ lg: 6, md: 12, sm: 12 }} key={i1}>
                    <InputText
                      {...p1}
                      onChange={(event) => handleChange(event, p1, i1)}
                    />
                  </Grid>
                );
              }

              if (p1._type === "file") {
                return (
                  <Grid item size={{ lg: 6, md: 12, sm: 12 }} key={i1}>
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
                          <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                            <div style={{ fontSize: 12 }}>{f.name}</div>
                            <div style={{ fontSize: 12 }}>{progressMap[f.name] ? `${progressMap[f.name]}%` : ""}</div>
                          </div>
                          <LinearProgress variant="determinate" value={progressMap[f.name] || 0} sx={{ mt: 0.5 }} />
                        </Box>
                      ))}
                  </Grid>
                );
              }

              return null;
            })}
          </Grid>
        </DialogContent>

        <Divider />

        <DialogActions sx={{ p: 2 }}>
          <Button
            variant="contained"
            color="primary"
            disabled={loading}
            startIcon={
              loading ? <CircularProgress size={20} /> : <EditRoundedIcon />
            }
            sx={{
              transition: "0.3s",
              backgroundColor: "#1976d2",
              "&:hover": {
                backgroundColor: "#125aa0",
                transform: loading ? "none" : "scale(1.03)",
                boxShadow: loading ? "none" : "0px 4px 12px rgba(0,0,0,0.2)",
                opacity: loading ? 0.8 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              },
            }}
            onClick={handleSubmit}
          >
            Update Lecture
          </Button>
          <Button
            variant="outlined"
            disabled={loading}
            onClick={handleClose}
            sx={{
              transition: "0.3s",
              "&:hover": {
                transform: loading ? "none" : "scale(1.03)",
                boxShadow: loading ? "none" : "0px 4px 12px rgba(0,0,0,0.2)",
                opacity: loading ? 0.8 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              },
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </>
    );
  }

  if (dialogInfo?.check === "delete_lecture") {
    return (
          <>
            <DialogTitle
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #ff9a9a, #ff4d4d)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    boxShadow: "0 3px 8px rgba(255, 77, 77, 0.4)",
                  }}
                >
                  <Delete fontSize="small" />
                </Box>
    
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Delete lecture - {selectedData?.lecture_title}
                </Typography>
              </Box>
    
              <IconButton
                onClick={handleClose}
                size="small"
                sx={{ color: "rgba(240, 142, 142, 0.9)" }}
              >
                <CloseRoundedIcon />
              </IconButton>
            </DialogTitle>
    
            <Divider />
    
            <DialogContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Box
                  sx={{
                    bgcolor: "error.main",
                    color: "#fff",
                    p: 1.25,
                    borderRadius: 1,
                  }}
                >
                  <DeleteOutlineRoundedIcon />
                </Box>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    Are you sure you want to permanently delete{" "}
                    <span style={{ textTransform: "capitalize" }}>
                      {selectedData?.lecture_title}
                    </span>
                    ?
                  </Typography>
                  <DialogContentText sx={{ mt: 1 }}>
                    {dialogInfo?.content || "This action cannot be undone."}
                  </DialogContentText>
                </Box>
              </Stack>
            </DialogContent>
    
            <Divider />
    
            <DialogActions sx={{ p: 2 }}>
              <Button
                variant="contained"
                color="error"
                disabled={loading}
                startIcon={
                  loading ? <CircularProgress size={20} /> : <Delete />
                }
                sx={{
                  transition: "0.3s",
                  backgroundColor: "#f71d49ff",
                  "&:hover": {
                    backgroundColor: "#a10d28ff",
                    transform: loading ? "none" : "scale(1.03)",
                    boxShadow: loading ? "none" : "0px 4px 12px rgba(0, 0, 0, 0.2)",
                    opacity: loading ? 0.8 : 1,
                    cursor: loading ? "not-allowed" : "pointer",
                  },
                }}
                onClick={handleDelete}
              >
                 {loading ? "deleting..." : "Delete Permanently"}
              </Button>
              <Button
                variant="outlined"
                onClick={handleClose}
                disabled={loading}
                sx={{
                  transition: "0.3s",
                  "&:hover": {
                    transform: loading ? "none" : "scale(1.03)",
                    boxShadow: loading ? "none" : "0px 4px 12px rgba(0,0,0,0.2)",
                    opacity: loading ? 0.8 : 1,
                    cursor: loading ? "not-allowed" : "pointer",
                  },
                }}
              >
                Cancel
              </Button>
            </DialogActions>
          </>
        );
  }

  return null;
}
