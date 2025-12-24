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
import createCoursesInputs from "../../../utils/create-courses-inputs";
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
import { closeDialog, renderTableAction } from "../../../features/ui/uiSlice";
import { Delete, Edit, Visibility } from "@mui/icons-material";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";

export default function CourseDialog() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedData, dialogInfo } = useSelector((state) => state.ui.dialog);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [inputs, setInputs] = useState(createCoursesInputs);
  const [loading, setLoading] = useState(false);
  const [progressMap, setProgressMap] = useState({}); // { fileName: percent }
  const [uploadedImagesMeta, setUploadedImagesMeta] = useState([]); // metadata to show
  const [uploadedVideosMeta, setUploadedVideosMeta] = useState([]);

  const setProgress = (fileKey, percent) =>
    setProgressMap((p) => ({ ...p, [fileKey]: percent }));

  const handleClose = () => dispatch(closeDialog());

  const handleChange = async (e, p1, i1, updatedFiles = null) => {
    let tempInputs = [...inputs];
    if (p1._type === "file") {
      if (updatedFiles !== null) {
        tempInputs[i1]._value = updatedFiles;
        setInputs([...tempInputs]);
        return;
      }
      const files = e.target.files;
      if (files && files.length > 0) {
        const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
        const maxSize = 100 * 1024 * 1024;
        const validFiles = Array.from(files).filter((file) => {
          if (!allowedTypes.includes(file.type)) {
            tempInputs[i1]._errorMsg = "Only JPG and PNG files are allowed";
            return false;
          }
          if (file.size > maxSize) {
            tempInputs[i1]._errorMsg = "File size must be less than 100 MB";
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
        let check = null;
        setLoading(true);
        const titleField = inputs.find((f) => f._key === "course_title");
        const title = titleField?._value?.trim();

        try {
          check = await api.post("/admin/checkcoursetitle", {
            course_title: title,
            course_id: selectedData?._id,
          });
        } catch (err) {
          const msg = err?.response?.data?.msg || "Title error";
          toast.error(msg);
          setLoading(false);
          return;
        }

        if (!check.data.success) {
          toast.error(check.data.msg || "Title error");
          setLoading(false);
          return;
        }

        let payload = {};
        let existingImages = [];
        let newLocalFiles = [];

        inputs.forEach((item) => {
          if (item._type !== "file") {
            payload[item._key] = item._value;
            return;
          }
          const exist = item._value.filter((f) => f.isExisting);
          const news = item._value.filter((f) => !f.isExisting);

          existingImages = exist;
          newLocalFiles = news;
        });

        let uploadedImages = [];

        if (newLocalFiles.length > 0) {
          const presigned = await presignSmallUploads(
            newLocalFiles,
            "public-course-thumbnails"
          );

          const tasks = presigned.map((meta, idx) => async () => {
            const file = newLocalFiles[idx];

            const uploaded = await uploadToPresignedUrl(meta, file, (pct) =>
              setProgress(file.name, pct)
            );
            return uploaded;
          });

          uploadedImages = await uploadInBatches(tasks, 4);
          setUploadedImagesMeta(uploadedImages);
        }

        payload.existing_images = existingImages;
        payload.new_images = uploadedImages;

        const response = await api.post(
          `/admin/updatecourse/${selectedData?._id}`,
          payload
        );
        dispatch(closeDialog());
        dispatch(renderTableAction({ renderTable: true }));
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
      const response = await api.delete(
        `/admin/deletecourse/${selectedData?._id}`
      );
      dispatch(closeDialog());
      dispatch(renderTableAction({ renderTable: true }));
      toast.success(response.data.msg);
      return response;
    } catch (err) {
      console.log("error", err);
      const errorMsg = err?.response?.data?.msg || "Something went wrong!";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedData || dialogInfo?.check !== "edit_course") return;

    const updated = createCoursesInputs.map((item) => {
      const key = item._key;
      if (item._type !== "file") {
        return {
          ...item,
          _value: selectedData[key] || "",
          _errorMsg: "",
        };
      }

      const existingImages =
        selectedData?.thumbnail_image.map((img) => {
          return {
            key: img.key,
            url: img.url,
            originalName: img.originalName || "",
            mimeType: img.mimeType || img.type || "image/jpeg",
            size: img.size || 1000,
            isExisting: true,
          };
        }) || [];
      return {
        ...item,
        _value: existingImages,
        _errorMsg: "",
      };
    });

    setInputs(updated);
  }, [selectedData, dialogInfo]);

  useEffect(() => {
    if (loading) {
      window.dispatchEvent(new CustomEvent("dialogLoading", { detail: true }));
    } else {
      window.dispatchEvent(new CustomEvent("dialogLoading", { detail: false }));
    }
  }, [loading]);

  if (dialogInfo?.check === "edit_course") {
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
                width: { xs: 28, sm: 34, md: 36 },
                height: { xs: 28, sm: 34, md: 36 },
                borderRadius: "50%",
                background: "linear-gradient(135deg, #9c9affff, #4d53ffff)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                boxShadow: "0 3px 8px rgba(107, 77, 255, 0.4)",
              }}
            >
              <Edit
                sx={{
                  fontSize: { xs: 16, sm: 18, md: 20 },
                }}
              />
            </Box>

            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                fontSize: {
                  xs: "0.95rem",
                  sm: "1.1rem",
                  md: "1.25rem",
                },
              }}
            >
              Edit Course - {selectedData?.course_title}
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

        <DialogContent sx={{ p: { xs: 2, md: 3 } }}>
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
              fontSize: { xs: "0.75rem", sm: "0.85rem", md: "0.95rem" },
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
            {loading ? "updating..." : "Update Course"}
          </Button>
          <Button
            variant="outlined"
            disabled={loading}
            onClick={handleClose}
            sx={{
              fontSize: { xs: "0.75rem", sm: "0.85rem", md: "0.95rem" },
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

  if (dialogInfo?.check === "delete_course") {
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
                width: { xs: 28, sm: 34, md: 36 },
                height: { xs: 28, sm: 34, md: 36 },
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

            <Typography
              variant="h6"
              sx={{
                fontSize: { xs: 16, sm: 18, md: 20 },
              }}
            >
              Delete course - {selectedData?.course_title}
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
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 700,
                  fontSize: {
                    xs: "0.9rem",
                    sm: "1.05rem",
                    md: "1.25rem",
                  },
                }}
              >
                Are you sure you want to permanently delete{" "}
                <span style={{ textTransform: "capitalize" }}>
                  {selectedData?.course_title}
                </span>
                ?
              </Typography>
              <DialogContentText
                sx={{
                  mt: 1,
                  fontSize: {
                    xs: "0.9rem",
                    sm: "1.05rem",
                    md: "1.25rem",
                  },
                }}
              >
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
            startIcon={loading ? <CircularProgress size={20} /> : <Delete />}
            sx={{
              fontSize: { xs: "0.75rem", sm: "0.85rem", md: "0.95rem" },
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
              fontSize: { xs: "0.75rem", sm: "0.85rem", md: "0.95rem" },
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
