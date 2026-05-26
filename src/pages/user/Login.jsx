import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Compass, Eye, EyeOff, LogIn } from "lucide-react";
import toast from "react-hot-toast";
import userLoginInputs from "../../utils/user-login-inputs";
import {
  extractJsonObject,
  resetInputs,
  validateInputs,
} from "../../utils/common-util";
import { getUserProfile, signIn } from "../../features/auth/authSlice";
import AuthShell from "../../components/auth/AuthShell";
import { Button } from "../../components/ui/tw/Button";
import { Spinner } from "../../components/ui/tw/Spinner";
import { TextInput } from "../../components/ui/tw/Field";
import { cn } from "../../lib/cn";

export default function Login() {
  const [inputs, setInputs] = useState(userLoginInputs);
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (key, value) => {
    setInputs((prev) =>
      prev.map((inp) =>
        inp._key === key ? { ...inp, _value: value, _errorMsg: "" } : inp
      )
    );
  };

  const handleSubmit = async () => {
    if (loading) return;
    const obj1 = validateInputs(inputs);
    if (obj1.hasError) {
      setInputs(obj1.inputs);
      return;
    }
    const body = extractJsonObject(inputs);
    try {
      setLoading(true);
      const response = await dispatch(signIn(body)).unwrap();
      toast.success(response.msg);
      await dispatch(getUserProfile(response.data));
      setInputs(resetInputs(inputs));
      navigate("/");
    } catch (err) {
      toast.error(err || "Login failed!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setInputs(resetInputs(inputs));
  }, []);

  const emailField = inputs.find((i) => i._key === "em");
  const pwdField = inputs.find((i) => i._key === "pwd");

  return (
    <AuthShell
      eyebrow="Secure access"
      title="Sign in"
      subtitle="Use your email and password to continue shopping, learning, and managing your orders."
      footer={
        <Link
          to="/guest"
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-brand-800 shadow-sm transition hover:-translate-y-0.5 hover:bg-brand-50"
        >
          <Compass className="h-4 w-4" />
          Browse as guest
        </Link>
      }
    >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <TextInput
            label={emailField?._name}
            required={emailField?._mandatory}
            type="email"
            placeholder={emailField?._placeholder}
            value={emailField?._value ?? ""}
            error={emailField?._errorMsg}
            hint={!emailField?._errorMsg ? emailField?._helperText : undefined}
            onChange={(e) => handleChange("em", e.target.value)}
          />

          <div className="mb-4">
            <label className="mb-1.5 block text-xs font-semibold text-slate-600 sm:text-sm">
              {pwdField?._name}
              {pwdField?._mandatory && <span className="text-danger"> *</span>}
            </label>
            <div className="relative">
              <input
                type={showPwd ? "text" : "password"}
                className={cn(
                  "input-field pr-20",
                  pwdField?._errorMsg && "border-danger"
                )}
                placeholder={pwdField?._placeholder}
                value={pwdField?._value ?? ""}
                onChange={(e) => handleChange("pwd", e.target.value)}
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 inline-flex -translate-y-1/2 items-center gap-1 rounded-lg p-1.5 text-muted hover:bg-slate-100"
                onClick={() => setShowPwd((s) => !s)}
                aria-label={showPwd ? "Hide password" : "Show password"}
              >
                {showPwd ? (
                  <>
                    <EyeOff className="h-3.5 w-3.5" />
                    Hide
                  </>
                ) : (
                  <>
                    <Eye className="h-3.5 w-3.5" />
                    Show
                  </>
                )}
              </button>
            </div>
            {(pwdField?._errorMsg || pwdField?._helperText) && (
              <p
                className={cn(
                  "mt-1 text-xs",
                  pwdField?._errorMsg ? "text-danger" : "text-muted"
                )}
              >
                {pwdField?._errorMsg || pwdField?._helperText}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={loading}
            fullWidth
            className="mt-2 py-3"
          >
            {loading ? <Spinner size="sm" className="border-white/30 border-t-white" /> : <LogIn size={18} />}
            {loading ? "Signing in…" : "Login"}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-muted">
          <Link
            to="/forgotpassword"
            className="font-semibold text-brand-600 hover:underline"
          >
            Forgot password?
          </Link>
        </p>

        <p className="mt-3 text-center text-sm text-muted">
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="font-semibold text-brand-600 hover:underline">
            Sign up
          </Link>
        </p>
    </AuthShell>
  );
}
