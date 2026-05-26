import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  ShoppingCart,
  GraduationCap,
  IndianRupee,
  List,
  Library,
  Users,
  TrendingUp,
  Sparkles,
  ArrowUpRight,
  BookOpen,
  Plus,
} from "lucide-react";
import { useGetDashboardSummaryQuery } from "../../features/api/adminApi";
import { PageShell } from "../../components/ui/tw/PageShell";
import { Spinner } from "../../components/ui/tw/Spinner";
import { formatCurrency } from "../../utils/format";
import { cn } from "../../lib/cn";

const QUICK_ACTIONS = [
  {
    title: "Add instrument",
    description: "List new gear in the store",
    icon: Plus,
    route: "/admin/addinstruments",
    accent: "from-amber-500/15 to-orange-50 border-amber-200/80 text-amber-900",
    iconBg: "bg-amber-100 text-amber-700",
  },
  {
    title: "Create course",
    description: "Publish lessons & thumbnails",
    icon: BookOpen,
    route: "/admin/createcourse",
    accent: "from-white to-violet-50/70 border-slate-200/80 text-slate-800",
    iconBg: "bg-brand-100 text-brand-700",
  },
  {
    title: "View orders",
    description: "Track payments & fulfillment",
    icon: ShoppingCart,
    route: "/admin/allorders",
    accent: "from-emerald-500/10 to-emerald-50 border-emerald-200/80 text-emerald-900",
    iconBg: "bg-emerald-100 text-emerald-700",
  },
  {
    title: "Manage users",
    description: "Accounts & access",
    icon: Users,
    route: "/admin/allusers",
    accent: "from-sky-500/10 to-sky-50 border-sky-200/80 text-sky-900",
    iconBg: "bg-sky-100 text-sky-700",
  },
];

function MetricCard({
  icon: Icon,
  label,
  value,
  hint,
  className,
  iconClassName,
  large,
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_2px_12px_rgba(15,23,42,0.05)] transition duration-300",
        "hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_16px_36px_-16px_rgba(15,23,42,0.12)]",
        large && "sm:p-6",
        className
      )}
    >
      <div
        className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-brand-500/5"
        aria-hidden
      />
      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">
            {label}
          </p>
          <p
            className={cn(
              "mt-2 font-extrabold tracking-tight text-navy",
              large ? "text-3xl sm:text-4xl" : "text-2xl"
            )}
      >
        {value}
          </p>
          {hint && <p className="mt-1.5 text-xs text-muted">{hint}</p>}
        </div>
        <span
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl shadow-sm",
            iconClassName
          )}
        >
          <Icon className="h-5 w-5" strokeWidth={2.25} />
        </span>
      </div>
    </div>
  );
}

const Dashboard = () => {
  const { data: summary, isLoading, isError } = useGetDashboardSummaryQuery();
  const { user } = useSelector((state) => state.auth);
  const displayName =
    user?.firstname || user?.first_name || user?.em?.split("@")[0] || "Admin";

  const todayLabel = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  if (isLoading) {
    return (
      <PageShell>
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
          <Spinner size="lg" />
          <p className="text-sm font-medium text-muted">Loading dashboard…</p>
        </div>
      </PageShell>
    );
  }

  if (isError || !summary) {
    return (
      <PageShell narrow>
        <div className="rounded-3xl border border-red-100 bg-white p-10 text-center shadow-soft">
          <p className="text-lg font-bold text-navy">Could not load dashboard</p>
          <p className="mt-2 text-sm text-muted">Please refresh or try again later.</p>
        </div>
      </PageShell>
    );
  }

  const paidRate =
    summary.orders > 0
      ? Math.round((summary.paidOrders / summary.orders) * 100)
      : 0;

  return (
    <PageShell className="pb-10">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-[0_20px_50px_-28px_rgba(15,23,42,0.18)]">
        <div
          className="absolute inset-0 bg-gradient-to-br from-brand-900/[0.03] via-transparent to-sky-500/[0.06]"
          aria-hidden
        />
        <div className="relative grid gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-brand-700">
              <Sparkles className="h-3.5 w-3.5" />
              Admin dashboard
            </span>
            <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-navy sm:text-3xl lg:text-[2rem]">
              Welcome back, {displayName}
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
              Monitor store performance, revenue, and catalog health at a glance.
            </p>
            <p className="mt-3 text-xs font-medium text-muted">{todayLabel}</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[280px] lg:grid-cols-1">
            <div className="rounded-2xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50 to-white p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">
                Today&apos;s revenue
              </p>
              <p className="mt-1 text-2xl font-extrabold text-emerald-700">
                {formatCurrency(summary.todaysRevenue ?? 0)}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                Paid conversion
              </p>
              <p className="mt-1 flex items-center gap-2 text-2xl font-extrabold text-navy">
                {paidRate}%
                <TrendingUp className="h-5 w-5 text-brand-600" />
              </p>
              <p className="mt-0.5 text-xs text-muted">
                {summary.paidOrders} of {summary.orders} orders
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics */}
      <section className="mt-8">
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-extrabold text-navy">Overview</h2>
            <p className="text-sm text-muted">Live counts from your Grammy store</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-2">
            <MetricCard
              large
              icon={IndianRupee}
              label="Total revenue"
              value={formatCurrency(summary.revenue ?? 0)}
              hint="All successful Razorpay payments"
              className="h-full border-slate-200/80 bg-gradient-to-br from-white via-brand-50/20 to-white ring-1 ring-brand-50"
              iconClassName="bg-brand-600 text-white shadow-md shadow-brand-600/25"
            />
          </div>
          <MetricCard
            icon={ShoppingCart}
            label="Paid orders"
            value={summary.paidOrders?.toLocaleString("en-IN") ?? "0"}
            hint="Completed checkouts"
            iconClassName="bg-emerald-100 text-emerald-700"
          />
          <MetricCard
            icon={List}
            label="Total orders"
            value={summary.orders?.toLocaleString("en-IN") ?? "0"}
            hint="All order records"
            iconClassName="bg-sky-100 text-sky-700"
          />
          <MetricCard
            icon={Library}
            label="Instruments"
            value={summary.instruments?.toLocaleString("en-IN") ?? "0"}
            hint="Active listings"
            iconClassName="bg-amber-100 text-amber-700"
          />
          <MetricCard
            icon={GraduationCap}
            label="Courses"
            value={summary.courses?.toLocaleString("en-IN") ?? "0"}
            hint="Published curricula"
            iconClassName="bg-violet-100 text-violet-700"
          />
          <MetricCard
            icon={Users}
            label="Registered users"
            value={summary.users?.toLocaleString("en-IN") ?? "0"}
            hint="Customer accounts"
            iconClassName="bg-slate-100 text-slate-700"
          />
          <MetricCard
            icon={TrendingUp}
            label="Collected via Razorpay"
            value={formatCurrency(summary.razorpayCollected ?? summary.revenue ?? 0)}
            hint="Payment gateway total"
            iconClassName="bg-brand-100 text-brand-700"
          />
        </div>
      </section>

      {/* Quick actions */}
      <section className="mt-8">
        <h2 className="text-lg font-extrabold text-navy">Quick actions</h2>
        <p className="mt-1 text-sm text-muted">Jump to common admin tasks</p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {QUICK_ACTIONS.map(
            ({ title, description, icon: Icon, route, accent, iconBg }) => (
              <Link
                key={route}
                to={route}
                className={cn(
                  "group flex flex-col rounded-2xl border bg-gradient-to-br p-4 transition duration-200",
                  "hover:-translate-y-0.5 hover:shadow-md",
                  accent
                )}
              >
                <span
                  className={cn(
                    "mb-3 flex h-10 w-10 items-center justify-center rounded-xl",
                    iconBg
                  )}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <span className="font-bold text-navy group-hover:text-brand-800">
                  {title}
                </span>
                <span className="mt-1 text-xs leading-snug opacity-80">
                  {description}
                </span>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-brand-700">
                  Open
                  <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </Link>
            )
          )}
        </div>
      </section>

      {/* Catalog shortcuts */}
      <section className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link
          to="/admin/myinstrumentslist"
          className="group flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:border-brand-200 hover:shadow-md"
        >
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
              <Library className="h-6 w-6" />
            </span>
            <div>
              <p className="font-bold text-navy">Instruments list</p>
              <p className="text-xs text-muted">Edit, preview, or remove gear</p>
            </div>
          </div>
          <ArrowUpRight className="h-5 w-5 text-slate-400 transition group-hover:text-brand-600" />
        </Link>
        <Link
          to="/admin/mycourseslist"
          className="group flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:border-brand-200 hover:shadow-md"
        >
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
              <GraduationCap className="h-6 w-6" />
            </span>
            <div>
              <p className="font-bold text-navy">Courses list</p>
              <p className="text-xs text-muted">Manage lectures & pricing</p>
            </div>
          </div>
          <ArrowUpRight className="h-5 w-5 text-slate-400 transition group-hover:text-brand-600" />
        </Link>
      </section>
    </PageShell>
  );
};

export default Dashboard;
