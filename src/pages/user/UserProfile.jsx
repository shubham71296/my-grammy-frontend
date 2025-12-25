// src/pages/Profile.jsx
import React from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Paper,
  Avatar,
  Divider,
  Button,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { ArrowBack } from "@mui/icons-material";

const UserProfile = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const fullName = `${user?.first_name || ""} ${user?.last_name || ""}`.trim();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f4f7fb",
        py: 4,
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={4}
          sx={{
            p: { xs: 3, md: 4 },
            mb: 4,
            borderRadius: 3,
            display: "flex",
            alignItems: "center",
            gap: 3,
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <Avatar
            sx={{
              width: { xs: 70, sm: 90 },
              height: { xs: 70, sm: 90 },
              bgcolor: "#1976d2",
              fontSize: { xs: 28, sm: 36 },
            }}
          >
            <PersonIcon fontSize="large" />
          </Avatar>

          <Box textAlign={{ xs: "center", sm: "left" }}>
            <Typography
              variant="h5"
              fontWeight={700}
              sx={{ fontSize: { xs: "1.2rem", sm: "1.4rem" } }}
            >
              {fullName || "No Name"}
            </Typography>
            <Typography
              sx={{ fontSize: { xs: "0.85rem", sm: "0.95rem" } }}
              color="text.secondary"
            >
              {user?.em || "No Email"}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: { xs: "0.75rem", sm: "0.85rem" } }}
            >
              Joined on{" "}
              {user?.createdAt
                ? moment(user?.createdAt).format("DD MMM, YYYY")
                : "-"}
            </Typography>
          </Box>
        </Paper>

        <Paper
          elevation={3}
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 3,
          }}
        >
          <Typography
            variant="h6"
            fontWeight={700}
            mb={2}
            sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
          >
            Profile Information
          </Typography>

          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: "0.85rem" }}
              >
                Full Name
              </Typography>
              <Typography sx={{ fontSize: "0.85rem" }} fontWeight={600}>
                {fullName || "-"}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: { xs: "0.6rem", sm: "0.85rem" } }}
              >
                Email Address
              </Typography>
              <Typography sx={{ fontSize: "0.85rem" }} fontWeight={600}>
                {user?.em || "-"}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: "0.85rem" }}
              >
                Phone Number
              </Typography>
              <Typography sx={{ fontSize: "0.85rem" }} fontWeight={600}>
                {user?.phone_number || "-"}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: "0.85rem" }}
              >
                Role
              </Typography>
              <Typography sx={{ fontSize: "0.85rem" }} fontWeight={600}>
                {user?.role || "-"}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: "0.85rem" }}
              >
                Address
              </Typography>
              <Typography sx={{ fontSize: "0.85rem" }} fontWeight={600}>
                {user?.address || "-"}
              </Typography>
            </Grid>
          </Grid>
          <Box display="flex" mt={5}>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<ArrowBack />}
              onClick={() => navigate(-1)}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                //px: { xs: 2, sm: 3 },
                //py: { xs: 0.8, sm: 1 },
                borderRadius: 2,
                fontSize: {
                  xs: "0.75rem",
                  sm: "0.9rem",
                  md: "1rem",
                },
                "& .MuiButton-startIcon": {
                  "& svg": {
                    fontSize: { xs: "1rem", sm: "1.2rem" },
                  },
                },
              }}
            >
              Back
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default UserProfile;
