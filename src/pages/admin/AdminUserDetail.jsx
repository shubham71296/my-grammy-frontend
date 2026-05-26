import { useMemo } from "react";
import { useLocation, useParams } from "react-router-dom";
import {
  Calendar,
  ChevronRight,
  Clock,
  Hash,
  Mail,
  MapPin,
  Phone,
  Shield,
  User,
  Users,
} from "lucide-react";
import { useGetAdminUserByIdQuery } from "../../features/api/adminApi";
import { PageShell } from "../../components/ui/tw/PageShell";
import { BackButton } from "../../components/ui/tw/BackButton";
import { Badge } from "../../components/ui/tw/Badge";
import { Spinner } from "../../components/ui/tw/Spinner";
import { cn } from "../../lib/cn";

const LIST_PATH = "/admin/allusers";

function formatDateTime(value) {
  if (!value) return "—";
  return new Date(value).toLocaleString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function DetailRow({ icon: Icon, label, value, multiline }) {
  return (
    <div className="flex gap-3 border-b border-slate-100/90 py-4 last:border-0 last:pb-0">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-700 ring-1 ring-sky-100/80">
        <Icon className="h-4 w-4" aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          {label}
        </dt>
        <dd
          className={cn(
            "mt-1 font-semibold text-navy",
            multiline ? "whitespace-pre-wrap text-sm leading-relaxed" : "text-sm"
          )}
        >
          {value || "—"}
        </dd>
      </div>
    </div>
  );
}

export default function AdminUserDetail() {
  const { id } = useParams();
  const location = useLocation();
  const seed = location.state?.row;

  const { data: fetched, isLoading, isError } = useGetAdminUserByIdQuery(id, {
    skip: !id,
  });

  const user = useMemo(() => {
    if (fetched) return fetched;
    if (seed && String(seed._id) === String(id)) return seed;
    return null;
  }, [fetched, seed, id]);

  const fullName = `${user?.first_name || ""} ${user?.last_name || ""}`.trim();
  const initial = fullName?.charAt(0)?.toUpperCase() || "U";
  const shortId = user?._id ? String(user._id).slice(-8).toUpperCase() : "—";
  const showLoading = isLoading && !user;

  if (showLoading) {
    return (
      <PageShell>
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
          <Spinner size="lg" />
          <p className="text-sm font-medium text-muted">Loading user…</p>
        </div>
      </PageShell>
    );
  }

  if (isError || !user) {
    return (
      <PageShell narrow>
        <div className="rounded-3xl border border-slate-200/80 bg-white p-10 text-center shadow-soft">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-50 text-brand-700">
            <User className="h-8 w-8" />
          </div>
          <h1 className="text-xl font-extrabold text-navy">User not found</h1>
          <p className="mt-2 text-sm text-muted">
            This account may have been removed or the link is incorrect.
          </p>
          <div className="mt-6 flex justify-center">
            <BackButton to={LIST_PATH} label="Back to users list" />
          </div>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell wide className="pb-10">
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <BackButton to={LIST_PATH} label="Users list" />
        <nav
          className="flex min-w-0 flex-1 items-center gap-1.5 text-sm text-muted"
          aria-label="Breadcrumb"
        >
          <span>Admin</span>
          <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden />
          <span className="line-clamp-1 font-semibold text-brand-800">
            {fullName || "User"}
          </span>
        </nav>
      </div>

      <header className="relative mb-6 overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-[0_20px_50px_-28px_rgba(15,23,42,0.18)]">
        <div
          className="absolute inset-0 bg-gradient-to-br from-sky-500/[0.06] via-transparent to-brand-500/[0.08]"
          aria-hidden
        />
        <div className="relative flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div className="flex items-start gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-100 to-brand-100 text-brand-700 shadow-sm">
              <Users className="h-7 w-7" />
            </span>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-sky-700">
                User profile
              </p>
              <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-navy sm:text-3xl">
                {fullName || "—"}
              </h1>
              <p className="mt-1 text-sm text-slate-500">ID …{shortId}</p>
            </div>
          </div>
          <Badge color="primary" className="w-fit normal-case sm:self-start">
            {user.role?.toUpperCase() || "USER"}
          </Badge>
        </div>
      </header>

      <div className="overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-[0_20px_50px_-24px_rgba(15,23,42,0.18)]">
        <div className="grid items-start lg:grid-cols-[minmax(0,280px)_minmax(0,1fr)] lg:divide-x lg:divide-slate-100">
          <aside className="bg-gradient-to-b from-sky-50/50 via-white to-brand-50/20 p-6 sm:p-8">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-brand-500 to-indigo-600 text-4xl font-extrabold text-white shadow-lg shadow-brand-500/25">
                {initial}
              </div>
              <h2 className="mt-4 text-xl font-extrabold text-navy">{fullName || "—"}</h2>
              <Badge color="primary" className="mt-2 normal-case">
                {user.role?.toUpperCase() || "USER"}
              </Badge>
            </div>

            <div className="mt-6 space-y-3">
              <div className="rounded-2xl bg-white/80 px-4 py-3 ring-1 ring-sky-100/80">
                <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-sky-700">
                  <Calendar className="h-3 w-3" />
                  Member since
                </p>
                <p className="mt-1 text-sm font-bold text-navy">
                  {formatDateTime(user.createdAt)}
                </p>
              </div>
              <div className="rounded-2xl bg-white/60 px-4 py-3 ring-1 ring-slate-100/80">
                <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  <Hash className="h-3 w-3" />
                  Account ID
                </p>
                <p className="mt-1 break-all font-mono text-xs font-semibold text-slate-600">
                  {user._id}
                </p>
              </div>
            </div>
          </aside>

          <section className="p-6 sm:p-8">
            <h3 className="mb-1 text-sm font-extrabold text-navy">Contact & account</h3>
            <p className="mb-5 text-sm text-slate-500">
              Registered customer information from your users directory.
            </p>
            <dl>
              <DetailRow icon={Mail} label="Email address" value={user.em} />
              <DetailRow icon={Phone} label="Phone number" value={user.phone_number} />
              <DetailRow icon={MapPin} label="Address" value={user.address} multiline />
              <DetailRow icon={Shield} label="Role" value={user.role} />
              <DetailRow icon={Clock} label="Last updated" value={formatDateTime(user.updatedAt)} />
            </dl>
          </section>
        </div>
      </div>
    </PageShell>
  );
}
