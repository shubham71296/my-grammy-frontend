import { useEffect, useState, useRef } from "react";
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
  Stack,
} from "@mui/material";

import dummyInputs from "../../utils/dummy-inputs";

import InputText from "../../components/ui/inputs/InputText";
import InputFile from "../../components/ui/inputs/InputFile";
import FilePreview from "../../components/ui/inputs/FilePreview";
import { AddCircleRounded, LibraryMusic, CancelRounded } from "@mui/icons-material";
import axios from "axios";
import { resetInputs, validateInputs } from "../../utils/common-util";
import toast from "react-hot-toast";
import {
  runWithConcurrency,
  simpleUpload,
  multipartUpload
} from "../../services/uploadService";

/* -------------------------
   Helpers: concurrency & upload with progress (XHR)
   ------------------------- */



/* XHR helper that returns { promise, xhr } so caller can abort */
function xhrPutWithProgress(url, file, contentType, onProgress) {
  let xhr = new XMLHttpRequest();
  const p = new Promise((resolve, reject) => {
    xhr.open("PUT", url, true);
    if (contentType) xhr.setRequestHeader("Content-Type", contentType);
    xhr.onload = function () {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve({ xhr });
      } else {
        reject(new Error(`Upload failed status ${xhr.status}`));
      }
    };
    xhr.onerror = function () {
      reject(new Error("Network error"));
    };
    if (xhr.upload && typeof onProgress === "function") {
      xhr.upload.onprogress = function (ev) {
        if (ev.lengthComputable) onProgress(ev.loaded, ev.total);
      };
    }
    xhr.send(file);
  });
  return { promise: p, xhr };
}

/* Multipart upload with progress (uses multipart presign endpoints).
   Returns: {key, url}
   Also returns an object with `abort` method via closure: controlled by caller by storing xhrs.
*/

/* -------------------------
   Component
   ------------------------- */

export default function Dummy() {
  const [inputs, setInputs] = useState(dummyInputs);
  const [loading, setLoading] = useState(false);
  const [fileProgress, setFileProgress] = useState({}); // id -> { loaded, total, percent, status, abort }
  const [overallPercent, setOverallPercent] = useState(0);
  const navigate = useNavigate();

  const activeXhrsRef = useRef({}); // store xhrs/abort functions to cancel if needed

  useEffect(() => {
    setInputs(resetInputs(inputs));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        const maxSize = 2 * 1024 * 1024;
        const validFiles = Array.from(files).filter((file) => {
          if (!allowedTypes.includes(file.type)) {
            tempInputs[i1]._errorMsg = "Only JPG and PNG files are allowed";
            return false;
          }
          if (file.size > maxSize) {
            tempInputs[i1]._errorMsg = "File size must be less than 2 MB";
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

  const setProgressForFile = (id, data) => {
    setFileProgress((prev) => {
      const next = { ...prev, [id]: { ...(prev[id] || {}), ...data } };
      // recompute overall percent (weighted)
      const entries = Object.entries(next);
      const totalBytes = entries.reduce((s, [, v]) => s + (v.total || 0), 0) || 1;
      const loadedBytes = entries.reduce((s, [, v]) => s + (v.loaded || 0), 0);
      setOverallPercent(Math.round((loadedBytes / totalBytes) * 100));
      return next;
    });
  };

  const abortUpload = (id) => {
    const meta = fileProgress[id];
    if (meta && meta.abort) {
      try {
        meta.abort();
      } catch (e) {}
      setFileProgress((p) => ({ ...p, [id]: { ...(p[id] || {}), status: "aborted" } }));
    }
    // also abort any stored XHRs
    if (activeXhrsRef.current[id]) {
      try {
        if (activeXhrsRef.current[id].abort) activeXhrsRef.current[id].abort();
      } catch (e) {}
    }
  };

  const handleSubmit = async () => {
    const validated = validateInputs(inputs);
    if (validated.hasError) {
      setInputs(validated.inputs);
      return;
    }

    // collect files
    const fileItems = [];
    inputs.forEach((x, idx) => {
      if (x._type === "file" && Array.isArray(x._value)) {
        x._value.forEach((f) =>
          fileItems.push({ id: crypto.randomUUID(), file: f })
        );
      }
    });

    // no files? send only text values
    if (fileItems.length === 0) {
      const payload = {};
      inputs.forEach((x) => x._type !== "file" && (payload[x._key] = x._value));
      const resp = await axios.post("/api/testing/dummyapi", payload);
      toast.success("Saved");
      setInputs(resetInputs(inputs));
      return;
    }

    const tasks = fileItems.map((item) => {
      const large = item.file.size >= 8 * 1024 * 1024;

      return async () => {
        setFileProgress(item.id, {
          loaded: 0,
          total: item.file.size,
          percent: 0,
        });

        const uploader = large ? multipartUpload : simpleUpload;

        const res = await uploader(item.file, "demotesting", (loaded, total) =>
          setFileProgress(item.id, {
            loaded,
            total,
            percent: Math.round((loaded / total) * 100),
          })
        );

        return res;
      };
    });

    const uploaded = await runWithConcurrency(tasks, 3);

    const payload = {};
    inputs.forEach((x) => x._type !== "file" && (payload[x._key] = x._value));
    payload.instrument_images = uploaded;

    await axios.post("/api/testing/dummyapi", payload);

    toast.success("Uploaded successfully!");
    setInputs(resetInputs(inputs));
  };

  // Render file progress area (list)
  const renderFileProgress = () => {
    const entries = Object.entries(fileProgress);
    if (entries.length === 0) return null;
    return (
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2">Uploads</Typography>
        <Stack spacing={1} sx={{ mt: 1 }}>
          {entries.map(([id, meta]) => (
            <Paper key={id} variant="outlined" sx={{ p: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
                <Box sx={{ minWidth: 0 }}>
                  <Typography noWrap variant="body2">
                    {meta.originalName || id}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {meta.status === "uploading" ? "Uploading" : meta.status === "done" ? "Done" : meta.status === "aborted" ? "Aborted" : "Queued"}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography variant="body2">{meta.percent ?? 0}%</Typography>
                  <IconButton size="small" onClick={() => abortUpload(id)} disabled={meta.status !== "uploading"}>
                    <CancelRounded fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
              <Box sx={{ mt: 1 }}>
                <LinearProgress variant="determinate" value={meta.percent ?? 0} />
              </Box>
            </Paper>
          ))}
        </Stack>

        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            Overall progress: {overallPercent}%
          </Typography>
          <LinearProgress variant="determinate" value={overallPercent} />
        </Box>
      </Box>
    );
  };

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

        <Divider sx={{ mt: 1, mb: 5, borderColor: "#1976d2", borderWidth: "1px", borderRadius: 1 }} />
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
              </Grid>
            );
          }

          return null;
        })}

        <Grid item xs={12}>
          {renderFileProgress()}
        </Grid>

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
                  boxShadow: loading ? "none" : "0px 4px 12px rgba(0,0,0,0.2)",
                  opacity: loading ? 0.8 : 1,
                  cursor: loading ? "not-allowed" : "pointer",
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
