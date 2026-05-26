import { useMemo } from "react";
import { useLocation, useParams } from "react-router-dom";
import {
  Calendar,
  ChevronRight,
  CreditCard,
  IndianRupee,
  Mail,
  Package,
  Receipt,
  ShoppingBag,
  User,
} from "lucide-react";
import { useGetAdminOrderByIdQuery } from "../../features/api/adminApi";
import { PageShell } from "../../components/ui/tw/PageShell";
import { BackButton } from "../../components/ui/tw/BackButton";
import { Badge } from "../../components/ui/tw/Badge";
import { Spinner } from "../../components/ui/tw/Spinner";
import { cn } from "../../lib/cn";

const LIST_PATH = "/admin/allorders";

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

function paymentBadgeColor(status) {
  const s = String(status || "").toLowerCase();
  if (s === "paid") return "success";
  if (s === "pending") return "warning";
  if (s === "failed" || s === "cancelled") return "danger";
  return "default";
}

function customerLabel(order) {
  const u = order?.userId;
  if (u && typeof u === "object") {
    const name = `${u.first_name || ""} ${u.last_name || ""}`.trim();
    if (name) return name;
    return u.em || "—";
  }
  return order?.userEmail || "—";
}

function SummaryTile({ icon: Icon, label, value, accent }) {
  return (
    <div
      className={cn(
        "rounded-2xl border px-4 py-3.5",
        accent
          ? "border-emerald-100 bg-gradient-to-br from-emerald-50/80 to-white"
          : "border-slate-100 bg-slate-50/50"
      )}
    >
      <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
        <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden />
        {label}
      </p>
      <p className="mt-1.5 line-clamp-2 text-sm font-bold text-navy">{value || "—"}</p>
    </div>
  );
}

export default function AdminOrderDetail() {
  const { id } = useParams();
  const location = useLocation();
  const seed = location.state?.row;

  const { data: fetched, isLoading, isError } = useGetAdminOrderByIdQuery(id, {
    skip: !id,
  });

  const order = useMemo(() => {
    if (fetched) return fetched;
    if (seed && String(seed._id) === String(id)) return seed;
    return null;
  }, [fetched, seed, id]);

  const shortId = order?._id ? String(order._id).slice(-8).toUpperCase() : "—";
  const amount = Number(order?.amount || 0).toLocaleString("en-IN");
  const items = order?.items ?? [];
  const showLoading = isLoading && !order;

  const hasPaymentRefs = Boolean(order?.razorpayOrderId || order?.razorpayPaymentId);

  if (showLoading) {
    return (
      <PageShell>
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
          <Spinner size="lg" />
          <p className="text-sm font-medium text-muted">Loading order…</p>
        </div>
      </PageShell>
    );
  }

  if (isError || !order) {
    return (
      <PageShell narrow>
        <div className="rounded-3xl border border-slate-200/80 bg-white p-10 text-center shadow-soft">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
            <Receipt className="h-8 w-8" />
          </div>
          <h1 className="text-xl font-extrabold text-navy">Order not found</h1>
          <p className="mt-2 text-sm text-muted">
            This order may have been removed or the link is incorrect.
          </p>
          <div className="mt-6 flex justify-center">
            <BackButton to={LIST_PATH} label="Back to orders list" />
          </div>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell wide className="pb-10">
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <BackButton to={LIST_PATH} label="Orders list" />
        <nav
          className="flex min-w-0 flex-1 items-center gap-1.5 text-sm text-muted"
          aria-label="Breadcrumb"
        >
          <span>Admin</span>
          <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden />
          <span className="line-clamp-1 font-semibold text-brand-800">
            Order #{shortId}
          </span>
        </nav>
      </div>

      <header className="relative mb-6 overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-[0_20px_50px_-28px_rgba(15,23,42,0.18)]">
        <div
          className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.06] via-transparent to-brand-500/[0.08]"
          aria-hidden
        />
        <div className="relative flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div className="flex items-start gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-100 to-brand-100 text-emerald-700 shadow-sm">
              <Receipt className="h-7 w-7" />
            </span>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                Order detail
              </p>
              <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-navy sm:text-3xl">
                Order #{shortId}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Badge color={paymentBadgeColor(order.paymentStatus)} className="normal-case">
                  {order.paymentStatus?.toUpperCase() || "—"}
                </Badge>
                <span className="text-sm text-slate-500">{formatDateTime(order.createdAt)}</span>
              </div>
            </div>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-white px-5 py-3 ring-1 ring-emerald-100/90 sm:text-right">
            <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
              Total paid
            </p>
            <p className="mt-0.5 flex items-center gap-0.5 text-2xl font-extrabold text-emerald-800 sm:justify-end">
              <IndianRupee className="h-6 w-6" aria-hidden />
              {amount}
            </p>
            <p className="text-xs font-medium text-slate-500">{order.currency || "INR"}</p>
          </div>
        </div>
      </header>

      <div className="overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-[0_20px_50px_-24px_rgba(15,23,42,0.18)]">
        <div className="border-b border-slate-100 bg-slate-50/40 p-5 sm:p-6">
          <h2 className="text-sm font-extrabold text-navy">Order overview</h2>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <SummaryTile icon={User} label="Customer" value={customerLabel(order)} accent />
            <SummaryTile icon={Mail} label="Email" value={order.userEmail} />
            <SummaryTile
              icon={CreditCard}
              label="Gateway"
              value={order.paymentGateway?.toUpperCase()}
            />
            <SummaryTile icon={Calendar} label="Placed on" value={formatDateTime(order.createdAt)} />
          </div>
        </div>

        <section className="p-5 sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 text-sm font-extrabold text-navy">
              <ShoppingBag className="h-4 w-4 text-emerald-600" aria-hidden />
              Line items
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-600">
                {items.length}
              </span>
            </h2>
          </div>

          {items.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 py-12 text-center">
              <Package className="mx-auto h-10 w-10 text-slate-300" aria-hidden />
              <p className="mt-3 text-sm font-medium text-slate-500">No items in this order.</p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-slate-100 ring-1 ring-slate-100/60">
              <div className="hidden grid-cols-[minmax(0,1fr)_100px_80px_100px] gap-4 border-b border-slate-100 bg-slate-50/80 px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 sm:grid">
                <span>Product</span>
                <span className="text-center">Unit price</span>
                <span className="text-center">Qty</span>
                <span className="text-right">Subtotal</span>
              </div>
              <ul className="divide-y divide-slate-100">
                {items.map((item, index) => {
                  const lineTotal = (item.price || 0) * (item.qty || 1);
                  return (
                    <li
                      key={item._id || `${item.title}-${index}`}
                      className="grid grid-cols-1 gap-3 p-4 transition hover:bg-slate-50/50 sm:grid-cols-[minmax(0,1fr)_100px_80px_100px] sm:items-center sm:gap-4"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white ring-1 ring-slate-100">
                          {item.thumbnail?.[0]?.url ? (
                            <img
                              src={item.thumbnail[0].url}
                              alt=""
                              className="detail-thumb-img h-full w-full object-contain p-1"
                            />
                          ) : (
                            <Package className="h-6 w-6 text-slate-300" aria-hidden />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-bold text-navy">{item.title || "—"}</p>
                          <p className="mt-0.5 text-xs font-medium uppercase tracking-wide text-slate-500">
                            {item.productType?.replace(/_/g, " ") || "—"}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm font-semibold text-navy sm:text-center">
                        {item.price === 0 ? (
                          <Badge color="success">FREE</Badge>
                        ) : (
                          `₹${Number(item.price).toLocaleString("en-IN")}`
                        )}
                      </p>
                      <p className="text-sm font-semibold text-slate-600 sm:text-center">
                        ×{item.qty ?? 1}
                      </p>
                      <p className="text-sm font-extrabold text-emerald-800 sm:text-right">
                        ₹{lineTotal.toLocaleString("en-IN")}
                      </p>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </section>

        <footer className="flex flex-col gap-4 border-t border-slate-100 bg-gradient-to-r from-emerald-50/40 via-white to-brand-50/30 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <p className="text-sm font-bold text-navy">Order total</p>
            <p className="text-xs text-slate-500">
              {items.length} product{items.length === 1 ? "" : "s"}
            </p>
          </div>
          <p className="text-2xl font-extrabold text-emerald-800">₹{amount}</p>
        </footer>

        {hasPaymentRefs ? (
          <div className="border-t border-slate-100 bg-slate-50/30 px-5 py-4 sm:px-6">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Payment references
            </p>
            <div className="flex flex-col gap-2 text-xs sm:flex-row sm:flex-wrap sm:gap-6">
              {order.razorpayOrderId ? (
                <p className="font-mono text-slate-600">
                  <span className="font-bold text-slate-500">Order ID:</span>{" "}
                  {order.razorpayOrderId}
                </p>
              ) : null}
              {order.razorpayPaymentId ? (
                <p className="font-mono text-slate-600">
                  <span className="font-bold text-slate-500">Payment ID:</span>{" "}
                  {order.razorpayPaymentId}
                </p>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </PageShell>
  );
}
