// import { useEffect, useState } from "react";
// import {
//   Box,
//   Typography,
//   Grid,
//   Button,
//   CircularProgress,
//   Container,
//   Paper,
//   Stack,
//   Avatar,
//   Card,
//   CardContent,
//   CardMedia,
//   CardActions,
//   Chip,
//   Dialog,
//   DialogContent,
//   DialogActions,
//   Divider,
//   IconButton,
//   AppBar,
//   Toolbar,
//   useTheme,
//   useMediaQuery,
//   Menu,
//   MenuItem,
// } from "@mui/material";
// import { Link, useNavigate } from "react-router-dom";
// import api from "../../api/axios";
// import bannerImg from "../../assets/bannerImg.JPG";
// import guitarImg from "../../assets/guitar.jpg";
// import LocationOnIcon from "@mui/icons-material/LocationOn";
// import LocationMap from "../../components/ui/LocationMap";
// import { truncate } from "../../utils/common-util";
// import {
//   Close,
//   Facebook,
//   Instagram,
//   Login,
//   Phone,
//   PlayCircleFilledWhite,
//   YouTube,
// } from "@mui/icons-material";
// import WebsiteLogoImage from "../../assets/grammy-icon1.jpg";

// export default function Landing() {
//   const navigate = useNavigate();
//   const theme = useTheme();
//   const isSm = useMediaQuery(theme.breakpoints.down("sm"));
//   const isMd = useMediaQuery(theme.breakpoints.down("md"));

//   const [anchorEl, setAnchorEl] = useState(null);
//   const avatarMenuOpen = Boolean(anchorEl);

//   const [loginDialogOpen, setLoginDialogOpen] = useState(false);
//   const handleOpenLoginDialog = () => setLoginDialogOpen(true);
//   const handleCloseLoginDialog = () => setLoginDialogOpen(false);

//   const [instrumentList, setInstrumentList] = useState([]);
//   const [courseList, setCourseList] = useState([]);

//   const [loadingInstruments, setLoadingInstruments] = useState(true);
//   const [loadingCourses, setLoadingCourses] = useState(true);
//   const loading = loadingInstruments || loadingCourses;

//   const [modalOpen, setModalOpen] = useState(false);
//   const [selectedItem, setSelectedItem] = useState(null);
//   const [selectedType, setSelectedType] = useState("");

//   const handleViewDetails = (item, type) => {
//     setSelectedItem(item);
//     setSelectedType(type);
//     setModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setModalOpen(false);
//     setSelectedItem(null);
//     setSelectedType("");
//   };

//   useEffect(() => {
//     getInstruments();
//     getCourses();
//   }, []);

//   const getInstruments = async () => {
//     try {
//       setLoadingInstruments(true);
//       const body = {
//         query: {},
//         projection: {},
//         options: {
//           skip: 0,
//           limit: 4,
//           sort: { createdAt: -1 },
//         },
//       };
//       const res = await api.post("/admin/landingallinstumnts", body);
//       setInstrumentList(res.data.data || []);
//     } finally {
//       setLoadingInstruments(false);
//     }
//   };

//   const getCourses = async () => {
//     try {
//       setLoadingCourses(true);
//       const body = {
//         query: {},
//         projection: {},
//         options: {
//           skip: 0,
//           limit: 4,
//           sort: { createdAt: -1 },
//         },
//       };
//       const res = await api.post("/admin/landingallcourses", body);
//       setCourseList(res.data.data || []);
//     } finally {
//       setLoadingCourses(false);
//     }
//   };

//   const handleAvatarClick = (event) => {
//     setAnchorEl(event.currentTarget);
//   };
//   const handleAvatarClose = () => {
//     setAnchorEl(null);
//   };

//   if (loading)
//     return (
//       <Box
//         height="60vh"
//         display="flex"
//         alignItems="center"
//         justifyContent="center"
//       >
//         <CircularProgress size={40} />
//       </Box>
//     );

//   return (
//     <>
//       <AppBar
//         position="fixed"
//         elevation={6}
//         sx={{
//           background:
//             "linear-gradient(90deg, rgba(7, 7, 62, 1) 0%, rgba(2, 30, 69, 1) 50%, rgba(10, 47, 72, 1) 100%)",
//           color: "#fff",
//           backdropFilter: "saturate(140%) blur(6px)",
//         }}
//       >
//         <Toolbar sx={{ px: { xs: 1, sm: 3 }, py: { xs: 0.5, sm: 1 } }}>
//           <Stack direction="row" alignItems="center" spacing={1}>
//             <img
//               src={WebsiteLogoImage}
//               alt="Musically"
//               style={{
//                 width: 90,
//                 height: 52,
//                 borderRadius: 20,
//               }}
//             />
//           </Stack>

//           <Box sx={{ flexGrow: 1 }} />

//           <Stack
//             direction="row"
//             spacing={1}
//             alignItems="center"
//             sx={{ ml: { xs: 0, sm: 0 } }}
//           >
//             <IconButton
//               onClick={handleAvatarClick}
//               size="small"
//               aria-controls={avatarMenuOpen ? "avatar-menu" : undefined}
//               aria-haspopup="true"
//               aria-expanded={avatarMenuOpen ? "true" : undefined}
//               sx={{
//                 p: 0.8,
//                 pr: 1.2,
//                 borderRadius: "50px",
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 1,
//                 transition: "all 0.3s ease",
//                 backgroundColor: "transparent",

//                 "&:hover": {
//                   backgroundColor: "rgba(255,255,255,0.1)",
//                   transform: "scale(1.03)",
//                   boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
//                 },
//               }}
//             >
//               <Typography
//                 variant="body2"
//                 sx={{
//                   maxWidth: { xs: 80, sm: 120, md: 150 },
//                   whiteSpace: "nowrap",
//                   overflow: "hidden",
//                   textOverflow: "ellipsis",
//                   fontWeight: 600,
//                   letterSpacing: "0.3px",
//                   color: "rgba(255,255,255,0.9)",
//                   transition: "color 0.3s ease",
//                   fontSize: { xs: "0.8rem", sm: "1.15rem" },
//                   ".MuiIconButton-root:hover &": {
//                     color: "#fff",
//                   },
//                 }}
//               >
//                 Guest User
//               </Typography>

//               <Avatar
//                 alt="User"
//                 sx={{
//                   width: 36,
//                   height: 36,
//                   bgcolor: "rgba(255,255,255,0.15)",
//                   fontWeight: 700,
//                   cursor: "pointer",
//                   transition: "all 0.3s ease",
//                   ".MuiIconButton-root:hover &": {
//                     boxShadow: "0 0 10px rgba(255,255,255,0.8)",
//                     transform: "scale(1.05)",
//                     bgcolor: "rgba(255,255,255,0.25)",
//                   },
//                 }}
//               >
//                 {"G"}
//               </Avatar>
//             </IconButton>
//           </Stack>

//           <Menu
//             id="avatar-menu"
//             anchorEl={anchorEl}
//             open={avatarMenuOpen}
//             onClose={handleAvatarClose}
//             transformOrigin={{ horizontal: "right", vertical: "top" }}
//             anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
//           >
//             <MenuItem onClick={() => navigate("/login")}>
//               <Login sx={{ mr: 1, color: "error.main" }} /> Login
//             </MenuItem>
//           </Menu>
//         </Toolbar>
//       </AppBar>

//       <Box
//         component="section"
//         aria-label="Hero banner"
//         sx={{
//           mt: 6,
//           height: { xs: "50vh", sm: "50vh", md: "60vh", lg: "68vh" },
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           textAlign: "center",
//           color: "#fff",
//           position: "relative",
//           overflow: "hidden",
//         }}
//       >
//         <Box
//           sx={{
//             position: "absolute",
//             inset: 0,
//             backgroundImage: `url(${bannerImg})`,
//             backgroundSize: "cover",
//             backgroundPosition: "center",
//             filter: "blur(3px)",
//             transform: "scale(1.06)",
//             zIndex: 0,
//           }}
//         />

//         <Box
//           sx={{
//             position: "absolute",
//             inset: 0,
//             backgroundColor: "rgba(0,0,0,0.45)",
//             zIndex: 1,
//           }}
//         />

//         <Box
//           sx={{
//             position: "relative",
//             zIndex: 2,
//             px: { xs: 2, sm: 4 },
//             width: "100%",
//             maxWidth: 1100,
//           }}
//         >
//           <Typography
//             component="h1"
//             variant="h2"
//             fontWeight={800}
//             gutterBottom
//             sx={{
//               fontSize: {
//                 xs: "1.45rem",
//                 sm: "1.9rem",
//                 md: "2.6rem",
//                 lg: "3rem",
//               },
//               lineHeight: { xs: 1.08, sm: 1.03, md: 1.02 },
//               mb: { xs: 1, sm: 1.5, md: 2 },
//               textShadow: "0 6px 18px rgba(0,0,0,0.45)",
//             }}
//           >
//             Welcome to Our Music World
//           </Typography>

//           <Typography
//             variant="h6"
//             component="p"
//             sx={{
//               fontSize: { xs: "0.95rem", sm: "1.05rem", md: "1.15rem" },
//               maxWidth: { xs: "95%", sm: 640 },
//               mx: "auto",
//               color: "rgba(255,255,255,0.95)",
//               mb: { xs: 2, sm: 3 },
//             }}
//           >
//             Discover premium instruments and professional courses that help you
//             master your musical passion.
//           </Typography>

//           <Stack
//             direction={{ xs: "column", sm: "row" }}
//             spacing={{ xs: 1.25, sm: 2 }}
//             justifyContent="center"
//             alignItems="center"
//             sx={{ mt: 0.5 }}
//           >
//             <Button
//               onClick={handleOpenLoginDialog}
//               variant="contained"
//               size={isSm ? "medium" : "large"}
//               fullWidth={isSm}
//               sx={{
//                 borderRadius: "30px",
//                 px: { xs: 2.5, sm: 4 },
//                 py: { xs: 0.9, sm: 1.1 },
//                 fontWeight: 700,
//                 boxShadow: "0 10px 30px rgba(25,118,210,0.14)",
//                 textTransform: "none",
//               }}
//             >
//               Browse Instruments
//             </Button>

//             <Button
//               onClick={handleOpenLoginDialog}
//               variant="outlined"
//               size={isSm ? "medium" : "large"}
//               fullWidth={isSm}
//               sx={{
//                 borderRadius: "30px",
//                 px: { xs: 2.5, sm: 4 },
//                 py: { xs: 0.9, sm: 1.1 },
//                 fontWeight: 700,
//                 textTransform: "none",
//                 color: "#fff",
//                 borderColor: "rgba(255,255,255,0.18)",
//                 "&:hover": {
//                   backgroundColor: "rgba(255,255,255,0.04)",
//                   borderColor: "rgba(255,255,255,0.28)",
//                 },
//               }}
//             >
//               View Courses
//             </Button>
//           </Stack>
//         </Box>
//       </Box>

//       <Container sx={{ py: 4 }}>
//         <Grid container spacing={2} justifyContent="center">
//           <Grid item xs={6} sm={3}>
//             <Paper elevation={1} sx={{ p: 2, textAlign: "center" }}>
//               <Typography variant="h5" fontWeight={700}>
//                 10+
//               </Typography>
//               <Typography variant="caption" color="text.secondary">
//                 Happy Students
//               </Typography>
//             </Paper>
//           </Grid>
//           <Grid item xs={6} sm={3}>
//             <Paper elevation={1} sx={{ p: 2, textAlign: "center" }}>
//               <Typography variant="h5" fontWeight={700}>
//                 20+
//               </Typography>
//               <Typography variant="caption" color="text.secondary">
//                 Instruments Sold
//               </Typography>
//             </Paper>
//           </Grid>
//           <Grid item xs={6} sm={3}>
//             <Paper elevation={1} sx={{ p: 2, textAlign: "center" }}>
//               <Typography variant="h5" fontWeight={700}>
//                 4.9/5
//               </Typography>
//               <Typography variant="caption" color="text.secondary">
//                 Average Rating
//               </Typography>
//             </Paper>
//           </Grid>
//         </Grid>
//       </Container>

//       <Container sx={{ py: { xs: 3, md: 5 } }}>
//         <Paper
//           elevation={0}
//           sx={{
//             p: { xs: 2, sm: 3, md: 4 },
//             textAlign: "center",
//             borderRadius: 3,
//             background: "linear-gradient(135deg, #02025e, #5b5bff)",
//             color: "#fff",
//           }}
//         >
//           <Typography
//             variant="h4"
//             fontWeight={800}
//             sx={{
//               fontSize: {
//                 xs: "1.2rem",
//                 sm: "1.6rem",
//                 md: "1.6rem",
//               },
//               mb: 1,
//             }}
//           >
//             Buy Any Instrument & Get Course related to that instrument FREE 🎶
//           </Typography>

//           <Typography
//             variant="body1"
//             sx={{
//               maxWidth: 720,
//               mx: "auto",
//               opacity: 0.95,
//               fontSize: {
//                 xs: "0.85rem",
//                 sm: "0.95rem",
//                 md: "1.05rem",
//               },
//             }}
//           >
//             When you purchase any instrument, the course related to that
//             instrument is absolutely <strong>FREE</strong>. Learn faster with
//             the perfect instrument–course combo.
//           </Typography>
//         </Paper>
//       </Container>

//       <Container sx={{ py: { xs: 4, md: 6 } }}>
//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "space-between",
//             flexDirection: { xs: "column", sm: "row" },
//             alignItems: { xs: "flex-start", sm: "center" },
//             mb: 3,
//             gap: 2,
//           }}
//         >
//           <Box>
//             <Typography
//               variant="h4"
//               fontWeight={800}
//               sx={{
//                 color: "#02025e",
//                 fontSize: { xs: "1.6rem", sm: "2rem" },
//               }}
//             >
//               Featured Instruments
//             </Typography>

//             <Typography
//               variant="body2"
//               sx={{
//                 mt: 0.5,
//                 color: "text.secondary",
//                 maxWidth: 480,
//               }}
//             >
//               Hand-picked instruments designed to inspire creativity and
//               accelerate your musical journey.
//             </Typography>
//           </Box>

//           <Button
//             variant="contained"
//             onClick={handleOpenLoginDialog}
//             size="medium"
//             sx={{
//               px: 3,
//               py: 1,
//               borderRadius: "999px",
//               fontWeight: 600,
//               textTransform: "none",
//               background: "linear-gradient(135deg, #02025e, #1e40af)",
//               color: "#fff",
//               boxShadow: "0 8px 20px rgba(2,2,94,0.25)",
//               "&:hover": {
//                 background: "linear-gradient(135deg, #01013d, #1e3a8a)",
//                 boxShadow: "0 12px 28px rgba(2,2,94,0.35)",
//               },
//             }}
//           >
//             View All
//           </Button>
//         </Box>

//         <Paper
//           elevation={0}
//           sx={{
//             p: { xs: 2, sm: 3 },
//             mb: 4,
//             borderRadius: 3,
//             background: "rgba(2, 2, 94, 0.04)",
//             borderLeft: 3,
//           }}
//         >
//           <Typography
//             variant="body1"
//             sx={{
//               fontSize: { xs: "14px", sm: "16px", md: "18px" },
//               lineHeight: 1.8,
//               color: "#1b085c",
//               maxWidth: 900,
//             }}
//           >
//             Our featured instruments are carefully curated to offer the perfect
//             balance of sound quality, comfort, and durability. Whether you're a
//             beginner or an advanced learner, each instrument is chosen to help
//             you learn faster and play with confidence.
//           </Typography>
//         </Paper>

//         <Grid container spacing={3}>
//           {instrumentList.map((it, idx) => (
//             <Grid key={it._id} item xs={12} sm={6} md={4}>
//               <Box
//                 sx={{
//                   transition: "0.3s",
//                   "&:hover": { transform: "translateY(-6px)" },
//                 }}
//               >
//                 <Card
//                   key={idx}
//                   sx={{
//                     width: {
//                       xs: "100%",
//                       sm: 240,
//                       md: 220,
//                     },
//                     maxWidth: "100%",
//                     display: "flex",
//                     flexDirection: "column",
//                     borderRadius: { xs: 2, sm: 3 },
//                     overflow: "hidden",
//                     background: "rgba(255,255,255,0.85)",
//                     backdropFilter: "blur(6px)",
//                     boxShadow: {
//                       xs: "0 6px 14px rgba(0,0,0,0.12)",
//                       sm: "0 10px 25px rgba(0,0,0,0.12)",
//                     },
//                     transition: "all .3s ease",
//                     cursor: "pointer",
//                     "&:hover": {
//                       transform: { sm: "translateY(-6px)" },
//                       boxShadow: {
//                         sm: "0 20px 40px rgba(0,0,0,0.22)",
//                       },
//                     },
//                   }}
//                 >
//                   <Box sx={{ position: "relative" }}>
//                     <CardMedia
//                       component="img"
//                       alt={it?.title}
//                       height="130"
//                       image={it?.instrument_images?.[0]?.url}
//                       sx={{
//                         objectFit: "cover",
//                         filter: "brightness(90%)",
//                         transition: ".3s ease",
//                         "&:hover": { filter: "brightness(75%)" },
//                       }}
//                     />

//                     <Box
//                       sx={{
//                         position: "absolute",
//                         bottom: 8,
//                         right: 8,
//                         background: "linear-gradient(135deg, #3bd43b, #27b827)",
//                         color: "#fff",
//                         padding: "4px 14px",
//                         borderRadius: "20px",
//                         fontSize: "0.78rem",
//                         fontWeight: 700,
//                         letterSpacing: "0.5px",
//                         backdropFilter: "blur(4px)",
//                         boxShadow: "0px 4px 15px rgba(0,255,0,0.4)",
//                         overflow: "hidden",
//                         zIndex: 2,

//                         transition: "0.35s ease",
//                         "&:hover": {
//                           transform: "scale(1.08)",
//                           boxShadow: "0px 6px 22px rgba(0,255,0,0.65)",
//                         },

//                         "&::after": {
//                           content: '""',
//                           position: "absolute",
//                           top: 0,
//                           left: "-100%",
//                           width: "100%",
//                           height: "100%",
//                           background:
//                             "linear-gradient(120deg, transparent, rgba(255,255,255,0.6), transparent)",
//                           transform: "skewX(-20deg)",
//                           animation: "shine 2.3s infinite",
//                         },

//                         "@keyframes shine": {
//                           "0%": { left: "-100%" },
//                           "50%": { left: "100%" },
//                           "100%": { left: "100%" },
//                         },
//                       }}
//                     >
//                       ₹ {it?.instrument_price?.toLocaleString()}
//                     </Box>

//                     <Box
//                       sx={{
//                         position: "absolute",
//                         bottom: 0,
//                         width: "100%",
//                         height: "50px",
//                         background:
//                           "linear-gradient(to top, rgba(0,0,0,0.6), transparent)",
//                       }}
//                     />
//                   </Box>

//                   <CardContent sx={{ p: 1.6 }}>
//                     <Typography
//                       variant="subtitle1"
//                       fontWeight={700}
//                       sx={{
//                         fontSize: { xs: "0.95rem", sm: "1rem" },
//                         color: "#151557",
//                         mb: 0.6,
//                         whiteSpace: "nowrap",
//                         overflow: "hidden",
//                         textOverflow: "ellipsis",
//                       }}
//                     >
//                       {it?.instrument_title}
//                     </Typography>

//                     <Typography
//                       variant="body2"
//                       sx={{
//                         fontSize: { xs: "0.75rem", sm: "0.82rem" },
//                         color: "text.secondary",
//                         lineHeight: 1.4,
//                       }}
//                     >
//                       {truncate(it?.instrurment_description, 55)}
//                     </Typography>
//                   </CardContent>

//                   <CardActions
//                     sx={{
//                       px: { xs: 1.2, sm: 1.6 },
//                       pb: { xs: 1.2, sm: 1.6 },
//                       gap: 1,
//                       justifyContent: "space-between",
//                     }}
//                   >
//                     <Button
//                       variant="outlined"
//                       size="large"
//                       fullWidth
//                       sx={{
//                         whiteSpace: "nowrap",
//                         overflow: "hidden",
//                         textOverflow: "ellipsis",
//                         minHeight: 32,
//                         textTransform: "none",
//                         borderRadius: "6px",
//                         color: "#1e88e5",
//                         fontSize: { xs: "0.65rem", sm: "0.72rem" },
//                         px: { xs: 1.2, sm: 1.6 },
//                         py: 0.4,
//                         fontWeight: 700,
//                         backdropFilter: "blur(4px)",
//                       }}
//                       onClick={() => handleViewDetails(it, "instrument")}
//                     >
//                       View Details
//                     </Button>

//                     <Button
//                       variant="contained"
//                       size="large"
//                       fullWidth
//                       sx={{
//                         whiteSpace: "nowrap",
//                         overflow: "hidden",
//                         textOverflow: "ellipsis",
//                         minHeight: 32,
//                         textTransform: "none",
//                         borderRadius: "6px",
//                         fontSize: { xs: "0.65rem", sm: "0.72rem" },
//                         px: { xs: 1.2, sm: 1.6 },
//                         py: 0.4,
//                         fontWeight: 700,
//                         backdropFilter: "blur(4px)",
//                         background: "linear-gradient(135deg, #6366f1, #4338ca)",
//                         "&:hover": {
//                           background:
//                             "linear-gradient(135deg, #4338ca, #312e81)",
//                           boxShadow: "0 6px 18px rgba(49,46,129,0.5)",
//                         },
//                       }}
//                       onClick={handleOpenLoginDialog}
//                     >
//                       Add To Cart
//                     </Button>
//                   </CardActions>
//                 </Card>
//               </Box>
//             </Grid>
//           ))}
//         </Grid>
//       </Container>

//       <Container sx={{ py: { xs: 4, md: 6 } }}>
//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "space-between",
//             flexDirection: { xs: "column", sm: "row" },
//             alignItems: { xs: "flex-start", sm: "center" },
//             mb: { xs: 2.5, md: 3.5 },
//             gap: 2,
//           }}
//         >
//           <Box>
//             <Typography
//               variant="h4"
//               fontWeight={800}
//               sx={{
//                 fontSize: { xs: "1.4rem", sm: "1.7rem", md: "2rem" },
//                 color: "#02025e",
//               }}
//             >
//               Popular Courses
//             </Typography>

//             <Typography
//               variant="body2"
//               sx={{
//                 mt: 0.6,
//                 color: "#6b7280",
//                 maxWidth: "520px",
//                 fontSize: { xs: "0.85rem", sm: "0.95rem" },
//               }}
//             >
//               Learn from expertly crafted courses designed to help you grow
//               musically.
//             </Typography>
//           </Box>

//           <Button
//             variant="contained"
//             onClick={handleOpenLoginDialog}
//             size="medium"
//             sx={{
//               px: 3,
//               py: 1,
//               borderRadius: "999px",
//               fontWeight: 600,
//               textTransform: "none",
//               background: "linear-gradient(135deg, #02025e, #1e40af)",
//               color: "#fff",
//               boxShadow: "0 8px 20px rgba(2,2,94,0.25)",
//               "&:hover": {
//                 background: "linear-gradient(135deg, #01013d, #1e3a8a)",
//                 boxShadow: "0 12px 28px rgba(2,2,94,0.35)",
//               },
//             }}
//           >
//             View All
//           </Button>
//         </Box>

//         <Box
//           sx={{
//             mb: { xs: 3, md: 4 },
//             p: { xs: 2, sm: 2.5 },
//             borderRadius: "14px",
//             background:
//               "linear-gradient(90deg, rgba(2,2,94,0.06), rgba(30,64,175,0.02))",
//             borderLeft: "4px solid #02025e",
//           }}
//         >
//           <Typography
//             sx={{
//               lineHeight: 1.9,
//               color: "#374151",
//               fontWeight: 400,
//               fontSize: { xs: "0.95rem", sm: "1.05rem", md: "1.1rem" },
//               letterSpacing: "0.2px",
//             }}
//           >
//             Explore our most popular courses, crafted to help learners grow with{" "}
//             <Box component="span" sx={{ fontWeight: 600, color: "#02025e" }}>
//               clarity
//             </Box>
//             ,{" "}
//             <Box component="span" sx={{ fontWeight: 600, color: "#02025e" }}>
//               confidence
//             </Box>
//             , and{" "}
//             <Box component="span" sx={{ fontWeight: 600, color: "#02025e" }}>
//               creativity
//             </Box>
//             . Each course blends engaging lessons, practical guidance, and
//             real-world application — ensuring a meaningful and enjoyable
//             learning experience for every student.
//           </Typography>
//         </Box>

//         <Grid container spacing={3}>
//           {courseList.map((course, idx) => (
//             <Grid key={course._id} item xs={12} sm={6} md={4}>
//               <Box
//                 sx={{
//                   transition: "0.3s",
//                   "&:hover": { transform: "translateY(-6px)" },
//                 }}
//               >
//                 <Card
//                   sx={{
//                     mt: 1,
//                     width: {
//                       xs: "100%",
//                       sm: 260,
//                       md: 220,
//                     },
//                     borderRadius: { xs: 2, sm: 3 },
//                     overflow: "hidden",
//                     background: "rgba(255,255,255,0.95)",
//                     backdropFilter: "blur(8px)",
//                     boxShadow: {
//                       xs: "0 4px 12px rgba(0,0,0,0.12)",
//                       sm: "0 6px 20px rgba(0,0,0,0.15)",
//                     },
//                     transition: "all 0.3s ease",
//                     cursor: "pointer",
//                     "&:hover": {
//                       transform: { sm: "translateY(-4px)" },
//                       boxShadow: {
//                         sm: "0 16px 32px rgba(0,0,0,0.25)",
//                       },
//                     },
//                   }}
//                 >
//                   <Box sx={{ position: "relative" }}>
//                     <CardMedia
//                       component="img"
//                       height="130"
//                       image={course.thumbnail_image?.[0]?.url}
//                       alt={course.course_title}
//                       sx={{
//                         objectFit: "cover",
//                         transition: "0.3s ease",
//                         "&:hover": { filter: "brightness(85%)" },
//                       }}
//                     />

//                     <PlayCircleFilledWhite
//                       sx={{
//                         position: "absolute",
//                         top: "50%",
//                         left: "50%",
//                         transform: "translate(-50%, -50%)",
//                         fontSize: { xs: 48, sm: 42 },
//                         color: "white",
//                         opacity: 0.9,
//                       }}
//                     />

//                     <Box
//                       sx={{
//                         position: "absolute",
//                         bottom: 0,
//                         left: 0,
//                         width: "100%",
//                         height: "55px",
//                         background:
//                           "linear-gradient(to top, rgba(0,0,0,0.65), rgba(0,0,0,0))",
//                       }}
//                     />

//                     <Typography
//                       variant="subtitle1"
//                       sx={{
//                         position: "absolute",
//                         bottom: 12,
//                         left: 12,
//                         maxWidth: "90%",
//                         color: "#fff",
//                         fontWeight: 700,
//                         px: 1.3,
//                         py: 0.6,
//                         borderRadius: 1.5,
//                         backdropFilter: "blur(6px)",
//                         background:
//                           "linear-gradient(135deg, rgba(0,0,0,0.65), rgba(0,0,0,0.25))",
//                         fontSize: { xs: "0.85rem", sm: "0.95rem" },
//                         textShadow: "0px 2px 6px rgba(0,0,0,0.5)",
//                         overflow: "hidden",
//                         textOverflow: "ellipsis",
//                         whiteSpace: "nowrap",
//                       }}
//                     >
//                       {course.course_title}
//                     </Typography>
//                   </Box>

//                   <CardContent
//                     sx={{
//                       p: { xs: 1.4, sm: 1.8 },
//                       position: "relative",
//                     }}
//                   >
//                     <Typography
//                       variant="body1"
//                       color="text.secondary"
//                       sx={{
//                         fontSize: { xs: "0.75rem", sm: "0.82rem" },
//                         color: "text.secondary",
//                         lineHeight: 1.4,
//                       }}
//                     >
//                       {truncate(course.course_description, 55)}
//                     </Typography>

//                     <Box
//                       sx={{
//                         display: "flex",
//                         justifyContent: "space-between",
//                         alignItems: "center",
//                         mb: 1,
//                         mt: 1,
//                       }}
//                     >
//                       <Chip
//                         label={`₹ ${course.course_price}`}
//                         size="small"
//                         sx={{
//                           height: { xs: 24, sm: 28 },
//                           fontSize: { xs: "0.65rem", sm: "0.75rem" },
//                           fontWeight: 800,
//                           borderRadius: 2,
//                           background: "#fde6e3ff",
//                           color: "#a51106ff",
//                         }}
//                       />
//                     </Box>

//                     <Box
//                       sx={{
//                         display: "flex",
//                         gap: 1,
//                         width: "100%",
//                       }}
//                     >
//                       <Button
//                         variant="outlined"
//                         size="large"
//                         fullWidth
//                         sx={{
//                           whiteSpace: "nowrap",
//                           overflow: "hidden",
//                           textOverflow: "ellipsis",
//                           minHeight: 32,
//                           textTransform: "none",
//                           borderRadius: "6px",
//                           color: "#1e88e5",
//                           fontSize: { xs: "0.65rem", sm: "0.72rem" },
//                           px: { xs: 1.2, sm: 1.6 },
//                           py: 0.4,
//                           fontWeight: 700,
//                           backdropFilter: "blur(4px)",
//                         }}
//                         onClick={() => handleViewDetails(course, "course")}
//                       >
//                         View Details
//                       </Button>
//                       <Button
//                         variant="contained"
//                         size="large"
//                         fullWidth
//                         sx={{
//                           whiteSpace: "nowrap",
//                           overflow: "hidden",
//                           textOverflow: "ellipsis",
//                           minHeight: 32,
//                           textTransform: "none",
//                           borderRadius: "6px",
//                           fontSize: { xs: "0.65rem", sm: "0.72rem" },
//                           px: { xs: 1.2, sm: 1.6 },
//                           py: 0.4,
//                           fontWeight: 700,
//                           backdropFilter: "blur(4px)",
//                           background:
//                             "linear-gradient(135deg, #6366f1, #4338ca)",
//                           "&:hover": {
//                             background:
//                               "linear-gradient(135deg, #4338ca, #312e81)",
//                             boxShadow: "0 6px 18px rgba(49,46,129,0.5)",
//                           },
//                         }}
//                         onClick={handleOpenLoginDialog}
//                       >
//                         Add To Cart
//                       </Button>
//                     </Box>
//                   </CardContent>
//                 </Card>
//               </Box>
//             </Grid>
//           ))}
//         </Grid>
//       </Container>

//       <Container sx={{ py: 6 }}>
//         <Paper
//           elevation={2}
//           sx={{
//             p: { xs: 2, md: 4 },
//             display: "flex",
//             gap: 3,
//             alignItems: "center",
//             flexDirection: { xs: "column", md: "row" },
//           }}
//         >
//           <Avatar
//             src={guitarImg}
//             alt="student"
//             sx={{ width: 72, height: 72 }}
//           />
//           <Box>
//             <Typography variant="h6" fontWeight={700}>
//               What our students say
//             </Typography>
//             <Typography variant="body2" color="text.secondary">
//               "Amazing lessons and friendly instructors — I went from zero to
//               playing my first song in 6 weeks!"
//             </Typography>
//           </Box>
//           <Box sx={{ ml: "auto", mt: { xs: 2, md: 0 } }}>
//             <Button onClick={handleOpenLoginDialog} variant="contained">
//               Start Learning
//             </Button>
//           </Box>
//         </Paper>
//       </Container>

//       <Container sx={{ py: { xs: 4, md: 6 } }}>
//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "space-between",
//             flexDirection: { xs: "column", sm: "row" },
//             alignItems: { xs: "flex-start", sm: "center" },
//             mb: { xs: 2.5, md: 3.5 },
//             gap: 2,
//           }}
//         >
//           <Box>
//             <Typography
//               variant="h4"
//               fontWeight={800}
//               sx={{
//                 fontSize: { xs: "1.4rem", sm: "1.7rem", md: "2rem" },
//                 color: "#02025e",
//               }}
//             >
//               Visit our Location
//             </Typography>

//             <Typography
//               variant="body2"
//               sx={{
//                 mt: 0.6,
//                 color: "#6b7280",
//                 maxWidth: "520px",
//                 fontSize: { xs: "0.85rem", sm: "0.95rem" },
//               }}
//             >
//               Discover a welcoming space where music comes alive and learning
//               feels inspiring.
//             </Typography>
//           </Box>
//         </Box>

//         <Box
//           sx={{
//             mb: { xs: 3, md: 4 },
//             p: { xs: 2, sm: 2.5 },
//             borderRadius: "14px",
//             background:
//               "linear-gradient(90deg, rgba(2,2,94,0.06), rgba(30,64,175,0.02))",
//             borderLeft: "4px solid #02025e",
//           }}
//         >
//           <Typography
//             sx={{
//               lineHeight: 1.9,
//               color: "#374151",
//               fontWeight: 400,
//               fontSize: { xs: "0.95rem", sm: "1.05rem", md: "1.1rem" },
//               letterSpacing: "0.2px",
//             }}
//           >
//             Visit our academy and experience music learning in a{" "}
//             <Box component="span" sx={{ fontWeight: 600, color: "#02025e" }}>
//               welcoming
//             </Box>
//             ,{" "}
//             <Box component="span" sx={{ fontWeight: 600, color: "#02025e" }}>
//               creative
//             </Box>{" "}
//             and{" "}
//             <Box component="span" sx={{ fontWeight: 600, color: "#02025e" }}>
//               inspiring
//             </Box>{" "}
//             environment. Our location is thoughtfully designed to provide
//             students with a comfortable space where passion meets practice.
//             <br />
//             <br />
//             Conveniently located in{" "}
//             <Box component="span" sx={{ fontWeight: 600, color: "#02025e" }}>
//               Indore
//             </Box>
//             , our academy is easily accessible and equipped with modern
//             classrooms, professional instruments, and expert mentors to guide
//             you at every step. Whether you're a beginner or an advanced learner,
//             we invite you to visit us and begin your musical journey with
//             confidence.
//           </Typography>
//         </Box>

//         <LocationMap city="Maestro Music Classes - Flute, Guitar, Piano & Singing Academy, Indore" />
//       </Container>

//       <Box
//         component="footer"
//         sx={{
//           backgroundColor: "#020247ff",
//           color: "white",
//           py: { xs: 4, sm: 6 },
//           mt: { xs: 6, sm: 8 },
//         }}
//       >
//         <Container maxWidth="lg">
//           <Grid container spacing={4}>
//             <Grid item xs={12} sm={6} md={3}>
//               <Typography
//                 variant="h6"
//                 fontWeight="bold"
//                 gutterBottom
//                 sx={{
//                   fontSize: {
//                     xs: "1rem",
//                     sm: "1.25rem",
//                     md: "1.4rem",
//                   },
//                 }}
//               >
//                 Grammy
//               </Typography>
//               <Typography
//                 variant="body2"
//                 sx={{
//                   opacity: 0.8,
//                   fontSize: {
//                     xs: "0.8rem",
//                     sm: "0.875rem",
//                     md: "0.95rem",
//                   },
//                 }}
//               >
//                 Bringing music and learning together — explore instruments,
//                 courses, and creativity.
//               </Typography>
//             </Grid>

//             <Grid item xs={12} sm={6} md={3}>
//               <Typography fontWeight="bold" gutterBottom>
//                 Follow Us
//               </Typography>
//               <Box>
//                 <IconButton
//                   color="inherit"
//                   href="https://www.facebook.com/shubh.patidarr"
//                 >
//                   <Facebook />
//                 </IconButton>

//                 <IconButton
//                   color="inherit"
//                   href="https://www.instagram.com/shubhampatidar_o1?igsh=ZXR6NDdnb3I5bnBv"
//                 >
//                   <Instagram />
//                 </IconButton>

//                 <IconButton
//                   color="inherit"
//                   href="https://youtube.com/@keymelodies?si=O_jdBIjP5R_BjkWg"
//                 >
//                   <YouTube />
//                 </IconButton>
//               </Box>
//             </Grid>

//             <Grid item xs={12} sm={6} md={3}>
//               <Typography fontWeight="bold" gutterBottom>
//                 Contact Us
//               </Typography>
//               <Box
//                 sx={{
//                   display: "flex",
//                   alignItems: "center",
//                   gap: 1,
//                   opacity: 0.85,
//                   "&:hover": { opacity: 1 },
//                 }}
//               >
//                 <Phone fontSize="small" />

//                 <Typography
//                   variant="body2"
//                   sx={{ fontWeight: 500, color: "inherit" }}
//                 >
//                   +917880222377
//                 </Typography>
//               </Box>
//             </Grid>

//             <Grid item xs={12} sm={6} md={3}>
//               <Typography fontWeight="bold" gutterBottom>
//                 Our Location
//               </Typography>
//               <Stack
//                 direction="row"
//                 spacing={1}
//                 alignItems="flex-start"
//                 sx={{
//                   cursor: "pointer",
//                   opacity: 0.85,
//                   "&:hover": { opacity: 1 },
//                 }}
//                 onClick={() => window.open(openInMaps, "_blank")}
//               >
//                 <LocationOnIcon color="error" sx={{ mt: "2px" }} />

//                 <Box>
//                   <Typography
//                     variant="body2"
//                     fontWeight={600}
//                     sx={{ lineHeight: 1.4 }}
//                   >
//                     Maestro Music Classes
//                   </Typography>

//                   <Typography
//                     variant="caption"
//                     sx={{
//                       display: "block",
//                       opacity: 0.85,
//                       lineHeight: 1.5,
//                     }}
//                   >
//                     H16, Keshar Bagh Rd, near Charming Kidz School, Nalanda
//                     Parisar, Indore, Madhya Pradesh 452009
//                   </Typography>
//                 </Box>
//               </Stack>
//             </Grid>
//           </Grid>

//           <Box
//             sx={{
//               textAlign: "center",
//               mt: 4,
//               borderTop: "1px solid rgba(255,255,255,0.2)",
//               pt: 2,
//             }}
//           >
//             <Typography variant="body2" sx={{ opacity: 0.7 }}>
//               © {new Date().getFullYear()} Grammy. All rights reserved.
//             </Typography>
//           </Box>
//         </Container>
//       </Box>

//       <Dialog
//         open={modalOpen}
//         onClose={handleCloseModal}
//         maxWidth="md"
//         fullWidth
//         PaperProps={{
//           sx: {
//             width: "100%",
//             m: { xs: 1, sm: 2 },
//             maxHeight: "90vh",
//           },
//         }}
//         BackdropProps={{
//           sx: {
//             backgroundColor: "rgba(0,0,0,0.25)",
//           },
//         }}
//       >
//         <IconButton
//           onClick={handleCloseModal}
//           sx={{
//             position: "absolute",
//             right: 8,
//             top: 8,
//             color: (theme) => theme.palette.grey[500],
//             zIndex: 10,
//           }}
//         >
//           <Close />
//         </IconButton>
//         <Box sx={{ mt: 3 }}></Box>
//         <DialogContent>
//           {selectedItem && (
//             <Grid container spacing={3}>
//               <Grid item xs={12} md={6}>
//                 <Card
//                   sx={{
//                     borderRadius: 3,
//                     overflow: "hidden",
//                     mb: 2,
//                     boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
//                   }}
//                 >
//                   <CardMedia
//                     component="img"
//                     image={
//                       selectedItem.selectedImage ||
//                       selectedItem.instrument_images?.[0]?.url ||
//                       selectedItem.thumbnail_image?.[0]?.url
//                     }
//                     alt={
//                       selectedItem.instrument_title || selectedItem.course_title
//                     }
//                     sx={{
//                       objectFit: "cover",
//                       height: { xs: 220, sm: 280, md: 300 },
//                     }}
//                   />
//                 </Card>

//                 <Grid container spacing={1}>
//                   {(selectedItem.instrument_images?.length > 0
//                     ? selectedItem.instrument_images
//                     : selectedItem.thumbnail_image
//                   )?.map((img, index) => (
//                     <Grid item xs={3} sm={2} key={index}>
//                       <Box
//                         sx={{
//                           borderRadius: 2,
//                           overflow: "hidden",
//                           cursor: "pointer",
//                           border:
//                             selectedItem.selectedImage === img.url
//                               ? "3px solid #1976d2"
//                               : "2px solid #ddd",
//                           transition: "0.3s",
//                           "&:hover": { borderColor: "#1976d2" },
//                         }}
//                         onClick={() =>
//                           setSelectedItem((prev) => ({
//                             ...prev,
//                             selectedImage: img.url,
//                           }))
//                         }
//                       >
//                         <CardMedia
//                           component="img"
//                           image={img.url}
//                           sx={{ height: 70, width: "100%", objectFit: "cover" }}
//                         />
//                       </Box>
//                     </Grid>
//                   ))}
//                 </Grid>
//               </Grid>

//               <Grid item xs={12} md={6}>
//                 <Typography variant="h6" fontWeight={700} mb={1}>
//                   {selectedItem.instrument_title || selectedItem.course_title}
//                 </Typography>

//                 <Chip
//                   label={`₹${
//                     selectedItem.instrument_price || selectedItem.course_price
//                   }`}
//                   color="primary"
//                   sx={{ mb: 2, fontSize: { xs: "0.8rem", sm: "0.9rem" } }}
//                 />

//                 <Typography
//                   variant="body2"
//                   color="text.secondary"
//                   sx={{ mb: 2, lineHeight: 1.6 }}
//                 >
//                   {selectedItem.instrurment_description ||
//                     selectedItem.course_description ||
//                     "A beautifully crafted item."}
//                 </Typography>

//                 <Divider sx={{ my: 2 }} />

//                 <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
//                   <Button
//                     variant="outlined"
//                     onClick={handleCloseModal}
//                     sx={{
//                       textTransform: "none",
//                       borderColor: "#1976d2",
//                       color: "#1976d2",
//                       fontWeight: 700,
//                       px: 3,
//                       borderRadius: "10px",
//                       "&:hover": {
//                         backgroundColor: "#1976d2",
//                         color: "#fff",
//                       },
//                     }}
//                   >
//                     Close
//                   </Button>

//                   <Button
//                     onClick={() => navigate("/login")}
//                     variant="contained"
//                     sx={{
//                       textTransform: "none",
//                       fontWeight: 700,
//                       px: 3,
//                       borderRadius: "10px",
//                     }}
//                   >
//                     Please Login to Unlock
//                   </Button>
//                 </Stack>
//               </Grid>
//             </Grid>
//           )}
//         </DialogContent>
//       </Dialog>

//       <Dialog
//         open={loginDialogOpen}
//         onClose={handleCloseLoginDialog}
//         maxWidth="xs"
//         fullWidth
//       >
//         <IconButton
//           onClick={handleCloseLoginDialog}
//           sx={{
//             position: "absolute",
//             right: 8,
//             top: 8,
//             color: (theme) => theme.palette.grey[500],
//             zIndex: 10,
//           }}
//         >
//           <Close />
//         </IconButton>
//         <Box sx={{ mt: 3 }}></Box>
//         <DialogContent sx={{ textAlign: "center", pb: 0 }}>
//           <Typography variant="h6" fontWeight={700} gutterBottom>
//             Login Required
//           </Typography>
//           <Typography variant="body2" color="text.secondary">
//             Please login to continue.
//           </Typography>
//         </DialogContent>

//         <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
//           <Button
//             variant="outlined"
//             onClick={handleCloseLoginDialog}
//             sx={{ borderRadius: 20 }}
//           >
//             Cancel
//           </Button>

//           <Button
//             variant="contained"
//             sx={{ borderRadius: 20 }}
//             onClick={() => navigate("/login")}
//           >
//             Login
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </>
//   );
// }

//////////////////////////////////////

import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Button,
  CircularProgress,
  Container,
  Paper,
  Stack,
  Avatar,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Chip,
  Dialog,
  DialogContent,
  DialogActions,
  Divider,
  IconButton,
  AppBar,
  Toolbar,
  useTheme,
  useMediaQuery,
  Menu,
  MenuItem,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import bannerImg from "../../assets/bannerImg.JPG";
import guitarImg from "../../assets/guitar.jpg";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LocationMap from "../../components/ui/LocationMap";
import GuestInstrumentCard from "../../components/ui/card/GuestInstrumentCard";
import { truncate } from "../../utils/common-util";
import {
  Close,
  Facebook,
  Instagram,
  Login,
  Phone,
  PlayCircleFilledWhite,
  YouTube,
} from "@mui/icons-material";
import GuestCourseCard from "../../components/ui/card/GuestCourseCard";
import { openDialogAction } from "../../features/ui/uiSlice";
import { useDispatch } from "react-redux";
import AppDialog from "../../components/ui/dialog/AppDialog";

export default function Guest() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down("sm"));
  const isMd = useMediaQuery(theme.breakpoints.down("md"));

 
  const [instrumentList, setInstrumentList] = useState([]);
  const [courseList, setCourseList] = useState([]);

  const [loadingInstruments, setLoadingInstruments] = useState(true);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const loading = loadingInstruments || loadingCourses;


  const handleOpenLoginDialog = () => {
    dispatch(
      openDialogAction({
        openDialog: true,
        dialogInfo: { check: "guest_login_required" },
      })
    );
  }

  const handleViewDetails = (item, type) => {
    if (type === "instrument") {
      navigate(`/guest/guestinstrument/${item._id}`);
      return;
    }

    if (type === "course") {
      navigate(`/guest/guestcourse/${item._id}`);
      return;
    }
  };


  useEffect(() => {
    getGuestAllInstruments();
    getGuestAllCourses();
  }, []);

  const getGuestAllInstruments = async () => {
    try {
      setLoadingInstruments(true);
      const body = {
        query: {},
        projection: {},
        options: {
          skip: 0,
          limit: 4,
          sort: { createdAt: -1 },
        },
      };
      const res = await api.post("/admin/guestallinstumnts", body);
      setInstrumentList(res.data.data || []);
    } finally {
      setLoadingInstruments(false);
    }
  };

  const getGuestAllCourses = async () => {
    try {
      setLoadingCourses(true);
      const body = {
        query: {},
        projection: {},
        options: {
          skip: 0,
          limit: 4,
          sort: { createdAt: -1 },
        },
      };
      const res = await api.post("/admin/guestallcourses", body);
      setCourseList(res.data.data || []);
    } finally {
      setLoadingCourses(false);
    }
  };

  if (loading)
    return (
      <Box
        height="60vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <CircularProgress size={40} />
      </Box>
    );

  return (
    <>
      <Box
        component="section"
        aria-label="Hero banner"
        sx={{
          //mt: 6,
          height: { xs: "50vh", sm: "50vh", md: "60vh", lg: "68vh" },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          color: "#fff",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${bannerImg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(3px)",
            transform: "scale(1.06)",
            zIndex: 0,
          }}
        />

        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.45)",
            zIndex: 1,
          }}
        />

        <Box
          sx={{
            position: "relative",
            zIndex: 2,
            px: { xs: 2, sm: 4 },
            width: "100%",
            maxWidth: 1100,
          }}
        >
          <Typography
            component="h1"
            variant="h2"
            fontWeight={800}
            gutterBottom
            sx={{
              fontSize: {
                xs: "1.45rem",
                sm: "1.9rem",
                md: "2.6rem",
                lg: "3rem",
              },
              lineHeight: { xs: 1.08, sm: 1.03, md: 1.02 },
              mb: { xs: 1, sm: 1.5, md: 2 },
              textShadow: "0 6px 18px rgba(0,0,0,0.45)",
            }}
          >
            Welcome to Our Music World
          </Typography>

          <Typography
            variant="h6"
            component="p"
            sx={{
              fontSize: { xs: "0.95rem", sm: "1.05rem", md: "1.15rem" },
              maxWidth: { xs: "95%", sm: 640 },
              mx: "auto",
              color: "rgba(255,255,255,0.95)",
              mb: { xs: 2, sm: 3 },
            }}
          >
            Discover premium instruments and professional courses that help you
            master your musical passion.
          </Typography>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={{ xs: 1.25, sm: 2 }}
            justifyContent="center"
            alignItems="center"
            sx={{ mt: 0.5 }}
          >
            {/* <Button
              onClick={handleOpenLoginDialog}
              variant="contained"
              size={isSm ? "medium" : "large"}
              fullWidth={isSm}
              sx={{
                borderRadius: "30px",
                px: { xs: 2.5, sm: 4 },
                py: { xs: 0.9, sm: 1.1 },
                fontWeight: 700,
                boxShadow: "0 10px 30px rgba(25,118,210,0.14)",
                textTransform: "none",
              }}
            >
              Browse Instruments
            </Button>

            <Button
              onClick={handleOpenLoginDialog}
              variant="outlined"
              size={isSm ? "medium" : "large"}
              fullWidth={isSm}
              sx={{
                borderRadius: "30px",
                px: { xs: 2.5, sm: 4 },
                py: { xs: 0.9, sm: 1.1 },
                fontWeight: 700,
                textTransform: "none",
                color: "#fff",
                borderColor: "rgba(255,255,255,0.18)",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.04)",
                  borderColor: "rgba(255,255,255,0.28)",
                },
              }}
            >
              View Courses
            </Button> */}
            <Button
              component={Link}
              to="/guest/guestinstruments"
              variant="contained"
              size={isSm ? "medium" : "large"}
              fullWidth={isSm}
              sx={{
                borderRadius: "30px",
                px: { xs: 2.5, sm: 4 },
                py: { xs: 0.9, sm: 1.1 },
                fontWeight: 700,
                boxShadow: "0 10px 30px rgba(25,118,210,0.14)",
                textTransform: "none",
              }}
            >
              Browse Instruments
            </Button>

            <Button
              component={Link}
              to="/guest/guestcourses"
              variant="outlined"
              size={isSm ? "medium" : "large"}
              fullWidth={isSm}
              sx={{
                borderRadius: "30px",
                px: { xs: 2.5, sm: 4 },
                py: { xs: 0.9, sm: 1.1 },
                fontWeight: 700,
                textTransform: "none",
                color: "#fff",
                borderColor: "rgba(255,255,255,0.18)",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.04)",
                  borderColor: "rgba(255,255,255,0.28)",
                },
              }}
            >
              View Courses
            </Button>
          </Stack>
        </Box>
      </Box>

      <Container sx={{ py: 4 }}>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={6} sm={3}>
            <Paper elevation={1} sx={{ p: 2, textAlign: "center" }}>
              <Typography variant="h5" fontWeight={700}>
                10+
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Happy Students
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Paper elevation={1} sx={{ p: 2, textAlign: "center" }}>
              <Typography variant="h5" fontWeight={700}>
                20+
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Instruments Sold
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Paper elevation={1} sx={{ p: 2, textAlign: "center" }}>
              <Typography variant="h5" fontWeight={700}>
                4.9/5
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Average Rating
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      <Container sx={{ py: { xs: 3, md: 5 } }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, sm: 3, md: 4 },
            textAlign: "center",
            borderRadius: 3,
            background: "linear-gradient(135deg, #02025e, #5b5bff)",
            color: "#fff",
          }}
        >
          <Typography
            variant="h4"
            fontWeight={800}
            sx={{
              fontSize: {
                xs: "1.2rem",
                sm: "1.6rem",
                md: "1.6rem",
              },
              mb: 1,
            }}
          >
            Buy Any Instrument & Get Course related to that instrument FREE 🎶
          </Typography>

          <Typography
            variant="body1"
            sx={{
              maxWidth: 720,
              mx: "auto",
              opacity: 0.95,
              fontSize: {
                xs: "0.85rem",
                sm: "0.95rem",
                md: "1.05rem",
              },
            }}
          >
            When you purchase any instrument, the course related to that
            instrument is absolutely <strong>FREE</strong>. Learn faster with
            the perfect instrument–course combo.
          </Typography>
        </Paper>
      </Container>

      <Container sx={{ py: { xs: 4, md: 6 } }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "flex-start", sm: "center" },
            mb: 3,
            gap: 2,
          }}
        >
          <Box>
            <Typography
              variant="h4"
              fontWeight={800}
              sx={{
                color: "#02025e",
                fontSize: { xs: "1.6rem", sm: "2rem" },
              }}
            >
              Featured Instruments
            </Typography>

            <Typography
              variant="body2"
              sx={{
                mt: 0.5,
                color: "text.secondary",
                maxWidth: 480,
              }}
            >
              Hand-picked instruments designed to inspire creativity and
              accelerate your musical journey.
            </Typography>
          </Box>

          <Button
            component={Link}
            to="/guest/guestinstruments"
            variant="contained"
            size="medium"
            sx={{
              px: 3,
              py: 1,
              borderRadius: "999px",
              fontWeight: 600,
              textTransform: "none",
              background: "linear-gradient(135deg, #02025e, #1e40af)",
              color: "#fff",
              boxShadow: "0 8px 20px rgba(2,2,94,0.25)",
              "&:hover": {
                background: "linear-gradient(135deg, #01013d, #1e3a8a)",
                boxShadow: "0 12px 28px rgba(2,2,94,0.35)",
              },
            }}
          >
            View All
          </Button>
        </Box>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, sm: 3 },
            mb: 4,
            borderRadius: 3,
            background: "rgba(2, 2, 94, 0.04)",
            borderLeft: "4px solid #02025e",
          }}
        >
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: "14px", sm: "16px", md: "18px" },
              lineHeight: 1.8,
              color: "#1b085c",
              maxWidth: 900,
            }}
          >
            Our featured instruments are carefully curated to offer the perfect
            balance of sound quality, comfort, and durability. Whether you're a
            beginner or an advanced learner, each instrument is chosen to help
            you learn faster and play with confidence.
          </Typography>
        </Paper>

        <Grid container spacing={3}>
          {instrumentList.map((it, idx) => (
            <Grid key={it._id} item xs={12} sm={6} md={4}>
              <GuestInstrumentCard
                image={it.instrument_images?.[0]?.url}
                price={it.instrument_price}
                title={it.instrument_title}
                description={it.instrurment_description}
                onViewDetails={() => handleViewDetails(it, "instrument")}
                onAddToCart={handleOpenLoginDialog}
              />
            </Grid>
          ))}
        </Grid>
      </Container>

      <Container sx={{ py: { xs: 4, md: 6 } }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "flex-start", sm: "center" },
            mb: { xs: 2.5, md: 3.5 },
            gap: 2,
          }}
        >
          <Box>
            <Typography
              variant="h4"
              fontWeight={800}
              sx={{
                fontSize: { xs: "1.4rem", sm: "1.7rem", md: "2rem" },
                color: "#02025e",
              }}
            >
              Popular Courses
            </Typography>

            <Typography
              variant="body2"
              sx={{
                mt: 0.6,
                color: "#6b7280",
                maxWidth: "520px",
                fontSize: { xs: "0.85rem", sm: "0.95rem" },
              }}
            >
              Learn from expertly crafted courses designed to help you grow
              musically.
            </Typography>
          </Box>

          <Button
            component={Link}
            to="/guest/guestcourses"
            size="medium"
            sx={{
              px: 3,
              py: 1,
              borderRadius: "999px",
              fontWeight: 600,
              textTransform: "none",
              background: "linear-gradient(135deg, #02025e, #1e40af)",
              color: "#fff",
              boxShadow: "0 8px 20px rgba(2,2,94,0.25)",
              "&:hover": {
                background: "linear-gradient(135deg, #01013d, #1e3a8a)",
                boxShadow: "0 12px 28px rgba(2,2,94,0.35)",
              },
            }}
          >
            View all
          </Button>
        </Box>

        <Box
          sx={{
            mb: { xs: 3, md: 4 },
            p: { xs: 2, sm: 2.5 },
            borderRadius: "14px",
            background:
              "linear-gradient(90deg, rgba(2,2,94,0.06), rgba(30,64,175,0.02))",
            borderLeft: "4px solid #02025e",
          }}
        >
          <Typography
            sx={{
              lineHeight: 1.9,
              color: "#374151",
              fontWeight: 400,
              fontSize: { xs: "0.95rem", sm: "1.05rem", md: "1.1rem" },
              letterSpacing: "0.2px",
            }}
          >
            Explore our most popular courses, crafted to help learners grow with{" "}
            <Box component="span" sx={{ fontWeight: 600, color: "#02025e" }}>
              clarity
            </Box>
            ,{" "}
            <Box component="span" sx={{ fontWeight: 600, color: "#02025e" }}>
              confidence
            </Box>
            , and{" "}
            <Box component="span" sx={{ fontWeight: 600, color: "#02025e" }}>
              creativity
            </Box>
            . Each course blends engaging lessons, practical guidance, and
            real-world application — ensuring a meaningful and enjoyable
            learning experience for every student.
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {courseList.map((course) => (
            <Grid key={course._id} item xs={12} sm={6} md={4}>
              <GuestCourseCard
                image={course.thumbnail_image?.[0]?.url}
                title={course.course_title}
                description={course.course_description}
                price={course.course_price}
                onViewDetails={() => handleViewDetails(course, "course")}
                onAddToCart={handleOpenLoginDialog}
              />
            </Grid>
          ))}
        </Grid>
      </Container>

      <Container sx={{ py: 6 }}>
        <Paper
          elevation={2}
          sx={{
            p: { xs: 2, md: 4 },
            display: "flex",
            gap: 3,
            alignItems: "center",
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          <Avatar
            src={guitarImg}
            alt="student"
            sx={{ width: 72, height: 72 }}
          />
          <Box>
            <Typography variant="h6" fontWeight={700}>
              What our students say
            </Typography>
            <Typography variant="body2" color="text.secondary">
              "Amazing lessons and friendly instructors — I went from zero to
              playing my first song in 6 weeks!"
            </Typography>
          </Box>
          <Box sx={{ ml: "auto", mt: { xs: 2, md: 0 } }}>
            {/* <Button onClick={handleOpenLoginDialog} variant="contained">
              Start Learning
            </Button> */}
            <Button
              component={Link}
              to="/guest/guestcourses"
              variant="contained"
            >
              Start Learning
            </Button>
          </Box>
        </Paper>
      </Container>

      <Container sx={{ py: { xs: 4, md: 6 } }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "flex-start", sm: "center" },
            mb: { xs: 2.5, md: 3.5 },
            gap: 2,
          }}
        >
          <Box>
            <Typography
              variant="h4"
              fontWeight={800}
              sx={{
                fontSize: { xs: "1.4rem", sm: "1.7rem", md: "2rem" },
                color: "#02025e",
              }}
            >
              Visit our Location
            </Typography>

            <Typography
              variant="body2"
              sx={{
                mt: 0.6,
                color: "#6b7280",
                maxWidth: "520px",
                fontSize: { xs: "0.85rem", sm: "0.95rem" },
              }}
            >
              Discover a welcoming space where music comes alive and learning
              feels inspiring.
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            mb: { xs: 3, md: 4 },
            p: { xs: 2, sm: 2.5 },
            borderRadius: "14px",
            background:
              "linear-gradient(90deg, rgba(2,2,94,0.06), rgba(30,64,175,0.02))",
            borderLeft: "4px solid #02025e",
          }}
        >
          <Typography
            sx={{
              lineHeight: 1.9,
              color: "#374151",
              fontWeight: 400,
              fontSize: { xs: "0.95rem", sm: "1.05rem", md: "1.1rem" },
              letterSpacing: "0.2px",
            }}
          >
            Visit our academy and experience music learning in a{" "}
            <Box component="span" sx={{ fontWeight: 600, color: "#02025e" }}>
              welcoming
            </Box>
            ,{" "}
            <Box component="span" sx={{ fontWeight: 600, color: "#02025e" }}>
              creative
            </Box>{" "}
            and{" "}
            <Box component="span" sx={{ fontWeight: 600, color: "#02025e" }}>
              inspiring
            </Box>{" "}
            environment. Our location is thoughtfully designed to provide
            students with a comfortable space where passion meets practice.
            <br />
            <br />
            Conveniently located in{" "}
            <Box component="span" sx={{ fontWeight: 600, color: "#02025e" }}>
              Indore
            </Box>
            , our academy is easily accessible and equipped with modern
            classrooms, professional instruments, and expert mentors to guide
            you at every step. Whether you're a beginner or an advanced learner,
            we invite you to visit us and begin your musical journey with
            confidence.
          </Typography>
        </Box>

        <LocationMap city="Maestro Music Classes - Flute, Guitar, Piano & Singing Academy, Indore" />
      </Container>
      <AppDialog />
    </>
  );
}
