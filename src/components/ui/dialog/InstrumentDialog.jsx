// import React, { useEffect, useMemo, useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import {
//   Button,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Divider,
//   Box,
//   Stack,
//   Typography,
//   Chip,
//   Grid,
//   IconButton,
//   ImageList,
//   ImageListItem,
//   DialogContentText,
//   Avatar,
//   useTheme,
//   Paper,
//   CircularProgress,
// } from "@mui/material";
// import instrumentsInputs from "../../../utils/add-instruments-inputs";
// import InputText from "../../../components/ui/inputs/InputText";
// import InputFile from "../../../components/ui/inputs/InputFile";
// import FilePreview from "../../../components/ui/inputs/FilePreview";
// import axios from "axios";
// import {
//   extractJsonObject,
//   resetInputs,
//   validateInputs,
// } from "../../../utils/common-util";

// import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
// import MusicNoteIcon from "@mui/icons-material/MusicNote";
// import EditRoundedIcon from "@mui/icons-material/EditRounded";
// import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
// import ZoomInIcon from "@mui/icons-material/ZoomIn";
// import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
// import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
// import { closeDialog } from "../../../features/ui/uiSlice";
// import { Delete, Edit, Visibility } from "@mui/icons-material";
// import toast from "react-hot-toast";
// import { useNavigate } from "react-router-dom";

// export default function InstrumentDialog() {
//   const theme = useTheme();
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { selectedData, dialogInfo } = useSelector((state) => state.ui.dialog);
//   const [lightboxIndex, setLightboxIndex] = useState(0);
//   const [inputs, setInputs] = useState(instrumentsInputs);
//   const [loading, setLoading] = useState(false);


//   const handleClose = () => dispatch(closeDialog());

//   const data = selectedData || {};
//     console.log("selectedData for delete", data);

//   const images = useMemo(() => {
//     if (!data.instrument_images) return [];
//     return data.instrument_images.flat().filter(Boolean);
//   }, [data]);

//   const formattedDate = useMemo(() => {
//     if (!data.createdAt) return "—";
//     try {
//       return new Date(data.createdAt).toLocaleString("en-IN", {
//         year: "numeric",
//         month: "short",
//         day: "numeric",
//         hour: "2-digit",
//         minute: "2-digit",
//       });
//     } catch {
//       return data.createdAt;
//     }
//   }, [data]);

//   const formatCurrency = (val) => {
//     if (val === undefined || val === null || val === "") return "—";
//     const n = Number(val);
//     if (Number.isNaN(n)) return val;
//     return n.toLocaleString("en-IN", {
//       style: "currency",
//       currency: "INR",
//       maximumFractionDigits: 0,
//     });
//   };

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
//           ? tempInputs[i1]._value
//           : [];
//         const allowsMultiple = !!p1._multiple;
//         tempInputs[i1]._value = allowsMultiple
//           ? [...oldFiles, ...validFiles]
//           : [...validFiles];
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
//             const existingFiles = [];
            
//             if (Array.isArray(item._value)) {
//               item._value.forEach((file) => {
          
//                 if (file.isExisting) {
//                   // 👇 Keep existing S3 images
//                   existingFiles.push({
//                     key: file.key,
//                     url: file.url,
//                     originalName: file.originalName,
//                     mimeType: file.mimeType,
//                     size: file.size,
//                   });
//                 } else {
//                   formData.append(item._key, file);
//                 }
//               });
//             }

//             formData.append("existing_images", JSON.stringify(existingFiles));
//           }

//           else {
//             formData.append(item._key, item._value);
//           }
//         });

//         const response = await axios.post(`/api/admin/updateinstrument/${selectedData?._id}`, formData, {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         });
//         dispatch(closeDialog());
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

//   const handleDelete = async () => {
//     if (loading) return;
//     try {
//       setLoading(true);
//       const response = await axios.delete(`/api/admin/deleteinstrument/${data._id}`);
//       dispatch(closeDialog());
//       toast.success(response.data.msg);
//       navigate("/admin/myinstrumentslist");
//       return response;
//     } catch (err) {
//       console.log("error", err);
//       const errorMsg = err?.response?.data?.msg || "Something went wrong!";
//       toast.error(errorMsg);
//     } finally {
//       setLoading(false);
//     }
//   }

//   // Prefill inputs when selectedData changes (edit mode)
//   useEffect(() => {
//     if (!selectedData || dialogInfo?.check !== "edit_instrument") return;
//     console.log("selected", selectedData)

//     const updated = instrumentsInputs.map((item) => {
//       const key = item._key;

//       // If NOT file input → just fill normally
//       if (item._type !== "file") {
//         return {
//           ...item,
//           _value: selectedData[key] || "",
//           _errorMsg: "",
//         };
//       }      
//       // If FILE input → convert existing S3 images into preview format
//       // const existingImages =
//       //   selectedData.instrument_images?.map((img) => ({
//           // key: img.key,
//           // url: img.url,
//           // originalName: img.originalName,
//           // mimeType: img.mimeType,
//           // size: img.size,
//           // isExisting: true, // mark as S3 image
//       //   })) || [];
//        const existingImages =
//   selectedData.instrument_images?.map((img) => {
//     const data = img.key || img.url || img.originalName ? img : img[0];

//     return {
//           key: data.key,
//           url: data.url,
//           originalName: data.originalName,
//           mimeType: data.mimeType,
//           size: data.size,
//           isExisting: true,
//     };
//   })

//         console.log("existingImages",existingImages)
//       return {
//         ...item,
//         _value: existingImages, // always an array
//         _errorMsg: "",
//       };
//     });

//     setInputs(updated);
//   }, [selectedData, dialogInfo]);

//   if (dialogInfo?.check === "view_instrument") {
//     return (
//       <>
//         <DialogTitle
//           sx={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//             p: 2,
//           }}
//         >
//           <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
//             <Box
//               sx={{
//                 width: 36,
//                 height: 36,
//                 borderRadius: "50%",
//                 background: "linear-gradient(135deg, #9c9affff, #4d53ffff)",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 color: "white",
//                 boxShadow: "0 3px 8px rgba(107, 77, 255, 0.4)",
//               }}
//             >
//               <Visibility fontSize="small" />
//             </Box>

//             <Typography variant="h6" sx={{ fontWeight: 700 }}>
//               View instrument - {data.instrument_title || "this instrument"}
//             </Typography>
//           </Box>

//           <IconButton
//             onClick={handleClose}
//             size="small"
//             sx={{ color: "rgba(142, 144, 240, 0.9)" }}
//           >
//             <CloseRoundedIcon />
//           </IconButton>
//         </DialogTitle>

//         <Divider />

//         <DialogContent dividers sx={{ p: { xs: 2, md: 3 } }}>
//           <Grid container spacing={3}>
//             {/* Left: gallery */}
//             <Grid item xs={12} md={6}>
//               <Box
//                 sx={{
//                   borderRadius: 2,
//                   overflow: "hidden",
//                   boxShadow: 1,
//                 }}
//               >
//                 {images && images.length > 0 ? (
//                   <>
//                     {/* MAIN IMAGE — clicking opens lightbox at the active index (0 if none) */}
//                     <img
//                       src={images[lightboxIndex]?.url || images[0].url}
//                       alt={images[lightboxIndex]?.originalName || images[0].key}
//                       style={{
//                         width: "100%",
//                         height: 280,
//                         objectFit: "cover",
//                         display: "block",
//                         cursor: "pointer",
//                       }}
//                     />

//                     {/* THUMBNAILS */}
//                     <Box sx={{ p: 1 }}>
//                       <ImageList cols={3} gap={8} sx={{ m: 0 }}>
//                         {images.map((img, i) => {
//                           const isActive = i === lightboxIndex;
//                           return (
//                             <ImageListItem
//                               key={img.key || img.url || i}
//                               sx={{
//                                 cursor: "pointer",
//                                 borderRadius: 1,
//                                 overflow: "hidden",
//                                 position: "relative",
//                                 border: isActive
//                                   ? `2px solid ${theme.palette.primary.main}`
//                                   : "2px solid transparent",
//                                 transition:
//                                   "transform 0.16s ease, border-color 0.16s ease",
//                                 "&:hover": { transform: "scale(1.02)" },
//                               }}
//                               onClick={() => {
//                                 // set active index and open lightbox
//                                 setLightboxIndex(i);
//                               }}
//                             >
//                               <img
//                                 src={img.url}
//                                 alt={img.originalName || img.key}
//                                 loading="lazy"
//                                 style={{
//                                   width: "100%",
//                                   height: 84,
//                                   objectFit: "cover",
//                                   display: "block",
//                                   borderRadius: 6,
//                                 }}
//                               />

//                               {/* zoom icon — pointerEvents none so it doesn't block clicks */}
//                               <Box
//                                 sx={{
//                                   position: "absolute",
//                                   top: 6,
//                                   right: 6,
//                                   bgcolor: "rgba(0,0,0,0.45)",
//                                   color: "#fff",
//                                   borderRadius: "4px",
//                                   px: 0.6,
//                                   py: 0.4,
//                                   display: "flex",
//                                   alignItems: "center",
//                                   gap: 0.6,
//                                   pointerEvents: "none",
//                                 }}
//                               >
//                                 <ZoomInIcon fontSize="small" />
//                               </Box>
//                             </ImageListItem>
//                           );
//                         })}
//                       </ImageList>
//                     </Box>
//                   </>
//                 ) : (
//                   <Box
//                     sx={{
//                       height: 280,
//                       display: "grid",
//                       placeItems: "center",
//                       bgcolor: "grey.50",
//                       p: 2,
//                     }}
//                   >
//                     <Typography>No images</Typography>
//                   </Box>
//                 )}
//               </Box>
//             </Grid>

//             {/* Right: details */}
//             <Grid item xs={12} md={6}>
//               <Stack spacing={2}>
//                 <Box
//                   sx={{
//                     bgcolor: "background.paper",
//                     borderRadius: 2,
//                     p: 2,
//                     boxShadow: 1,
//                   }}
//                 >
//                   <Typography
//                     variant="subtitle2"
//                     color="text.secondary"
//                     sx={{ fontWeight: 700 }}
//                   >
//                     Title
//                   </Typography>
//                   <Typography
//                     variant="h6"
//                     sx={{ fontWeight: 700, textTransform: "capitalize" }}
//                   >
//                     {data.instrument_title || "—"}
//                   </Typography>
//                 </Box>

//                 <Box
//                   sx={{
//                     bgcolor: "background.paper",
//                     borderRadius: 2,
//                     p: 2,
//                     boxShadow: 1,
//                   }}
//                 >
//                   <Typography
//                     variant="subtitle2"
//                     color="text.secondary"
//                     sx={{ fontWeight: 700 }}
//                   >
//                     Price
//                   </Typography>
//                   <Typography
//                     variant="h6"
//                     sx={{ fontWeight: 700, color: "primary.main" }}
//                   >
//                     {formatCurrency(data.instrument_price)}
//                   </Typography>
//                 </Box>

//                 <Box
//                   sx={{
//                     bgcolor: "background.paper",
//                     borderRadius: 2,
//                     p: 2,
//                     boxShadow: 1,
//                   }}
//                 >
//                   <Typography
//                     variant="subtitle2"
//                     color="text.secondary"
//                     sx={{ mb: 1, fontWeight: 700 }}
//                   >
//                     Description
//                   </Typography>
//                   <Typography
//                     variant="body2"
//                     sx={{ color: "text.primary", whiteSpace: "pre-wrap" }}
//                   >
//                     {data.instrurment_description || "No description provided."}
//                   </Typography>
//                 </Box>

//                 <Grid container spacing={2}>
//                   <Grid item xs={6}>
//                     <Box
//                       sx={{
//                         bgcolor: "background.paper",
//                         borderRadius: 2,
//                         p: 2,
//                         boxShadow: 1,
//                       }}
//                     >
//                       <Typography
//                         variant="subtitle2"
//                         color="text.secondary"
//                         sx={{ fontWeight: 700 }}
//                       >
//                         Created
//                       </Typography>
//                       <Typography variant="body2" sx={{ fontWeight: 600 }}>
//                         {formattedDate}
//                       </Typography>
//                     </Box>
//                   </Grid>
//                 </Grid>
//               </Stack>
//             </Grid>
//           </Grid>
//         </DialogContent>

//         <DialogActions sx={{ px: 3, py: 2 }}>
//           <Button
//             onClick={handleClose}
//             variant="outlined"
//             color="primary"
//             sx={{
//               transition: "0.3s",
//               "&:hover": {
//                 transform: loading ? "none" : "scale(1.03)",
//                 boxShadow: loading ? "none" : "0px 4px 12px rgba(0,0,0,0.2)",
//                 opacity: loading ? 0.8 : 1,
//                 cursor: loading ? "not-allowed" : "pointer",
//               },
//             }}
//           >
//             Close
//           </Button>
//         </DialogActions>
//       </>
//     );
//   }

//   if (dialogInfo?.check === "delete_instrument") {
//     return (
//       <>
//         <DialogTitle
//           sx={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//             p: 2,
//           }}
//         >
//           <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
//             <Box
//               sx={{
//                 width: 36,
//                 height: 36,
//                 borderRadius: "50%",
//                 background: "linear-gradient(135deg, #ff9a9a, #ff4d4d)",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 color: "white",
//                 boxShadow: "0 3px 8px rgba(255, 77, 77, 0.4)",
//               }}
//             >
//               <Delete fontSize="small" />
//             </Box>

//             <Typography variant="h6" sx={{ fontWeight: 700 }}>
//               Delete instrument - {data.instrument_title || "this instrument"}
//             </Typography>
//           </Box>

//           <IconButton
//             onClick={handleClose}
//             size="small"
//             sx={{ color: "rgba(240, 142, 142, 0.9)" }}
//           >
//             <CloseRoundedIcon />
//           </IconButton>
//         </DialogTitle>

//         <Divider />

//         <DialogContent>
//           <Stack direction="row" spacing={2} alignItems="center">
//             <Box
//               sx={{
//                 bgcolor: "error.main",
//                 color: "#fff",
//                 p: 1.25,
//                 borderRadius: 1,
//               }}
//             >
//               <DeleteOutlineRoundedIcon />
//             </Box>
//             <Box>
//               <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
//                 Are you sure you want to permanently delete{" "}
//                 <span style={{ textTransform: "capitalize" }}>
//                   {data.instrument_title || "this instrument"}
//                 </span>
//                 ?
//               </Typography>
//               <DialogContentText sx={{ mt: 1 }}>
//                 {dialogInfo?.content || "This action cannot be undone."}
//               </DialogContentText>
//             </Box>
//           </Stack>
//         </DialogContent>

//         <Divider />

//         <DialogActions sx={{ p: 2 }}>
//           <Button
//             variant="contained"
//             color="error"
//             sx={{
//               transition: "0.3s",
//               backgroundColor: "#f71d49ff",
//               "&:hover": {
//                 backgroundColor: "#a10d28ff",
//                 transform: loading ? "none" : "scale(1.03)",
//                 boxShadow: loading ? "none" : "0px 4px 12px rgba(0, 0, 0, 0.2)",
//                 opacity: loading ? 0.8 : 1,
//                 cursor: loading ? "not-allowed" : "pointer",
//               },
//             }}
//             onClick={handleDelete}
//           >
//             Delete permanently
//           </Button>
//           <Button
//             variant="outlined"
//             onClick={handleClose}
//             sx={{
//               transition: "0.3s",
//               "&:hover": {
//                 transform: loading ? "none" : "scale(1.03)",
//                 boxShadow: loading ? "none" : "0px 4px 12px rgba(0,0,0,0.2)",
//                 opacity: loading ? 0.8 : 1,
//                 cursor: loading ? "not-allowed" : "pointer",
//               },
//             }}
//           >
//             Cancel
//           </Button>
//         </DialogActions>
//       </>
//     );
//   }

//   if (dialogInfo?.check === "edit_instrument") {
//     return (
//       <>
//         <DialogTitle
//           sx={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//             p: 2,
//           }}
//         >
//           <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
//             <Box
//               sx={{
//                 width: 36,
//                 height: 36,
//                 borderRadius: "50%",
//                 background: "linear-gradient(135deg, #9c9affff, #4d53ffff)",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 color: "white",
//                 boxShadow: "0 3px 8px rgba(107, 77, 255, 0.4)",
//               }}
//             >
//               <Edit fontSize="small" />
//             </Box>

//             <Typography variant="h6" sx={{ fontWeight: 700 }}>
//               Edit instrument - {data.instrument_title || "this instrument"}
//             </Typography>
//           </Box>

//           <IconButton
//             onClick={handleClose}
//             size="small"
//             sx={{ color: "rgba(142, 144, 240, 0.9)" }}
//           >
//             <CloseRoundedIcon />
//           </IconButton>
//         </DialogTitle>
//         <Divider />

//         <DialogContent>
//           <Grid
//             container
//             rowSpacing={1}
//             columnSpacing={{ xs: 1, sm: 2, md: 3 }}
//           >
//             {inputs.map((p1, i1) => {
//               console.log("p111",p1)
//               if (["text", "number", "password"].includes(p1._type)) {
//                 return (
//                   <Grid item size={{ lg: 6, md: 12, sm: 12 }} key={i1}>
//                     <InputText
//                       {...p1}
//                       onChange={(event) => handleChange(event, p1, i1)}
//                     />
//                   </Grid>
//                 );
//               }

//               if (p1._type === "file") {
//                 return (
//                   <Grid item size={{ lg: 6, md: 12, sm: 12 }} key={i1}>
//                     <InputFile
//                       {...p1}
//                       onChange={(event) => handleChange(event, p1, i1)}
//                     />

//                     <FilePreview
//                       files={p1._value}
//                       onRemove={(fileIndex) => {
//                         const updatedFiles = p1._value.filter(
//                           (_, idx) => idx !== fileIndex
//                         );
//                         handleChange(null, p1, i1, updatedFiles);
//                       }}
//                     />
//                   </Grid>
//                 );
//               }

//               return null;
//             })}
//           </Grid>
//         </DialogContent>

//         <Divider />

//         <DialogActions sx={{ p: 2 }}>
//           <Button
//             variant="contained"
//             color="primary"
//             sx={{
//               transition: "0.3s",
//               backgroundColor: "#1976d2",
//               "&:hover": {
//                 backgroundColor: "#125aa0",
//                 transform: loading ? "none" : "scale(1.03)",
//                 boxShadow: loading ? "none" : "0px 4px 12px rgba(0,0,0,0.2)",
//                 opacity: loading ? 0.8 : 1,
//                 cursor: loading ? "not-allowed" : "pointer",
//               },
//             }}
//             onClick={handleSubmit}
//           >
//             Update Instrument
//           </Button>
//           <Button
//             variant="outlined"
//             onClick={handleClose}
//             sx={{
//               transition: "0.3s",
//               "&:hover": {
//                 transform: loading ? "none" : "scale(1.03)",
//                 boxShadow: loading ? "none" : "0px 4px 12px rgba(0,0,0,0.2)",
//                 opacity: loading ? 0.8 : 1,
//                 cursor: loading ? "not-allowed" : "pointer",
//               },
//             }}
//           >
//             Cancel
//           </Button>
//         </DialogActions>
//       </>
//     );
//   }

//   return null;
// }


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
import instrumentsInputs from "../../../utils/add-instruments-inputs";
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
import { AddCircleOutline, Delete, Edit, Update, Visibility } from "@mui/icons-material";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";

export default function InstrumentDialog() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedData, dialogInfo } = useSelector((state) => state.ui.dialog);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [inputs, setInputs] = useState(instrumentsInputs);
  const [loading, setLoading] = useState(false);
  const [progressMap, setProgressMap] = useState({}); // { fileName: percent }
  const [uploadedImagesMeta, setUploadedImagesMeta] = useState([]); // metadata to show
  const [uploadedVideosMeta, setUploadedVideosMeta] = useState([]);

  const setProgress = (fileKey, percent) => setProgressMap((p) => ({ ...p, [fileKey]: percent }));


  const handleClose = () => dispatch(closeDialog());

  const data = selectedData || {};
    console.log("selectedData for delete", data);

  const images = useMemo(() => {
    if (!data.instrument_images) return [];
    return data.instrument_images.flat().filter(Boolean);
  }, [data]);

  const formattedDate = useMemo(() => {
    if (!data.createdAt) return "—";
    try {
      return new Date(data.createdAt).toLocaleString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return data.createdAt;
    }
  }, [data]);

  const formatCurrency = (val) => {
    if (val === undefined || val === null || val === "") return "—";
    const n = Number(val);
    if (Number.isNaN(n)) return val;
    return n.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    });
  };

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
          //   instrument_id: selectedData?._id
          // });
          check = await api.post("/admin/checkinstrumenttitle", {
            instrument_title: title,
            instrument_id: selectedData?._id
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
          const presigned = await presignSmallUploads(newLocalFiles, "public-instruments");
          
          const tasks = presigned.map((meta, idx) => async () => {
            const file = newLocalFiles[idx];
            // const uploaded = await uploadToPresignedUrl(meta, file);
            // setProgress(file.name, 100);
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
        
        // const response = await axios.post(`/api/admin/updateinstrument/${selectedData?._id}`,payload);
        const response = await api.post(`/admin/updateinstrument/${selectedData?._id}`,payload);

        dispatch(closeDialog());
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

  const handleDelete = async () => {
    if (loading) return;
    try {
      setLoading(true);
      // const response = await axios.delete(`/api/admin/deleteinstrument/${data._id}`);
      const response = await api.delete(`/admin/deleteinstrument/${data._id}`);
      dispatch(closeDialog());
      toast.success(response.data.msg);
      navigate("/admin/myinstrumentslist");
      return response;
    } catch (err) {
      console.log("error", err);
      const errorMsg = err?.response?.data?.msg || "Something went wrong!";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  }

  // Prefill inputs when selectedData changes (edit mode)
  useEffect(() => {
    if (!selectedData || dialogInfo?.check !== "edit_instrument") return;
    console.log("selected", selectedData)

    const updated = instrumentsInputs.map((item) => {
      const key = item._key;

      // If NOT file input → just fill normally
      if (item._type !== "file") {
        return {
          ...item,
          _value: selectedData[key] || "",
          _errorMsg: "",
        };
      }   
      
      const existingImages = selectedData?.instrument_images.map((img) => {  
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
        _value: existingImages, // always an array
        _errorMsg: "",
      };
    });

    setInputs(updated);
  }, [selectedData, dialogInfo]);

  if (dialogInfo?.check === "view_instrument") {
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
              <Visibility fontSize="small" />
            </Box>

            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              View instrument - {data.instrument_title || "this instrument"}
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

        <DialogContent dividers sx={{ p: { xs: 2, md: 3 } }}>
          <Grid container spacing={3}>
            {/* Left: gallery */}
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  borderRadius: 2,
                  overflow: "hidden",
                  boxShadow: 1,
                }}
              >
                {images && images.length > 0 ? (
                  <>
                    {/* MAIN IMAGE — clicking opens lightbox at the active index (0 if none) */}
                    <img
                      src={images[lightboxIndex]?.url || images[0].url}
                      alt={images[lightboxIndex]?.originalName || images[0].key}
                      style={{
                        width: "100%",
                        height: 280,
                        objectFit: "cover",
                        display: "block",
                        cursor: "pointer",
                      }}
                    />

                    {/* THUMBNAILS */}
                    <Box sx={{ p: 1 }}>
                      <ImageList cols={3} gap={8} sx={{ m: 0 }}>
                        {images.map((img, i) => {
                          const isActive = i === lightboxIndex;
                          return (
                            <ImageListItem
                              key={img.key || img.url || i}
                              sx={{
                                cursor: "pointer",
                                borderRadius: 1,
                                overflow: "hidden",
                                position: "relative",
                                border: isActive
                                  ? `2px solid ${theme.palette.primary.main}`
                                  : "2px solid transparent",
                                transition:
                                  "transform 0.16s ease, border-color 0.16s ease",
                                "&:hover": { transform: "scale(1.02)" },
                              }}
                              onClick={() => {
                                // set active index and open lightbox
                                setLightboxIndex(i);
                              }}
                            >
                              <img
                                src={img.url}
                                alt={img.originalName || img.key}
                                loading="lazy"
                                style={{
                                  width: "100%",
                                  height: 84,
                                  objectFit: "cover",
                                  display: "block",
                                  borderRadius: 6,
                                }}
                              />

                              {/* zoom icon — pointerEvents none so it doesn't block clicks */}
                              <Box
                                sx={{
                                  position: "absolute",
                                  top: 6,
                                  right: 6,
                                  bgcolor: "rgba(0,0,0,0.45)",
                                  color: "#fff",
                                  borderRadius: "4px",
                                  px: 0.6,
                                  py: 0.4,
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 0.6,
                                  pointerEvents: "none",
                                }}
                              >
                                <ZoomInIcon fontSize="small" />
                              </Box>
                            </ImageListItem>
                          );
                        })}
                      </ImageList>
                    </Box>
                  </>
                ) : (
                  <Box
                    sx={{
                      height: 280,
                      display: "grid",
                      placeItems: "center",
                      bgcolor: "grey.50",
                      p: 2,
                    }}
                  >
                    <Typography>No images</Typography>
                  </Box>
                )}
              </Box>
            </Grid>

            {/* Right: details */}
            <Grid item xs={12} md={6}>
              <Stack spacing={2}>
                <Box
                  sx={{
                    bgcolor: "background.paper",
                    borderRadius: 2,
                    p: 2,
                    boxShadow: 1,
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    sx={{ fontWeight: 700 }}
                  >
                    Title
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, textTransform: "capitalize" }}
                  >
                    {data.instrument_title || "—"}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    bgcolor: "background.paper",
                    borderRadius: 2,
                    p: 2,
                    boxShadow: 1,
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    sx={{ fontWeight: 700 }}
                  >
                    Price
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, color: "primary.main" }}
                  >
                    {formatCurrency(data.instrument_price)}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    bgcolor: "background.paper",
                    borderRadius: 2,
                    p: 2,
                    boxShadow: 1,
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    sx={{ mb: 1, fontWeight: 700 }}
                  >
                    Description
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "text.primary", whiteSpace: "pre-wrap" }}
                  >
                    {data.instrurment_description || "No description provided."}
                  </Typography>
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box
                      sx={{
                        bgcolor: "background.paper",
                        borderRadius: 2,
                        p: 2,
                        boxShadow: 1,
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        sx={{ fontWeight: 700 }}
                      >
                        Created
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {formattedDate}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Stack>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            onClick={handleClose}
            variant="outlined"
            color="primary"
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
            Close
          </Button>
        </DialogActions>
      </>
    );
  }

  if (dialogInfo?.check === "delete_instrument") {
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
              Delete instrument - {data.instrument_title || "this instrument"}
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
                  {data.instrument_title || "this instrument"}
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

  if (dialogInfo?.check === "edit_instrument") {
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
              Edit instrument - {data.instrument_title || "this instrument"}
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
              console.log("p111",p1)
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
              loading ? <CircularProgress size={20} /> : <Update />
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
            {loading ? "Updating..." : "Update Instrument"}
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

