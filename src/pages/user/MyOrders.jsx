import { useMemo } from "react";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock3,
  IndianRupee,
  Package,
  Receipt,
  ShoppingBag,
  Sparkles,
  XCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { formatDateTime } from "../../utils/common-util";
import { useOrderListQuery } from "../../hooks/useOrderListQuery";
import { PageShell } from "../../components/ui/tw/PageShell";
import { PageBannerWithSearch, PageContentCard, EmptyState } from "../../components/ui/tw/PageHeader";
import { Badge } from "../../components/ui/tw/Badge";
import { Spinner } from "../../components/ui/tw/Spinner";
import { BackButton } from "../../components/ui/tw/BackButton";
import { cn } from "../../lib/cn";
import { IMAGE_PLACEHOLDER } from "../../utils/image-constants";

const statusColor = (status) => {
  switch (status) {
    case "paid":
      return "success";
    case "pending":
      return "warning";
    case "failed":
      return "error";
    default:
      return "default";
  }
};

const statusBorder = (status) => {
  switch (status) {
    case "paid":
      return "border-emerald-200 bg-emerald-50/60";
    case "pending":
      return "border-amber-200 bg-amber-50/60";
    case "failed":
    case "cancelled":
      return "border-red-200 bg-red-50/60";
    default:
      return "border-slate-200 bg-slate-50/70";
  }
};

const statusMeta = {
  paid: {
    icon: CheckCircle2,
    label: "Paid",
    text: "text-emerald-700",
    bg: "bg-emerald-500",
    soft: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  },
  pending: {
    icon: Clock3,
    label: "Pending",
    text: "text-amber-700",
    bg: "bg-amber-500",
    soft: "bg-amber-50 text-amber-700 ring-amber-200",
  },
  failed: {
    icon: XCircle,
    label: "Failed",
    text: "text-red-700",
    bg: "bg-red-500",
    soft: "bg-red-50 text-red-700 ring-red-200",
  },
  cancelled: {
    icon: XCircle,
    label: "Cancelled",
    text: "text-red-700",
    bg: "bg-red-500",
    soft: "bg-red-50 text-red-700 ring-red-200",
  },
  default: {
    icon: AlertCircle,
    label: "Order",
    text: "text-slate-700",
    bg: "bg-slate-500",
    soft: "bg-slate-50 text-slate-700 ring-slate-200",
  },
};

const formatCurrency = (value, currency = "INR") =>
  `₹${Number(value || 0).toLocaleString("en-IN")} ${currency || ""}`.trim();

const getShortId = (id = "") => (id ? `#${String(id).slice(-8).toUpperCase()}` : "#ORDER");

const MyOrders = () => {
  const {
    search,
    setSearch,
    data: orderList,
    isLoading: loading,
    isError,
  } = useOrderListQuery();

  const orderStats = useMemo(() => {
    const safeOrders = Array.isArray(orderList) ? orderList : [];
    const paidOrders = safeOrders.filter((order) => order.paymentStatus === "paid");
    const pendingOrders = safeOrders.filter((order) => order.paymentStatus === "pending");

    return {
      total: safeOrders.length,
      paid: paidOrders.length,
      pending: pendingOrders.length,
      spent: paidOrders.reduce((sum, order) => sum + Number(order.amount || 0), 0),
    };
  }, [orderList]);

  return (
    <PageShell>
      <PageBannerWithSearch
        icon={ShoppingBag}
        title="My Orders"
        subtitle="Track purchases, payment status, and your full order history."
        variant="orders"
        searchLabel="Search orders"
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Order ID or product name…"
        itemCount={orderList.length}
        loading={loading}
        error={isError}
        showCount={!loading && !isError}
      />

      <div className="mt-5 space-y-5">
        {!loading && !isError && (
          <div className="grid gap-3 min-[520px]:grid-cols-2 lg:grid-cols-4">
            {[
              {
                label: "Total orders",
                value: orderStats.total,
                icon: Receipt,
                tone: "bg-slate-900 text-white",
              },
              {
                label: "Paid orders",
                value: orderStats.paid,
                icon: CheckCircle2,
                tone: "bg-emerald-600 text-white",
              },
              {
                label: "Pending",
                value: orderStats.pending,
                icon: Clock3,
                tone: "bg-amber-500 text-white",
              },
              {
                label: "Total spent",
                value: formatCurrency(orderStats.spent, "INR"),
                icon: IndianRupee,
                tone: "bg-brand-600 text-white",
              },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/80 bg-white/90 p-3.5 shadow-sm ring-1 ring-slate-200/70 backdrop-blur transition hover:-translate-y-0.5 hover:shadow-md sm:p-4"
                >
                  <div className="flex items-center gap-3">
                    <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl shadow-sm", stat.tone)}>
                      <Icon className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
                        {stat.label}
                      </p>
                      <p className="mt-0.5 truncate text-lg font-extrabold text-slate-950 sm:text-xl">
                        {stat.value}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <PageContentCard className="overflow-hidden p-0">
          <div className="border-b border-slate-100 bg-gradient-to-r from-white via-amber-50/60 to-white px-4 py-4 sm:px-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-sm shadow-amber-500/20">
                  <Package className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <h2 className="text-base font-extrabold text-slate-900 sm:text-lg">
                    Order history
                  </h2>
                  <p className="text-xs leading-relaxed text-muted">
                    Most recent purchases appear first with items, amount, and payment status.
                  </p>
                </div>
              </div>
              <Link
                to="/user/instruments"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-amber-200 bg-white px-3.5 py-2 text-xs font-extrabold text-amber-700 shadow-sm transition hover:-translate-y-0.5 hover:border-amber-300 hover:bg-amber-50"
              >
                <ShoppingBag className="h-4 w-4" />
                Shop more
              </Link>
            </div>
          </div>

          {isError ? (
            <div className="p-4 sm:p-5">
              <p className="rounded-2xl border border-red-100 bg-red-50/80 px-4 py-10 text-center text-sm font-semibold text-danger">
                Could not load orders. Please try again later.
              </p>
            </div>
          ) : loading ? (
            <div className="flex justify-center py-16">
              <Spinner size="lg" />
            </div>
          ) : orderList.length === 0 ? (
            <EmptyState
              icon={ShoppingBag}
              title="No orders yet"
              description={
                search
                  ? "No orders match your search. Try another keyword."
                  : "When you purchase instruments or courses, they will show up here."
              }
              action={
                <Link to="/user/instruments" className="btn-primary inline-flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4" />
                  Start shopping
                </Link>
              }
            />
          ) : (
            <div className="space-y-4 p-3 sm:p-5">
              {orderList.map((order) => (
                <OrderCard key={order._id} order={order} />
              ))}
            </div>
          )}
        </PageContentCard>

        <BackButton to="/user" label="Back to home" />
      </div>
    </PageShell>
  );
};

function OrderCard({ order }) {
  const items = Array.isArray(order.items) ? order.items : [];
  const visibleItems = items.slice(0, 3);
  const hiddenItems = Math.max(items.length - visibleItems.length, 0);
  const meta = statusMeta[order.paymentStatus] || statusMeta.default;
  const StatusIcon = meta.icon;

  return (
    <article className="group overflow-hidden rounded-[1.35rem] border border-slate-200/90 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-amber-200 hover:shadow-lg hover:shadow-slate-200/80">
      <div className={cn("h-1.5 w-full", meta.bg)} />

      <div className="grid gap-4 p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_15rem] lg:items-start">
        <div className="min-w-0 space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex min-w-0 gap-3">
              <span className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ring-1", meta.soft)}>
                <StatusIcon className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-base font-extrabold text-slate-950 sm:text-lg">
                    {getShortId(order._id)}
                  </p>
                  <Badge color={statusColor(order.paymentStatus)}>
                    {meta.label}
                  </Badge>
                </div>
                <p className="mt-1 break-all text-[11px] font-semibold text-slate-500 sm:text-xs">
                  {order._id}
                </p>
              </div>
            </div>

            <div className="inline-flex w-fit items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1.5 text-[11px] font-bold text-slate-600 ring-1 ring-slate-200 sm:text-xs">
              <Calendar className="h-3.5 w-3.5" />
              {formatDateTime(order.createdAt)}
            </div>
          </div>

          <div className="grid gap-2">
            {visibleItems.map((item, idx) => (
              <OrderItem key={`${item.productId || item.title}-${idx}`} item={item} />
            ))}
            {hiddenItems > 0 && (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-3 py-2 text-center text-xs font-bold text-slate-500">
                +{hiddenItems} more {hiddenItems === 1 ? "item" : "items"} in this order
              </div>
            )}
          </div>
        </div>

        <aside className={cn("rounded-2xl border p-4", statusBorder(order.paymentStatus))}>
          <div className="flex items-start justify-between gap-3 lg:block">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
                Order total
              </p>
              <p className="mt-1 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl lg:text-2xl">
                {formatCurrency(order.amount, order.currency)}
              </p>
            </div>
            <Sparkles className={cn("h-5 w-5 shrink-0", meta.text)} />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 text-xs lg:grid-cols-1">
            <div className="rounded-xl bg-white/80 px-3 py-2 ring-1 ring-white">
              <p className="font-bold text-slate-500">Items</p>
              <p className="mt-0.5 font-extrabold text-slate-900">{items.length}</p>
            </div>
            <div className="rounded-xl bg-white/80 px-3 py-2 ring-1 ring-white">
              <p className="font-bold text-slate-500">Status</p>
              <p className={cn("mt-0.5 font-extrabold capitalize", meta.text)}>
                {order.paymentStatus || "order"}
              </p>
            </div>
          </div>
        </aside>
      </div>
    </article>
  );
}

function OrderItem({ item }) {
  const isFreeCourse = Number(item.price || 0) === 0;
  const thumbnail = item.thumbnail?.[0]?.url || IMAGE_PLACEHOLDER;

  return (
    <div className="flex gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-2.5 transition group-hover:bg-white sm:p-3">
      <img
        src={thumbnail}
        alt={item.title || "Order item"}
        className="h-14 w-14 shrink-0 rounded-xl bg-white object-cover ring-1 ring-slate-200 sm:h-16 sm:w-16"
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = IMAGE_PLACEHOLDER;
        }}
      />
      <div className="min-w-0 flex-1">
        <div className="flex flex-col gap-1 min-[430px]:flex-row min-[430px]:items-start min-[430px]:justify-between">
          <div className="min-w-0">
            <p className="line-clamp-2 text-sm font-extrabold leading-snug text-slate-900">
              {item.title}
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px] font-bold text-slate-500">
              {item.productType && (
                <span className="rounded-full bg-white px-2 py-0.5 capitalize ring-1 ring-slate-200">
                  {item.productType}
                </span>
              )}
              {!isFreeCourse && (
                <span className="rounded-full bg-white px-2 py-0.5 ring-1 ring-slate-200">
                  Qty {item.qty || 1}
                </span>
              )}
            </div>
          </div>
          <p className="shrink-0 text-sm font-black text-brand-600">
            {isFreeCourse ? "Free" : formatCurrency(item.price, "")}
          </p>
        </div>
        {isFreeCourse && (
          <p className="mt-1.5 text-[11px] font-semibold text-emerald-700">
            Included free with your instrument purchase
          </p>
        )}
      </div>
    </div>
  );
}

export default MyOrders;
