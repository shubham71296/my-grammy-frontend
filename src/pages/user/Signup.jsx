import {
  Box,
  Button,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { LoginOutlined, PersonAdd } from "@mui/icons-material";
import userSignupInputs from "../../utils/user-signup-inputs";
import InputText from "../../components/ui/inputs/InputText";
import { useEffect, useState } from "react";
import {
  extractJsonObject,
  resetInputs,
  validateInputs,
} from "../../utils/common-util";
import { useDispatch } from "react-redux";
import { signUp } from "../../features/auth/authSlice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [inputs, setInputs] = useState(userSignupInputs);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e, p1, i1) => {
    let temp = [...inputs];
    temp[i1]._value = e.target.value;
    temp[i1]._errorMsg = "";
    setInputs(temp);
  };

  const handleSubmit = async () => {
    if (loading) return;
    let obj1 = validateInputs(inputs);
    if (obj1.hasError) {
      setInputs(obj1.inputs);
    } else {
      let body = extractJsonObject(inputs);
      try {
        setLoading(true);
        const response = await dispatch(signUp(body)).unwrap();
        toast.success(response.msg);
        setInputs(resetInputs(inputs));
        navigate("/login");
        return response;
      } catch (err) {
        console.log("error", err);
        toast.error(err || "Signup failed!");
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    setInputs(resetInputs(inputs));
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#8f9afaff",
        p: { xs: 1, sm: 2 },
      }}
    >
      <Paper
        elevation={5}
        sx={{
          p: { xs: 2, sm: 3 },
          borderRadius: 2,
          width: "100%",
          maxWidth: { xs: "100%", sm: 650 },
        }}
      >
        <Typography
          variant="h5"
          fontWeight={700}
          sx={{ color: "#1976d2", textAlign: "center", mb: 1, fontSize: { xs: "1.3rem", sm: "1.6rem" } }}
        >
          Welcome to Grammy
        </Typography>

        <Typography
          variant="body2"
          sx={{ textAlign: "center", mb: { xs: 2, sm: 3 }, color: "text.secondary", fontSize: { xs: "0.8rem", sm: "0.9rem" } }}
        >
          Please signup to continue
        </Typography>

        <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          {inputs.map((p1, i1) => {
            if (["text", "number", "password"].includes(p1._type)) {
              return (
                <Grid size={{ xs: 12, md: 12, lg: 6 }}>
                  <InputText
                    {...p1}
                    onChange={(e) => handleChange(e, p1, i1)}
                  />
                </Grid>
              );
            }
            return null;
          })}
        </Grid>

        <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid size={{ xs: 12, md: 12 }}>
            <Box sx={{ mt: 2 }}>
              <Button
                variant="contained"
                fullWidth
                disabled={loading}
                size="large"
                startIcon={
                  loading ? <CircularProgress size={isMobile ? 16 : 20} /> : <PersonAdd />
                }
                sx={{
                  fontSize: { xs: "0.85rem", sm: "0.95rem", md: "1rem" },
                  "& .MuiButton-startIcon > *": {
                    fontSize: { xs: 18, sm: 20, md: 22 }, 
                  },
                  transition: "0.3s",
                  backgroundColor: "#1976d2",
                  "&:hover": {
                    backgroundColor: "#125aa0",
                    transform: loading ? "none" : "scale(1.03)",
                    boxShadow: loading
                      ? "none"
                      : "0px 4px 12px rgba(0,0,0,0.2)",
                    opacity: loading ? 0.8 : 1,
                    cursor: loading ? "not-allowed" : "pointer",
                  },
                }}
                onClick={handleSubmit}
              >
                {loading ? "Signing up..." : "Sign Up"}
              </Button>
              <Typography
                mt={2}
                variant="body2"
                color="text.secondary"
                align="center"
                sx={{
                  fontSize: { xs: "0.8rem", sm: "0.9rem" },
                }}
              >
                Already have an account?{" "}
                <Typography
                  component="span"
                  sx={{
                    fontSize: { xs: "0.8rem", sm: "0.9rem" },
                    color: "#1976d2",
                    fontWeight: 600,
                    cursor: "pointer",
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                  onClick={() => navigate("/login")}
                >
                  Login
                </Typography>
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}
