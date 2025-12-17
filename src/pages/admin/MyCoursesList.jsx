// import React, { useEffect, useState } from "react";
// import CommonTable from "../../components/ui/table/CommonTable";
// import { useDispatch, useSelector } from "react-redux";
// import axios from "axios";
// import { filterData } from "../../utils/common-util";
// import { headCells, menuOptions } from "../../utils/my-courses-columns";
// import MyCoursesFilterInputs from "../../utils/mycourses-filter-inputs";
// import FilterForm from "../../components/ui/FilterForm";
// import { useSearchParams } from "react-router-dom";
// import { Box, Divider, Paper, Typography } from "@mui/material";
// import { setTotalCount } from "../../features/dataCountSlice";
// import AppDialog from "../../components/ui/dialog/AppDialog";
// import { MenuBook } from "@mui/icons-material";
// //import MyInstrumentsFilter from './MyInstrumentsFilter';

// function MyCoursesList() {
//   const [isInitialLoad, setIsInitialLoad] = useState(true);
//   const { countTotalData } = useSelector((state) => state.dataCount);
//   const dispatch = useDispatch();
//   const [searchParams] = useSearchParams();
//   const [inputs, setInputs] = useState(MyCoursesFilterInputs);
//   const [activeQuery, setActiveQuery] = useState({});

//   const [state, setState] = useState({
//     limit: 5,
//     limitDropdown: [5, 10, 20, 50],
//     header: [],
//     data: [],
//     totalDataCount: 0,
//     query: {},
//   });

//   const getCurrentLimitFromUrl = () => {
//     const l = searchParams.get("limit");
//     const parsed = parseInt(l, 10);
//     return !isNaN(parsed) && parsed > 0 ? parsed : state.limit;
//   };

//   const handleFilterSubmit = () => {
//     const newQuery = {};
//     inputs.forEach((input) => {
//       if (input._value) {
//         newQuery[input._key] = { $regex: input._value, $options: "i" };
//       }
//     });
//     setActiveQuery(newQuery);
//     const currentLimit = getCurrentLimitFromUrl();
//     getData(currentLimit, 0, newQuery);
//   };

//   const handleFilterReset = () => {
//     const resetInputs = inputs.map((i) => ({ ...i, _value: "" }));
//     setInputs(resetInputs);
//     setActiveQuery({});
//     getData(state.limit, 0, {});
//   };

//   const getData = async (limit, offset, query = activeQuery) => {
//     const body = {
//       query,
//       projection: { pwd: 0 },
//       options: { skip: offset, limit, sort: { createdAt: -1 } },
//     };
//     const response = await axios.post("/api/admin/allcourses", body);
//     const res = response.data;
//     if (res.success) {
//       let fd = filterData(res.data, headCells);
//       console.log("fd@@",fd)
//       setState((prev) => ({
//         ...prev,
//         header: fd.header,
//         totalDataCount: res.totalDataCount,
//         data: fd.rows,
//         rawData: res.data,
//       }));
//       if (isInitialLoad) {
//         dispatch(setTotalCount({ countTotalData: res.totalDataCount }));
//         setIsInitialLoad(false);
//       }
//     }
//   };

//   const config = {
//     getData,
//     data: state.data,
//     totalDataCount: state.totalDataCount,
//     limit: state.limit,
//     limitDropdown: state.limitDropdown,
//     headCells: headCells,
//     header: state.header,
//     menuOptions,
//     query: activeQuery,
//     style: {
//       paginateStyle: {
//         sx: { float: "right" },
//       },
//       limitDropdownStyle: {
//         sx: { float: "right" },
//       },
//     },
//     baseRoute: "/admin/mycourseslist",
//     textLabel: "Course",
//     buttonRoute: "/admin/addcourses"
//   };

//   return (
//     <Paper
//       elevation={4}
//       sx={{
//         p: 3,
//         borderRadius: 2,
//       }}
//     >
//       <Box>
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
//           <MenuBook />
//           My Courses
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
//       {countTotalData > 0 && (
//         <FilterForm
//           title="Filter Courses"
//           inputs={inputs}
//           setInputs={setInputs}
//           onSubmit={handleFilterSubmit}
//           onReset={handleFilterReset}
//         />
//       )}
//       <CommonTable {...config} />
//       <AppDialog />
//     </Paper>
//   );
// }

// export default MyCoursesList;

//#####################################################################################################################

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   Avatar,
//   Box,
//   Button,
//   Card,
//   CardActionArea,
//   CardContent,
//   CardMedia,
//   Chip,
//   CircularProgress,
//   Divider,
//   Grid,
//   Paper,
//   Stack,
//   Typography,
//   Accordion,
//   AccordionSummary,
//   AccordionDetails,
// } from "@mui/material";
// import { MenuBook, OndemandVideo, Visibility, ExpandMore } from "@mui/icons-material";

// /**
//  * Sample fallback data (from your payload)
//  */
// const SAMPLE = [
//   {
//     _id: "692ad1c712fcb45defe0c218",
//     instrument: {
//       _id: "69288f4207e058fbb3b542b9",
//       instrument_title: "tabla",
//     },
//     course_title: "learn tabla in 10 days",
//     course_description: "learn tabla description",
//     course_price: "2000",
//     thumbnail_image: [
//       {
//         key: "courses/thumbnails/1764413894138-7b9274c2-dde5-491e-b2e5-f46aa0e73ada.jpg",
//         url:
//           "https://my-music-website-storage.s3.ap-south-1.amazonaws.com/courses/thumbnails/1764413894138-7b9274c2-dde5-491e-b2e5-f46aa0e73ada.jpg",
//         originalName: "tabla.jpg",
//         mimeType: "image/jpeg",
//         size: 44785,
//       },
//     ],
//     createdAt: "2025-11-29T10:58:15.177Z",
//     updatedAt: "2025-11-29T10:58:15.177Z",
//     __v: 0,
//   },
//   {
//     _id: "692ad0b312fcb45defe0c20b",
//     instrument: {
//       _id: "69288f6e07e058fbb3b542c0",
//       instrument_title: "piano",
//     },
//     course_title: "learn piano in 30 days",
//     course_description: "my piano description",
//     course_price: "1000",
//     thumbnail_image: [
//       {
//         key: "courses/thumbnails/1764413619050-94e285c7-aa8e-406c-a404-34997909898b.jpg",
//         url:
//           "https://my-music-website-storage.s3.ap-south-1.amazonaws.com/courses/thumbnails/1764413619050-94e285c7-aa8e-406c-a404-34997909898b.jpg",
//         originalName: "piano.jpg",
//         mimeType: "image/jpeg",
//         size: 22198,
//       },
//     ],
//     createdAt: "2025-11-29T10:53:39.810Z",
//     updatedAt: "2025-11-29T10:53:39.810Z",
//     __v: 0,
//   },
// ];

// const formatCurrency = (value) => {
//   const n = Number(value);
//   if (Number.isFinite(n)) {
//     return n.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
//   }
//   return value;
// };

// const formatDate = (iso) => {
//   if (!iso) return "";
//   const d = new Date(iso);
//   return d.toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric" });
// };

// const groupByInstrument = (courses = []) => {
//   return courses.reduce((acc, course) => {
//     const key = course.instrument?.instrument_title?.trim() || "Uncategorized";
//     if (!acc[key]) acc[key] = [];
//     acc[key].push(course);
//     return acc;
//   }, {});
// };

// const MyCoursesListGrouped = () => {
//   const [courses, setCourses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [expanded, setExpanded] = useState(false); // which accordion expanded

//   // pagination / query placeholders (expand as needed)
//   const [limit] = useState(0);
//   const [offset] = useState(0);
//   const [query] = useState({});

//   useEffect(() => {
//     getAllCoursesData(limit, offset, query);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const getAllCoursesData = async (limitVal, offsetVal, queryVal = {}) => {
//     setLoading(true);
//     try {
//       const body = {
//         query: queryVal,
//         projection: {},
//         options: {
//           skip: offsetVal,
//           limit: limitVal,
//           sort: { createdAt: -1 },
//         },
//       };

//       // If you have a working endpoint, uncomment and use it:
//       // const response = await axios.post("/api/admin/allcourses", body);
//       // setCourses(response.data?.data || SAMPLE);

//       // For now — use the sample payload so UI renders immediately
//       await new Promise((r) => setTimeout(r, 500));
//       setCourses(SAMPLE);
//     } catch (error) {
//       console.error("Error fetching courses:", error);
//       setCourses(SAMPLE);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // grouped object { instrumentTitle: [courses...] }
//   const grouped = groupByInstrument(courses);
//   // sorted instrument titles
//   const instrumentKeys = Object.keys(grouped).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));

//   const handleAccordionChange = (panel) => (event, isExpanded) => {
//     setExpanded(isExpanded ? panel : false);
//   };

//   return (
//     <Paper elevation={4} sx={{ p: 3, borderRadius: 2 }}>
//       <Box mb={2}>
//         <Typography
//           variant="h5"
//           sx={{
//             fontWeight: 700,
//             letterSpacing: "0.4px",
//             color: "#0b5ed7",
//             display: "flex",
//             alignItems: "center",
//             gap: 1,
//           }}
//         >
//           <MenuBook sx={{ fontSize: 24 }} />
//           My Courses
//         </Typography>

//         <Divider sx={{ mt: 1, mb: 2, borderColor: "#1976d2", borderWidth: "1px", borderRadius: 1 }} />
//       </Box>

//       {loading ? (
//         <Box display="flex" alignItems="center" justifyContent="center" py={6}>
//           <CircularProgress />
//         </Box>
//       ) : courses.length === 0 ? (
//         <Box textAlign="center" py={8}>
//           <Typography variant="h6" gutterBottom>
//             No courses yet
//           </Typography>
//           <Typography variant="body2" color="text.secondary" mb={2}>
//             You haven't created any courses. Click the button below to add your first course.
//           </Typography>
//           <Button variant="contained" color="primary" startIcon={<OndemandVideo />}>
//             Create Course
//           </Button>
//         </Box>
//       ) : (
//         <Stack spacing={2}>
//           {instrumentKeys.map((instrumentTitle, idx) => (
//             <Accordion
//               key={instrumentTitle + idx}
//               expanded={expanded === instrumentTitle}
//               onChange={handleAccordionChange(instrumentTitle)}
//               sx={{
//                 borderRadius: 1,
//                 "&:before": { display: "none" },
//                 boxShadow: 1,
//               }}
//             >
//               <AccordionSummary expandIcon={<ExpandMore />}>
//                 <Stack direction="row" spacing={2} alignItems="center" sx={{ width: "100%", justifyContent: "space-between" }}>
//                   <Stack direction="row" spacing={1} alignItems="center">
//                     <Avatar sx={{ bgcolor: "#90caf9", width: 40, height: 40 }}>
//                       {instrumentTitle?.charAt(0)?.toUpperCase() || <MenuBook />}
//                     </Avatar>
//                     <Box>
//                       <Typography sx={{ fontWeight: 700 }}>{instrumentTitle}</Typography>
//                       <Typography variant="caption" color="text.secondary">
//                         {grouped[instrumentTitle].length} {grouped[instrumentTitle].length === 1 ? "course" : "courses"}
//                       </Typography>
//                     </Box>
//                   </Stack>

//                   <Box>
//                     <Button size="small" variant="outlined">
//                       View All
//                     </Button>
//                   </Box>
//                 </Stack>
//               </AccordionSummary>

//               <AccordionDetails>
//                 <Grid container spacing={3}>
//                   {grouped[instrumentTitle].map((course) => {
//                     const thumb =
//                       Array.isArray(course.thumbnail_image) && course.thumbnail_image.length > 0
//                         ? course.thumbnail_image[0].url
//                         : null;

//                     return (
//                       <Grid item xs={12} sm={6} md={4} key={course._id}>
//                         <Card
//                           variant="outlined"
//                           sx={{
//                             height: "100%",
//                             display: "flex",
//                             flexDirection: "column",
//                             transition: "transform 200ms ease, box-shadow 200ms ease",
//                             "&:hover": {
//                               transform: "translateY(-6px)",
//                               boxShadow: 6,
//                             },
//                           }}
//                         >
//                           <CardActionArea sx={{ textAlign: "left", alignItems: "stretch", flex: 1 }}>
//                             {thumb ? (
//                               <CardMedia component="img" height="160" image={thumb} alt={course.course_title} />
//                             ) : (
//                               <Box
//                                 sx={{
//                                   height: 160,
//                                   display: "flex",
//                                   alignItems: "center",
//                                   justifyContent: "center",
//                                   background: "linear-gradient(120deg, #e3f2fd, #fff)",
//                                 }}
//                               >
//                                 <Avatar sx={{ width: 72, height: 72, bgcolor: "#90caf9" }}>
//                                   <MenuBook />
//                                 </Avatar>
//                               </Box>
//                             )}

//                             <CardContent sx={{ flex: 1 }}>
//                               <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
//                                 <Box>
//                                   <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
//                                     {course.course_title}
//                                   </Typography>
//                                   <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
//                                     {course.course_description}
//                                   </Typography>
//                                 </Box>

//                                 <Box textAlign="right">
//                                   <Chip
//                                     label={formatCurrency(course.course_price)}
//                                     size="small"
//                                     sx={{ fontWeight: 600, bgcolor: "#e8f0ff" }}
//                                   />
//                                   <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 1 }}>
//                                     {formatDate(course.createdAt)}
//                                   </Typography>
//                                 </Box>
//                               </Stack>

//                               <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
//                                 <Typography variant="caption" color="text.secondary">
//                                   Instrument:
//                                 </Typography>
//                                 <Typography variant="body2" sx={{ fontWeight: 600 }}>
//                                   {course.instrument?.instrument_title || "—"}
//                                 </Typography>
//                               </Stack>
//                             </CardContent>
//                           </CardActionArea>

//                           <Box sx={{ p: 2, pt: 0 }}>
//                             <Divider sx={{ mb: 1 }} />
//                             <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center">
//                               <Stack direction="row" spacing={1}>
//                                 <Button size="small" startIcon={<Visibility />} variant="text">
//                                   View
//                                 </Button>
//                                 <Button size="small" startIcon={<OndemandVideo />} variant="contained">
//                                   Manage Lectures
//                                 </Button>
//                               </Stack>

//                               <Typography variant="caption" color="text.secondary">
//                                 {course.thumbnail_image?.length ?? 0} thumbnail
//                               </Typography>
//                             </Stack>
//                           </Box>
//                         </Card>
//                       </Grid>
//                     );
//                   })}
//                 </Grid>
//               </AccordionDetails>
//             </Accordion>
//           ))}
//         </Stack>
//       )}
//     </Paper>
//   );
// };

// export default MyCoursesListGrouped;

import {
  AddCircleOutlineRounded,
  ArrowDownward,
  Inbox,
  MenuBook,
} from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Card,
  CardMedia,
  CardContent,
  Box,
  Divider,
  Paper,
  Typography,
  Button,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { openDialogAction } from "../../features/ui/uiSlice";
import CourseAccordion from "../../components/ui/accordion/CourseAccordion";
import CourseCard from "../../components/ui/card/CourseCard";
import { useDispatch, useSelector } from "react-redux";
import AppDialog from "../../components/ui/dialog/AppDialog";
import api from "../../api/axios";

const MyCoursesList = () => {
  const { token } = useSelector((state) => state.auth);
  const [limit] = useState(0);
  const [offset] = useState(0);
  const [query] = useState({});
  const [allCourses, setAllCourses] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    getAllCoursesData(limit, offset, {}); // get all
  }, []);

  const getAllCoursesData = async (limitVal, offsetVal, queryVal = {}) => {
    try {
      const body = {
        query: queryVal,
        projection: {},
        options: {
          skip: offsetVal,
          limit: limitVal,
          sort: { createdAt: -1 },
        },
      };

      // const response = await axios.post("/api/admin/allcourses", body, {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //   },
      // });
      const response = await api.post("/admin/allcourses", body);
      setAllCourses(response.data.data || []);
    } catch (error) {
      console.error("Error fetching instruments:", error);
    }
  };

  const handleEditLecture = (course) => {
    dispatch(
      openDialogAction({
        openDialog: true,
        selectedData: course,
        dialogInfo: {
          check: "edit_course",
        },
      })
    );
  };

  const handleDeleteLecture = (course) => {
    dispatch(
      openDialogAction({
        openDialog: true,
        selectedData: course,
        dialogInfo: {
          check: "delete_course",
        },
      })
    );
  };

  return (
    <>
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
            <MenuBook />
            My Courses
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
        {allCourses.length > 0 ? (
          allCourses.map((course, idx) => (
            <CourseAccordion
              key={course._id}
              title={course?.instrument.instrument_title}
            >
              <CourseCard
                type="admin"
                idx={idx}
                course={course}
                onEdit={handleEditLecture}
                onDelete={handleDeleteLecture}
              />
            </CourseAccordion>
          ))
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              py: 6,
              borderRadius: 3,
              backgroundColor: "#f7f7fb",
              boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
              textAlign: "center",
              transition: "0.3s",
              "&:hover": {
                boxShadow: "0 6px 20px rgba(0,0,0,0.12)",
                backgroundColor: "#f0efff",
              },
            }}
          >
            <Inbox />
            <Typography
              variant="h6"
              sx={{ color: "#4a4a4a", fontWeight: 600, mb: 0.5 }}
            >
              No Course Found
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "primary.main",
                mb: 3,
              }}
            >
             
              Please add a new instrument to create course
                
            </Typography>

            {/* <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
              <Button
                variant="contained"
                size="small"
                startIcon={<AddCircleOutlineRounded />}
                sx={{
                  px: 2.5,
                  py: 1,
                  fontSize: "0.8rem",
                  borderRadius: "8px",
                  transition: "0.3s",
                  backgroundColor: "#1976d2",
                  "&:hover": {
                    backgroundColor: "#125aa0",
                    transform: "scale(1.05)",
                    boxShadow: "0px 4px 12px rgba(0,0,0,0.2)",
                    cursor: "pointer",
                  },
                }}
                onClick={() => navigate("/admin/createcourse")}
              >
                Create course
              </Button>
            </Box> */}
          </Box>
        )}
      </Paper>
      <AppDialog />
    </>
  );
};

export default MyCoursesList;
