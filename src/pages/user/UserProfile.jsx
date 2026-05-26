import { User } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { formatDateLong } from "../../utils/formatDate";
import { PageShell, PagePanel } from "../../components/ui/tw/PageShell";
import { BackButton } from "../../components/ui/tw/BackButton";
import { cn } from "../../lib/cn";

const UserProfile = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const fullName = `${user?.first_name || ""} ${user?.last_name || ""}`.trim();

  const fields = [
    { label: "Full name", value: fullName || "—" },
    { label: "Email", value: user?.em || "—" },
    { label: "Phone", value: user?.phone_number || "—" },
    { label: "Role", value: user?.role || "—" },
    { label: "Address", value: user?.address || "—", fullWidth: true },
  ];

  return (
    <PageShell narrow>
      <h1 className="mb-6 flex items-center gap-2 text-xl font-extrabold tracking-tight text-brand-900 sm:text-2xl">
        My Profile
      </h1>

      <div
        className={cn(
          "glass-panel mb-6 flex flex-col items-center gap-4 rounded-2xl p-6 sm:flex-row sm:items-center sm:p-8",
          "bg-gradient-to-br from-white/90 to-slate-50"
        )}
      >
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-400 text-white shadow-lg sm:h-24 sm:w-24">
          <User className="h-10 w-10 sm:h-12 sm:w-12" strokeWidth={1.5} />
        </div>

        <div className="text-center sm:text-left">
          <h2 className="text-xl font-extrabold tracking-tight text-navy sm:text-2xl">
            {fullName || "Guest"}
          </h2>
          <p className="mt-1 text-sm text-muted">{user?.em}</p>
          <p className="mt-2 text-sm text-muted">
            Member since {formatDateLong(user?.createdAt)}
          </p>
        </div>
      </div>

      <PagePanel>
        <h2 className="text-lg font-bold text-navy">Account details</h2>
        <div className="my-4 h-0.5 rounded-full bg-brand-500/30" />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
          {fields.map(({ label, value, fullWidth }) => (
            <div key={label} className={cn(fullWidth && "sm:col-span-2")}>
              <p className="mb-1 text-xs font-medium text-muted sm:text-sm">{label}</p>
              <p className="text-sm font-semibold text-navy sm:text-base">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <BackButton to="/user" label="Back to home" />
        </div>
      </PagePanel>
    </PageShell>
  );
};

export default UserProfile;
