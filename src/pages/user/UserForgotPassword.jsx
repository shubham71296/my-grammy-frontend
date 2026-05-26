import { KeyRound, LogIn, MailCheck, ShieldCheck } from "lucide-react";
import userForgotPwdInputs from "../../utils/user-forgot-pwd-inputs";
import {
  extractJsonObject,
  resetInputs,
  validateInputs,
} from "../../utils/common-util";
import toast from "react-hot-toast";
import InputText from "../../components/ui/inputs/InputText";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import AuthShell from "../../components/auth/AuthShell";
import { Button } from "../../components/ui/tw/Button";
import { Spinner } from "../../components/ui/tw/Spinner";

export default function UserForgotPassword() {
  const [email, setEmail] = useState("");
  const [inputs, setInputs] = useState(userForgotPwdInputs);
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const stepFields = [["em"], ["reset_pwd_otp"], ["pwd", "cpwd"]];
  const navigate = useNavigate();

  const currentInputs = inputs.filter((inp) =>
    stepFields[activeStep].includes(inp._key)
  );

  const handleChange = (e, _p1, i1) => {
    const tempInputs = [...inputs];
    tempInputs[i1]._value = e.target.value;
    tempInputs[i1]._errorMsg = "";
    setInputs(tempInputs);
  };

  const handleNext = async () => {
    const stepInputs = inputs.filter((inp) =>
      stepFields[activeStep].includes(inp._key)
    );
    const obj1 = validateInputs(stepInputs);

    if (obj1.hasError) {
      setInputs((prev) =>
        prev.map((inp) => {
          const found = obj1.inputs.find((x) => x._key === inp._key);
          return found || inp;
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
        const res = await api.post("/user/sendotpemail", body);
        if (res.data.success) {
          toast.success(res.data.msg);
          setActiveStep(1);
          setEmail(res.data.data.em);
        }
      } else if (activeStep === 1) {
        const res = await api.post("/user/verifyotp", body);
        if (res.data.success) {
          toast.success(res.data.msg);
          setActiveStep(2);
        }
      } else if (activeStep === 2) {
        const res = await api.post("/user/changepassword", body);
        if (res.data.success) {
          toast.success(res.data.msg);
          navigate("/login");
        }
      }
    } catch (error) {
      const errorMsg = error?.response?.data?.msg || "Something went wrong!";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const getButtonLabel = () => {
    if (loading) {
      if (activeStep === 0) return "Sending…";
      if (activeStep === 1) return "Verifying…";
      if (activeStep === 2) return "Changing…";
    }
    if (activeStep === 0) return "Send OTP";
    if (activeStep === 1) return "Verify OTP";
    if (activeStep === 2) return "Change Password";
    return "Next";
  };

  useEffect(() => {
    setInputs(resetInputs(inputs));
  }, []);

  const StepIcon = activeStep === 0 ? MailCheck : activeStep === 1 ? ShieldCheck : KeyRound;

  return (
    <AuthShell
      eyebrow="Account recovery"
      title="Reset password"
      subtitle="Verify your email, confirm the OTP, and choose a new secure password."
    >
        <div className="space-y-0">
          {currentInputs.map((p1) => {
            const originalIndex = inputs.findIndex((inp) => inp._key === p1._key);
            if (!["text", "number", "password"].includes(p1._type)) return null;
            return (
              <InputText
                key={p1._key}
                {...p1}
                onChange={(event) => handleChange(event, p1, originalIndex)}
              />
            );
          })}
        </div>

        <Button
          variant="primary"
          fullWidth
          disabled={loading}
          className="mt-6 py-3"
          onClick={handleNext}
        >
          {loading ? (
            <>
              <Spinner size="sm" className="border-white/30 border-t-white" />
              {getButtonLabel()}
            </>
          ) : (
            <>
              <StepIcon className="h-5 w-5" />
              {getButtonLabel()}
            </>
          )}
        </Button>

        <p className="mt-4 text-center text-sm text-muted">
          Remember your account?{" "}
          <Link to="/login" className="inline-flex items-center gap-1 font-semibold text-brand-600 hover:underline">
            <LogIn className="h-3.5 w-3.5" />
            Login
          </Link>
        </p>
    </AuthShell>
  );
}
