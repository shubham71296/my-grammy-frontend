import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  InputAdornment,
  Grid,
  CircularProgress,
} from "@mui/material";
import { Email, Lock, LoginOutlined } from "@mui/icons-material";
import userLoginInputs from "../../utils/user-login-inputs";
import {
  extractJsonObject,
  resetInputs,
  validateInputs,
} from "../../utils/common-util";
import toast from "react-hot-toast";
import InputText from "../../components/ui/inputs/InputText";
import { useEffect, useState } from "react";
import { getUserProfile, signIn } from "../../features/auth/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [inputs, setInputs] = useState(userLoginInputs);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = async (e, p1, i1) => {
    let tempInputs = [...inputs];
    tempInputs[i1]._value = e.target.value;
    tempInputs[i1]._errorMsg = "";
    setInputs(tempInputs);
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
        const response = await dispatch(signIn(body)).unwrap();
        toast.success(response.msg);

        const token = response.data;
        await dispatch(getUserProfile(token));

        setInputs(resetInputs(inputs));
        navigate("/");
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
    <>
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#8f9afaff",
          p: 1,
        }}
      >
        <Paper
          elevation={4}
          sx={{
            p: 3,
            borderRadius: 2,
            width: "100%",
            maxWidth: 420,
          }}
        >
          <Typography
            variant="h5"
            fontWeight={700}
            gutterBottom
            sx={{ color: "#1976d2", textAlign: "center" }}
          >
            Welcome to Grammy
          </Typography>

          <Typography variant="body2" mb={3} color="text.secondary">
            Please login to continue
          </Typography>

          <>
            {inputs.map((p1, i1) => {
              if (["text", "number", "password"].includes(p1._type)) {
                return (
                  <InputText
                    {...p1}
                    onChange={(event) => handleChange(event, p1, i1)}
                  />
                );
              }

              return null;
            })}

            {/* Submit */}

            <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
              <Button
                variant="contained"
                size="large"
                fullWidth
                //startIcon={<AddCircleRounded />}
                disabled={loading}
                startIcon={
                  loading ? <CircularProgress size={20} /> : <LoginOutlined />
                }
                sx={{
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
                {loading ? "logging..." : "Login"}
              </Button>
            </Box>
          </>

          <Typography mt={3} variant="body2" color="text.secondary">
            Forgot password?
          </Typography>

          <Typography
            mt={1}
            variant="body2"
            color="text.secondary"
            align="center"
          >
            Don’t have an account?{" "}
            <Typography
              component="span"
              sx={{
                color: "#1976d2",
                fontWeight: 600,
                cursor: "pointer",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
              onClick={() => navigate("/signup")}
            >
              Sign up
            </Typography>
          </Typography>
        </Paper>
      </Box>
    </>
  );
}
