// // import {
// //   Button,
// //   Typography,
// //   Box
// // } from '@mui/material';
// // import { AddCircleOutlineOutlined } from '@mui/icons-material';
// // import { useNavigate } from 'react-router-dom';

// // export default function DataNotFoundDynamicTable({ textLabel, buttonRoute, countTotalData }) {
// //   const navigate = useNavigate();
// //   const isGlobalEmpty = countTotalData === 0;
// //   return (
// //     <Box
// //       display="flex"
// //       justifyContent="center"
// //       alignItems="center"
// //       textAlign="center"
// //       //px={2}
// //       width="100%"
// //     >
// //       <Box
// //         sx={{
// //           p: 4,
// //           borderRadius: 3,
// //           boxShadow: 3,
// //           bgcolor: "background.paper",
// //           width: "100%",
// //         }}
// //       >
// //         <Typography
// //           variant="h4"
// //           sx={{
// //             //color: "text.secondary",
// //             fontWeight: 600,
// //             mb: 1,
// //           }}
// //         >
// //          {isGlobalEmpty ? `No ${textLabel} Found` : "No data found for this filter"}
// //         </Typography>
// //         <Typography
// //           variant="body1"
// //           sx={{
// //             color: "primary.main",
// //             mb: 3,
// //           }}
// //         >
// //           {isGlobalEmpty
// //             ? `Please create a new ${textLabel} to get started`
// //             : "Try adjusting your filter to see more results"}
// //         </Typography>
// //        {isGlobalEmpty && (
// //         <Button
// //           variant="outlined"
// //           color="primary"
// //           onClick={() => navigate(`${buttonRoute}`)}
// //           startIcon={<AddCircleOutlineOutlined />}
// //           sx={{
// //             borderRadius: 3,
// //             px: { xs: 2, sm: 3 },
// //             py: 1.2,
// //             textTransform: "none",
// //             fontSize: { xs: "0.9rem", sm: "1rem" },
// //             transition: "all 0.3s ease",
// //             boxShadow: 2,
// //             "&:hover": {
// //               transform: "scale(1.05)",
// //               boxShadow: 4,
// //             },
// //           }}
// //         >
// //           {`Add ${textLabel}`}
// //         </Button>
// //        )}
// //       </Box>
// //     </Box>
// //   );
// // }

// import { Button, Typography, Box } from "@mui/material";
// import { AddCircleOutlineOutlined, Inbox } from "@mui/icons-material";
// import { useNavigate } from "react-router-dom";

// export default function DataNotFoundDynamicTable({
//   textLabel,
//   buttonRoute,
//   countTotalData,
//   showSimple = false,
// }) {
//   const navigate = useNavigate();
//   const isGlobalEmpty = countTotalData === 0;
//   return (
//     <Box
//       sx={{
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         justifyContent: "center",
//         py: 6,
//         borderRadius: 3,
//         backgroundColor: "#f7f7fb",
//         boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
//         textAlign: "center",
//         transition: "0.3s",
//         "&:hover": {
//           boxShadow: "0 6px 20px rgba(0,0,0,0.12)",
//           backgroundColor: "#f0efff",
//         },
//       }}
//     >
//       <Inbox />
//       <Typography
//         variant="h6"
//         sx={{ color: "#4a4a4a", fontWeight: 600, mb: 0.5 }}
//       >
//         {isGlobalEmpty
//           ? `No ${textLabel} Found`
//           : "No data found for this filter"}
//       </Typography>
//       <Typography
//         variant="body1"
//         sx={{
//           color: "primary.main",
//           mb: 3,
//         }}
//       >
//         {isGlobalEmpty
//           ? `Please add a new ${textLabel} to get started`
//           : "Try adjusting your filter to see more results"}
//       </Typography>
//       {isGlobalEmpty && (
//         <Button
//           variant="contained"
//           size="small"
//           onClick={() => navigate(`${buttonRoute}`)}
//           startIcon={<AddCircleOutlineOutlined />}
//           sx={{
//             px: 2.5,
//             py: 1,
//             fontSize: "0.8rem",
//             borderRadius: "8px",
//             transition: "0.3s",
//             backgroundColor: "#1976d2",
//             "&:hover": {
//               backgroundColor: "#125aa0",
//               transform: "scale(1.05)",
//               boxShadow: "0px 4px 12px rgba(0,0,0,0.2)",
//               cursor: "pointer",
//             },
//           }}
//         >
//           {`Add ${textLabel}`}
//         </Button>
//       )}
//     </Box>
//   );
// }


import { Button, Typography, Box } from "@mui/material";
import { AddCircleOutlineOutlined, Inbox } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export default function DataNotFoundDynamicTable({
  textLabel,
  buttonRoute,
  countTotalData,
  showSimple = false, // 👈 default false
}) {
  const navigate = useNavigate();
  const isGlobalEmpty = countTotalData === 0;

  return (
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
      }}
    >
      <Inbox sx={{ fontSize: 40, mb: 1 }} />

      {/* ✅ Always visible */}
      <Typography
        variant="h6"
        sx={{ color: "#4a4a4a", fontWeight: 600, mb: 0.5 }}
      >
        {isGlobalEmpty
          ? `No ${textLabel} Found`
          : "No data found"}
      </Typography>

      {/* ❌ Hide extra UI when showSimple = true */}
      {!showSimple && (
        <>
          <Typography
            variant="body1"
            sx={{ color: "primary.main", mb: 3 }}
          >
            {isGlobalEmpty
              ? `Please add a new ${textLabel} to get started`
              : "Try adjusting your filter to see more results"}
          </Typography>

          {isGlobalEmpty && (
            <Button
              variant="contained"
              size="small"
              onClick={() => navigate(buttonRoute)}
              startIcon={<AddCircleOutlineOutlined />}
              sx={{
                px: 2.5,
                py: 1,
                fontSize: "0.8rem",
                borderRadius: "8px",
              }}
            >
              {`Add ${textLabel}`}
            </Button>
          )}
        </>
      )}
    </Box>
  );
}

