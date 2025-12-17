// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Grid,
//   Box,
//   Button,
//   Paper,
//   Typography,
//   Divider,
//   CircularProgress,
// } from "@mui/material";

// import instrumentsInputs from "../../utils/add-instruments-inputs";
// import InputText from "../../components/ui/inputs/InputText";
// import InputFile from "../../components/ui/inputs/InputFile";
// import FilePreview from "../../components/ui/inputs/FilePreview";
// import { AddCircleRounded, LibraryMusic } from "@mui/icons-material";
// import axios from "axios";
// import {
//   extractJsonObject,
//   resetInputs,
//   validateInputs,
// } from "../../utils/common-util";
// import toast from "react-hot-toast";

// export default function AddInstruments() {
//   const [inputs, setInputs] = useState(instrumentsInputs);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleChange = async (e, p1, i1, updatedFiles = null) => {
//     let tempInputs = [...inputs];
//     if (p1._type === "file") {
//       if (updatedFiles !== null) {
//         tempInputs[i1]._value = updatedFiles;
//         setInputs([...tempInputs]);
//         return;
//       }
//       const files = e.target.files;
//       if (files && files.length > 0) {
//         const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
//         const maxSize = 2 * 1024 * 1024;
//         const validFiles = Array.from(files).filter((file) => {
//           if (!allowedTypes.includes(file.type)) {
//             tempInputs[i1]._errorMsg = "Only JPG and PNG files are allowed";
//             return false;
//           }
//           if (file.size > maxSize) {
//             tempInputs[i1]._errorMsg = "File size must be less than 2 MB";
//             return false;
//           }
//           return true;
//         });
//         if (validFiles.length === 0) {
//           setInputs([...tempInputs]);
//           return;
//         }

//         const oldFiles = Array.isArray(tempInputs[i1]._value)
//         ? tempInputs[i1]._value
//         : [];
//         const allowsMultiple = !!p1._multiple;
//         tempInputs[i1]._value = allowsMultiple
//         ? [...oldFiles, ...validFiles]
//         : [...validFiles];
//         tempInputs[i1]._errorMsg = "";
//         setInputs([...tempInputs]);
//         if (e?.target) e.target.value = "";
//       }
//     } else {
//       tempInputs[i1]._value = e.target.value;
//       tempInputs[i1]._errorMsg = "";
//     }
//     setInputs(tempInputs);
//   };

//   const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

//   const handleSubmit = async () => {
//     if (loading) return;
//     let obj1 = validateInputs(inputs);
//     if (obj1.hasError) {
//       setInputs(obj1.inputs);
//     } else {
//       try {
//         setLoading(true);
//         const formData = new FormData();
//         inputs.forEach((item) => {
//           if (item._type === "file") {
//             if (Array.isArray(item._value)) {
//               item._value.forEach((file) => {
//                 formData.append(item._key, file);
//               });
//             }
//           }
//           else {
//             formData.append(item._key, item._value);
//           }
//         });
//         const response = await axios.post("/api/admin/addinstrument", formData, {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         });
//         toast.success(response.data.msg);
//         setInputs(resetInputs(inputs));
//         navigate("/admin/myinstrumentslist");
//         return response;
//       } catch (err) {
//         console.log("error", err);
//         const errorMsg = err?.response?.data?.msg || "Something went wrong!";
//         toast.error(errorMsg);
//       } finally {
//         setLoading(false);
//       }
//     }
//   };

//   useEffect(() => {
//     setInputs(resetInputs(inputs));
//   }, []);

//   return (
//     <Paper
//       elevation={4}
//       sx={{
//         p: 3,
//         borderRadius: 2,
//       }}
//     >
//       <Box mb={3}>
//         <Typography
//           variant="h5"
//           sx={{
//             fontWeight: 600,
//             letterSpacing: "0.5px",
//             color: "#1976d2",
//             display: "flex",
//             alignItems: "center",
//             gap: 1,
//           }}
//         >
//           <LibraryMusic />
//           Add Instrument
//         </Typography>

//         <Divider
//           sx={{
//             mt: 1,
//             mb: 5,
//             borderColor: "#1976d2",
//             borderWidth: "1px",
//             borderRadius: 1,
//           }}
//         />
//       </Box>

//       <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
//         {inputs.map((p1, i1) => {
//           if (["text", "number", "password"].includes(p1._type)) {
//             return (
//               <Grid item size={{ lg: 6, md: 12, sm: 12 }} key={i1}>
//                 <InputText
//                   {...p1}
//                   onChange={(event) => handleChange(event, p1, i1)}
//                 />
//               </Grid>
//             );
//           }

//           if (p1._type === "file") {
//             return (
//               <Grid item size={{ lg: 6, md: 12, sm: 12 }} key={i1}>
//                 <InputFile
//                   {...p1}
//                   onChange={(event) => handleChange(event, p1, i1)}
//                 />

//                 <FilePreview
//                   files={p1._value}
//                   onRemove={(fileIndex) => {
//                     const updatedFiles = p1._value.filter(
//                       (_, idx) => idx !== fileIndex
//                     );
//                     handleChange(null, p1, i1, updatedFiles);
//                   }}
//                 />
//               </Grid>
//             );
//           }

//           return null;
//         })}

//         {/* Submit */}
//         <Grid item size={{ lg: 6, md: 12, sm: 12 }}>
//           <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
//             <Button
//               variant="contained"
//               size="large"
//               fullWidth
//               //startIcon={<AddCircleRounded />}
//               disabled={loading}
//               startIcon={
//                 loading ? <CircularProgress size={20} /> : <AddCircleRounded />
//               }
//               sx={{
//                 transition: "0.3s",
//                 backgroundColor: "#1976d2",
//                 "&:hover": {
//                   backgroundColor: "#125aa0",
//                   transform: loading ? "none" : "scale(1.03)",
//                   boxShadow: loading ? "none" : "0px 4px 12px rgba(0,0,0,0.2)",
//                   opacity: loading ? 0.8 : 1,
//                   cursor: loading ? "not-allowed" : "pointer",
//                 },
//               }}
//               onClick={handleSubmit}
//             >
//               {loading ? "Adding..." : "Add Instrument"}
//             </Button>
//           </Box>
//         </Grid>
//       </Grid>
//     </Paper>
//   );
// }

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
} from "@mui/material";
import instrumentsInputs from "../../utils/add-instruments-inputs";
//import dummyInputs from "../../utils/dummy-inputs";
import InputText from "../../components/ui/inputs/InputText";
import InputFile from "../../components/ui/inputs/InputFile";
import FilePreview from "../../components/ui/inputs/FilePreview";
import { AddCircleRounded, LibraryMusic } from "@mui/icons-material";
import axios from "axios";
import {
  presignSmallUploads,
  uploadToPresignedUrl,
  uploadInBatches,
  uploadLargeFileMultipart,
} from "../../utils/s3-helpers";
import {
  extractJsonObject,
  resetInputs,
  validateInputs,
} from "../../utils/common-util";
import toast from "react-hot-toast";
import api from "../../api/axios";


export default function AddInstruments() {
  const [inputs, setInputs] = useState(instrumentsInputs);
  const [loading, setLoading] = useState(false);
  const [progressMap, setProgressMap] = useState({}); // { fileName: percent }
  const [uploadedImagesMeta, setUploadedImagesMeta] = useState([]); // metadata to show
  const [uploadedVideosMeta, setUploadedVideosMeta] = useState([]);
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

        const oldFiles = Array.isArray(tempInputs[i1]._value)
          ? tempInputs[i1]._value
          : [];
        const allowsMultiple = !!p1._multiple;
        tempInputs[i1]._value = allowsMultiple
          ? [...oldFiles, ...validFiles]
          : [...validFiles];
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

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // const handleSubmit = async () => {
  //   if (loading) return;
  //   let obj1 = validateInputs(inputs);
  //   if (obj1.hasError) {
  //     setInputs(obj1.inputs);
  //   } else {
  //     try {
  //       setLoading(true);
  //       const formData = new FormData();
  //       inputs.forEach((item) => {
  //         if (item._type === "file") {
  //           if (Array.isArray(item._value)) {
  //             item._value.forEach((file) => {
  //               formData.append(item._key, file);
  //             });
  //           }
  //         }
  //         else {
  //           formData.append(item._key, item._value);
  //         }
  //       });
  //       const response = await axios.post("/api/testing/dummyapi", formData, {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //         },
  //       });
  //       toast.success(response.data.msg);
  //       // setInputs(resetInputs(inputs));
  //       // navigate("/admin/myinstrumentslist");
  //       return response;
  //     } catch (err) {
  //       console.log("error", err);
  //       const errorMsg = err?.response?.data?.msg || "Something went wrong!";
  //       toast.error(errorMsg);
  //     } finally {
  //       setLoading(false);
  //     }
  //   }
  // };

  const handleSubmit = async () => {
    if (loading) return;
    let obj1 = validateInputs(inputs);
    if (obj1.hasError) {
      setInputs(obj1.inputs);
    } else {
      try {
        let check = null;
        setLoading(true);
        const titleField = inputs.find((f) => f._key === "instrument_title");
        const title = titleField?._value?.trim();

        try {
          // check = await axios.post("/api/admin/checkinstrumenttitle", {
          //   instrument_title: title,
          // });
          check = await api.post("/admin/checkinstrumenttitle", {
            instrument_title: title,
          });
        } catch (err) {
          // Title exists OR server error
          const msg = err?.response?.data?.msg || "Title error";
          toast.error(msg);
          setLoading(false);
          return; // stop submit
        }

        if (!check.data.success) {
          toast.error(check.data.msg || "Title error");
          setLoading(false);
          return;
        }

        const payload = {};
        let imageFiles = [];
        inputs.forEach((item) => {
          if (item._type === "file") {
            if (item._key === "instrument_images" && Array.isArray(item._value))
              imageFiles = item._value;
          } else {
            payload[item._key] = item._value;
          }
        });

        let uploadedImages = [];

        if (imageFiles.length > 0) {
          const presigned = await presignSmallUploads(
            imageFiles,
            "public-instruments"
          );

          // Create tasks for parallel upload with retry
          const tasks = presigned.map((meta, idx) => async () => {
            const file = imageFiles[idx];
            // const uploaded = await uploadToPresignedUrl(meta, file);
            // setProgress(file.name, 100); // update progress instantly
            const uploaded = await uploadToPresignedUrl(meta, file, (pct) =>
              setProgress(file.name, pct)
            );
            return uploaded;
          });

          // Upload in batches of 4 (adjust batchSize if needed)
          uploadedImages = await uploadInBatches(tasks, 4);
          setUploadedImagesMeta(uploadedImages);
        }
        payload.instrument_images = uploadedImages;

        // const response = await axios.post("/api/admin/addinstrument", payload);
        const response = await api.post("/admin/addinstrument", payload);
        console.log("response",response)
        toast.success(response.data.msg);
        setInputs(resetInputs(inputs));
        navigate("/admin/myinstrumentslist");
        setProgressMap({});
        setUploadedImagesMeta([]);
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
  }, []);

  return (
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
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: 8,
                        }}
                      >
                        <div style={{ fontSize: 12 }}>{f.name}</div>
                        <div style={{ fontSize: 12 }}>
                          {progressMap[f.name] ? `${progressMap[f.name]}%` : ""}
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

        {/* Submit */}
        <Grid item size={{ lg: 6, md: 12, sm: 12 }}>
          <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
            <Button
              variant="contained"
              size="large"
              fullWidth
              //startIcon={<AddCircleRounded />}
              disabled={loading}
              startIcon={
                loading ? <CircularProgress size={20} /> : <AddCircleRounded />
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
              {loading ? "Adding..." : "Add Instrument"}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}
