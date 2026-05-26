import { LogIn, UserPlus } from "lucide-react";
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
import { Link, useNavigate } from "react-router-dom";
import AuthShell from "../../components/auth/AuthShell";
import { Button } from "../../components/ui/tw/Button";
import { Spinner } from "../../components/ui/tw/Spinner";
import { cn } from "../../lib/cn";

export default function Signup() {
  const [inputs, setInputs] = useState(userSignupInputs);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e, _p1, i1) => {
    const temp = [...inputs];
    temp[i1]._value = e.target.value;
    temp[i1]._errorMsg = "";
    setInputs(temp);
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
      const response = await dispatch(signUp(body)).unwrap();
      toast.success(response.msg);
      setInputs(resetInputs(inputs));
      navigate("/login");
    } catch (err) {
      toast.error(err || "Signup failed!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setInputs(resetInputs(inputs));
  }, []);

  return (
    <AuthShell
      eyebrow="Create account"
      title="Register"
      subtitle="Create your Grammy account to save orders, access courses, and manage your profile."
      maxWidth="max-w-2xl"
      contentMaxWidth="max-w-2xl"
    >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <div className="grid grid-cols-1 gap-x-4 lg:grid-cols-2">
            {inputs.map((p1, i1) => {
              if (!["text", "number", "password"].includes(p1._type)) return null;
              return (
                <div key={p1._key} className={cn(p1._key === "address" && "lg:col-span-2")}>
                  <InputText {...p1} onChange={(e) => handleChange(e, p1, i1)} />
                </div>
              );
            })}
          </div>

          <Button
            type="submit"
            variant="primary"
            fullWidth
            disabled={loading}
            className="mt-4 py-3"
          >
            {loading ? (
              <>
                <Spinner size="sm" className="border-white/30 border-t-white" />
                Signing up…
              </>
            ) : (
              <>
                <UserPlus className="h-5 w-5" />
                Sign Up
              </>
            )}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-muted">
          Already have an account?{" "}
          <Link to="/login" className="inline-flex items-center gap-1 font-semibold text-brand-600 hover:underline">
            <LogIn className="h-3.5 w-3.5" />
            Login
          </Link>
        </p>
    </AuthShell>
  );
}
