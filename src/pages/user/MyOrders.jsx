import { Receipt, ShoppingBag, Package, Calendar } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { formatDateTime } from "../../utils/common-util";
import { useOrderListQuery } from "../../hooks/useOrderListQuery";
import { PageShell } from "../../components/ui/tw/PageShell";
import { PageBannerWithSearch, PageContentCard, EmptyState } from "../../components/ui/tw/PageHeader";
import { Button } from "../../components/ui/tw/Button";
import { Badge } from "../../components/ui/tw/Badge";
import { Spinner } from "../../components/ui/tw/Spinner";
import { BackButton } from "../../components/ui/tw/BackButton";
import { cn } from "../../lib/cn";

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
      return "border-l-emerald-500";
    case "pending":
      return "border-l-amber-500";
    case "failed":
      return "border-l-red-500";
    default:
      return "border-l-slate-300";
  }
};

const MyOrders = () => {
  const navigate = useNavigate();
  const {
    search,
    setSearch,
    data: orderList,
    isLoading: loading,
    isError,
  } = useOrderListQuery();

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
        <PageContentCard>
          <div className="mb-5 flex items-center gap-2 border-b border-slate-100 pb-4">
            <Package className="h-5 w-5 text-slate-600" />
            <div>
              <h2 className="text-base font-extrabold text-slate-900 sm:text-lg">
                Order history
              </h2>
              <p className="text-xs text-muted">Most recent orders appear first</p>
            </div>
          </div>

          {isError ? (
            <p className="rounded-xl border border-red-100 bg-red-50/80 py-10 text-center text-sm font-semibold text-danger">
              Could not load orders. Please try again later.
            </p>
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
                <Link to="/user/instruments" className="btn-primary">
                  Start shopping
                </Link>
              }
            />
          ) : (
            <div className="space-y-4">
              {orderList.map((order) => (
                <article
                  key={order._id}
                  className={cn(
                    "overflow-hidden rounded-xl border border-slate-200/90 bg-white transition hover:shadow-md",
                    "border-l-4",
                    statusBorder(order.paymentStatus)
                  )}
                >
                  <div className="flex flex-col gap-3 border-b border-slate-100 bg-slate-50/50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                    <div className="flex min-w-0 items-start gap-2">
                      <Receipt className="mt-0.5 h-5 w-5 shrink-0 text-slate-600" />
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-wide text-muted">
                          Order ID
                        </p>
                        <p className="break-all text-sm font-bold text-navy">{order._id}</p>
                      </div>
                    </div>
                    <Badge color={statusColor(order.paymentStatus)}>
                      {order.paymentStatus}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-5">
                    <div>
                      <p className="text-xs text-muted">Order total</p>
                      <p className="text-xl font-extrabold text-brand-600">
                        ₹{Number(order.amount).toLocaleString("en-IN")}{" "}
                        <span className="text-sm font-semibold text-muted">
                          {order.currency}
                        </span>
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDateTime(order.createdAt)}
                    </div>
                  </div>

                  <ul className="space-y-2 border-t border-slate-100 px-4 py-3 sm:px-5">
                    {order.items?.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3"
                      >
                        <img
                          src={item.thumbnail?.[0]?.url}
                          alt={item.title}
                          className="product-card__img h-14 w-14 shrink-0 rounded-lg bg-white object-cover ring-1 ring-slate-200"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                        <div className="min-w-0 flex-1">
                          <p className="line-clamp-1 text-sm font-bold text-navy">
                            {item.title}
                          </p>
                          {item.price !== 0 && (
                            <p className="text-xs text-muted">Qty: {item.qty}</p>
                          )}
                          <p className="text-sm font-semibold text-brand-600">
                            {item.price === 0
                              ? "Free course with instrument"
                              : `₹${Number(item.price).toLocaleString("en-IN")}`}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          )}
        </PageContentCard>

        <BackButton to="/user" label="Back to home" />
      </div>
    </PageShell>
  );
};

export default MyOrders;
