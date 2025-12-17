// Updated Dummy component (paste into your file, replacing old content)
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Grid,
  Box,
  Button,
  Paper,
  Typography,
  Divider,
  CircularProgress,
  LinearProgress,
  IconButton,
} from "@mui/material";

import dummyInputs from "../../utils/dummy-inputs";
import InputText from "../../components/ui/inputs/InputText";
import InputFile from "../../components/ui/inputs/InputFile";
import FilePreview from "../../components/ui/inputs/FilePreview";
import { AddCircleRounded, LibraryMusic, Delete } from "@mui/icons-material";
import axios from "axios";
import {
  extractJsonObject,
  resetInputs,
  validateInputs,
} from "../../utils/common-util";
import toast from "react-hot-toast";

import {
  presignSmallUploads,
  uploadToPresignedUrl,
  uploadLargeFileMultipart,
} from "../../utils/s3-helpers";

export default function Dummy() {
  const [inputs, setInputs] = useState(dummyInputs);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // new states
  const [progressMap, setProgressMap] = useState({});
  const [uploadedImagesMeta, setUploadedImagesMeta] = useState([]);
  const [uploadedVideosMeta, setUploadedVideosMeta] = useState([]);

  const setProgress = (key, percent) => setProgressMap((p) => ({ ...p, [key]: percent }));

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
        const allowedTypes = [
          "image/jpeg",
          "image/jpg",
          "image/png",
          "image/webp",
          "video/mp4",
          "video/webm",
          "video/x-matroska",
        ];

        const validFiles = Array.from(files).filter((file) => {
          if (!allowedTypes.includes(file.type)) {
            tempInputs[i1]._errorMsg = "Only JPG/PNG images or MP4/MKV/WebM videos are allowed";
            return false;
          }
          return true;
        });

        if (validFiles.length === 0) {
          setInputs([...tempInputs]);
          return;
        }

        const oldFiles = Array.isArray(tempInputs[i1]._value) ? tempInputs[i1]._value : [];
        const allowsMultiple = !!p1._multiple;
        tempInputs[i1]._value = allowsMultiple ? [...oldFiles, ...validFiles] : [...validFiles];
        tempInputs[i1]._errorMsg = "";
        setInputs([...tempInputs]);
        if (e?.target) e.target.value = "";
      }
    } else {
      tempInputs[i1]._value = e.target.value;
      tempInputs[i1]._errorMsg = "";
      setInputs(tempInputs);
    }
  };

  const handleSubmit = async () => {
    if (loading) return;
    const validation = validateInputs(inputs);
    if (validation.hasError) {
      setInputs(validation.inputs);
      return;
    }

    setLoading(true);
    try {
      // collect values and files
      const payload = {};
      let imageFiles = [];
      let videoFiles = [];

      inputs.forEach((item) => {
        if (item._type === "file") {
          if (item._key === "instrument_images" && Array.isArray(item._value)) imageFiles = item._value;
          if (item._key === "instrument_videos" && Array.isArray(item._value)) videoFiles = item._value;
        } else {
          payload[item._key] = item._value;
        }
      });

      // upload images
      let uploadedImages = [];
      if (imageFiles.length > 0) {
        const presigned = await presignSmallUploads(imageFiles);
        const metaList = [];
        for (let i = 0; i < presigned.length; i++) {
          const meta = presigned[i];
          const file = imageFiles[i];
          const uploaded = await uploadToPresignedUrl(meta, file);
          metaList.push(uploaded);
          setProgress(file.name, 100);
        }
        uploadedImages = metaList;
        setUploadedImagesMeta(metaList);
      }

      // upload videos (multipart)
      const uploadedVideos = [];
      for (let i = 0; i < videoFiles.length; i++) {
        const vf = videoFiles[i];
        const meta = await uploadLargeFileMultipart(vf, {
          partSize: 5 * 1024 * 1024,
          onProgress: (pct) => setProgress(vf.name, pct),
        });
        uploadedVideos.push(meta);
      }
      setUploadedVideosMeta(uploadedVideos);

      payload.instrument_images = JSON.stringify(uploadedImages);
      payload.instrument_videos = JSON.stringify(uploadedVideos);

      const res = await axios.post("/api/testing/dummyapi", payload);
      toast.success(res?.data?.msg || "Uploaded successfully");

      // reset
      setInputs(resetInputs(inputs));
      setProgressMap({});
      setUploadedImagesMeta([]);
      setUploadedVideosMeta([]);
      // navigate('/admin/myinstrumentslist');
      return res;
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.msg || err.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setInputs(resetInputs(inputs));
  }, []);

  return (
    <Paper elevation={4} sx={{ p: 3, borderRadius: 2 }}>
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
          <LibraryMusic />
          Add Instrument
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

      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        {inputs.map((p1, i1) => {
          if (["text", "number", "password"].includes(p1._type)) {
            return (
              <Grid item size={{ lg: 6, md: 12, sm: 12 }} key={i1}>
                <InputText {...p1} onChange={(event) => handleChange(event, p1, i1)} />
              </Grid>
            );
          }

          if (p1._type === "file") {
            return (
              <Grid item size={{ lg: 6, md: 12, sm: 12 }} key={i1}>
                <InputFile {...p1} onChange={(event) => handleChange(event, p1, i1)} />

                <FilePreview
                  files={p1._value}
                  onRemove={(fileIndex) => {
                    const updatedFiles = p1._value.filter((_, idx) => idx !== fileIndex);
                    handleChange(null, p1, i1, updatedFiles);
                  }}
                />

                {/* show per-file progress */}
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

        {/* Submit */}
        <Grid item size={{ lg: 6, md: 12, sm: 12 }}>
          <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
            <Button
              variant="contained"
              size="large"
              fullWidth
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <AddCircleRounded />}
              sx={{
                transition: "0.3s",
                backgroundColor: "#1976d2",
                "&:hover": {
                  backgroundColor: "#125aa0",
                  transform: loading ? "none" : "scale(1.03)",
                },
              }}
              onClick={handleSubmit}
            >
              {loading ? "Adding..." : "Add Instrument"}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}
