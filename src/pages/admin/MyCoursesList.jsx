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
import { openDialogAction, renderTableAction } from "../../features/ui/uiSlice";
import CourseAccordion from "../../components/ui/accordion/CourseAccordion";
import CourseCard from "../../components/ui/card/CourseCard";
import { useDispatch, useSelector } from "react-redux";
import AppDialog from "../../components/ui/dialog/AppDialog";
import api from "../../api/axios";

const MyCoursesList = () => {
  const { renderTable } = useSelector((state) => state.ui);
  const { token } = useSelector((state) => state.auth);
  const [limit] = useState(0);
  const [offset] = useState(0);
  const [query] = useState({});
  const [allCourses, setAllCourses] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    getAllCoursesData(limit, offset, {});
  }, []);

  const groupByInstrument = (courses) => {
    return courses.reduce((acc, course) => {
      const key = course.instrument?.instrument_title || "Others";
      if (!acc[key]) acc[key] = [];
      acc[key].push(course);
      return acc;
    }, {});
  };

  const groupedCourses = groupByInstrument(allCourses);

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

      const response = await api.post("/admin/allcourses", body);
      setAllCourses(response.data.data || []);
    } catch (error) {
      console.error("Error fetching instruments:", error);
    }
  };

  useEffect(() => {
    if (renderTable) {
      getAllCoursesData(limit, offset, {});

      dispatch(renderTableAction({ renderTable: false }));
    }
  }, [renderTable]);

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
              fontSize: {
                xs: "1rem",
                sm: "1.2rem",
                md: "1.5rem",
              },
              fontWeight: 600,
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
            My Courses
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
        {allCourses.length > 0 ? (
          <>
            {Object.keys(groupedCourses).map((instrumentTitle, idx) => (
              <CourseAccordion
                key={instrumentTitle + idx}
                title={instrumentTitle}
              >
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    flexWrap: "wrap",
                  }}
                >
                  {groupedCourses[instrumentTitle].map((course, courseIdx) => (
                    <Box
                      key={course._id}
                      sx={{
                        width: {
                          xs: "100%",
                          sm: "48%",
                          md: "31%",
                        },
                      }}
                    >
                      <CourseCard
                        key={course._id}
                        idx={courseIdx}
                        type="admin"
                        course={course}
                        onEdit={handleEditLecture}
                        onDelete={handleDeleteLecture}
                      />
                    </Box>
                  ))}
                </Box>
              </CourseAccordion>
            ))}
          </>
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
          </Box>
        )}
      </Paper>
      <AppDialog />
    </>
  );
};

export default MyCoursesList;
