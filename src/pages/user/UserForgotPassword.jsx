import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  InputAdornment,
  Grid,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Email, Lock, LoginOutlined } from "@mui/icons-material";
import userForgotPwdInputs from "../../utils/user-forgot-pwd-inputs";
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
import api from "../../api/axios";

export default function UserForgotPassword() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [email, setEmail] = useState("");
  const [inputs, setInputs] = useState(userForgotPwdInputs);
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const steps = ["Email", "OTP Verification", "Reset Password"];
  const stepFields = [["em"], ["reset_pwd_otp"], ["pwd", "cpwd"]];
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const currentInputs = inputs.filter((inp) =>
    stepFields[activeStep].includes(inp._key)
  );

  const handleChange = async (e, p1, i1) => {
    let tempInputs = [...inputs];
    tempInputs[i1]._value = e.target.value;
    tempInputs[i1]._errorMsg = "";
    setInputs(tempInputs);
  };

  const handleNext = async () => {
    const stepInputs = inputs.filter((inp) =>
      stepFields[activeStep].includes(inp._key)
    );
    let obj1 = validateInputs(stepInputs);

    if (obj1.hasError) {
      setInputs((prev) =>
        prev.map((inp) => {
          const found = obj1.inputs.find((x) => x._key === inp._key);
          return found ? found : inp;
        })
      );
      return;
    }
    if (activeStep === 2) {
      const pwd = stepInputs.find((inp) => inp._key === "pwd")?._value;
      const cpwd = stepInputs.find((inp) => inp._key === "cpwd")?._value;

      if (pwd !== cpwd) {
        setInputs((prev) =>
          prev.map((inp) =>
            inp._key === "cpwd"
              ? { ...inp, _errorMsg: "Confirm password does not match" }
              : inp
          )
        );
        return;
      }
    }
    let body = extractJsonObject(stepInputs);
    if (activeStep === 1 || activeStep === 2) {
      body = { ...body, em: email };
    }

    try {
      setLoading(true);
      if (activeStep === 0) {
        setLoading(true);
        const res = await api.post("/user/sendotpemail", body);
        if (res.data.success) {
          toast.success(res.data.msg);
          setActiveStep(1);
          setEmail(res.data.data.em);
        }
      } else if (activeStep === 1) {
        setLoading(true);
        const res = await api.post("/user/verifyotp", body);
        if (res.data.success) {
          toast.success(res.data.msg);
          setActiveStep(2);
        }
      } else if (activeStep === 2) {
        setLoading(true);
        const res = await api.post("/user/changepassword", body);
        if (res.data.success) {
          toast.success(res.data.msg);
          navigate("/login");
        }
      }
    } catch (error) {
      console.error("error", error);
      const errorMsg = error?.response?.data?.msg || "Something went wrong!";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const getButtonLabel = () => {
    if (loading) {
      if (activeStep === 0) return "Sending...";
      if (activeStep === 1) return "Verifying...";
      if (activeStep === 2) return "Changing...";
    } else {
      if (activeStep === 0) return "Send Email";
      if (activeStep === 1) return "Verify OTP";
      if (activeStep === 2) return "Change Password";
    }
    return "Next";
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
          p: { xs: 1.5, sm: 2 },
        }}
      >
        <Paper
          elevation={4}
          sx={{
            p: { xs: 2, sm: 3 },
            borderRadius: 2,
            width: "100%",
            maxWidth: { xs: "100%", sm: 420 },
          }}
        >
          <Typography
            variant="h5"
            fontWeight={700}
            sx={{
              color: "#1976d2",
              textAlign: "center",
              mb: 1,
              fontSize: { xs: "1.3rem", sm: "1.6rem" },
            }}
            gutterBottom
          >
            Welcome to Grammy
          </Typography>

          <Typography
            variant="body2"
            sx={{
              textAlign: "center",
              fontSize: { xs: "0.8rem", sm: "0.9rem" },
              mb: { xs: 2, sm: 3 },
            }}
          >
            Please follow steps to change password
          </Typography>

          <>
            <Stepper
              activeStep={activeStep}
              alternativeLabel={!isMobile}
              orientation={isMobile ? "vertical" : "horizontal"}
              sx={{
                mb: { xs: 2, sm: 3 },
                "& .MuiStepLabel-label": {
                  fontSize: { xs: "0.75rem", sm: "0.85rem" },
                  whiteSpace: "nowrap",
                },

                "& .MuiStepIcon-root": {
                  width: { xs: 20, sm: 28 },
                  height: { xs: 20, sm: 28 },
                },

                "& .MuiStepConnector-line": {
                  borderWidth: { xs: 1, sm: 2 },
                },

                "& .MuiStep-root": {
                  padding: { xs: "6px 0", sm: "0 8px" },
                },
              }}
            >
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            {currentInputs.map((p1) => {
              const originalIndex = inputs.findIndex(
                (inp) => inp._key === p1._key
              );
              if (["text", "number", "password"].includes(p1._type)) {
                return (
                  <InputText
                    {...p1}
                    onChange={(event) => handleChange(event, p1, originalIndex)}
                  />
                );
              }

              return null;
            })}

            <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
              <Button
                variant="contained"
                size="large"
                fullWidth
                disabled={loading}
                startIcon={
                  loading ? (
                    <CircularProgress size={isMobile ? 16 : 20} />
                  ) : (
                    <LoginOutlined />
                  )
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
                onClick={handleNext}
              >
                {getButtonLabel()}
              </Button>
            </Box>
            <Typography
              mt={1}
              variant="body2"
              color="text.secondary"
              align="center"
              sx={{
                fontSize: { xs: "0.8rem", sm: "0.9rem" },
              }}
            >
              RememberAccount?{" "}
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
          </>
        </Paper>
      </Box>
    </>
  );
}
