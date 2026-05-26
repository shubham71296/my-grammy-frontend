import {
  IndianRupee,
  Mail,
  ShoppingBag,
  CircleDot,
  Sparkles,
} from "lucide-react";
import CommonTable from "../../components/ui/table/CommonTable";
import { headCells, menuOptions } from "../../utils/all-orders-columns";
import { PageShell } from "../../components/ui/tw/PageShell";
import {
  AdminFilterField,
  AdminFiltersPanel,
} from "../../components/ui/tw/AdminFiltersPanel";
import { useAdminTableData } from "../../hooks/useAdminTableData";
import { useDebouncedAdminFilter } from "../../hooks/useDebouncedAdminFilter";
import {
  buildOrdersAdminFilterQuery,
  filterTextMinLen,
} from "../../utils/api-query";

const ORDER_FILTER_INITIAL = { email: "", status: "", amount: "" };

const STATUS_OPTIONS = [
  { value: "", label: "All statuses" },
  { value: "pending", label: "Pending" },
  { value: "paid", label: "Paid" },
  { value: "cancelled", label: "Cancelled" },
  { value: "failed", label: "Failed" },
];

function AllOrders() {
  const { tableConfig, applyQuery, totalDataCount } = useAdminTableData({
    table: "orders",
    headCells,
    menuOptions,
    textLabel: "Order",
  });

  const { values, setField, reset, hasInput, hasAppliedFilter } =
    useDebouncedAdminFilter({
      applyQuery,
      enabled: true,
      buildQuery: buildOrdersAdminFilterQuery,
      initialValues: ORDER_FILTER_INITIAL,
    });

  const showFilterPanel =
    totalDataCount > 0 || hasInput || hasAppliedFilter;

  const emailTrim = String(values.email).trim();
  const emailPending = emailTrim.length > 0 && emailTrim.length < filterTextMinLen;

  return (
    <PageShell className="pb-10">
      <header className="relative mb-6 overflow-hidden rounded-[1.75rem] border border-emerald-100/80 bg-gradient-to-br from-white via-emerald-50/40 to-brand-50/50 shadow-[0_18px_45px_-30px_rgba(5,150,105,0.35)]">
        <div
          className="absolute -right-10 -top-12 h-36 w-36 rounded-full bg-emerald-500/10 blur-3xl"
          aria-hidden
        />
        <div
          className="absolute -bottom-14 left-6 h-32 w-32 rounded-full bg-brand-500/10 blur-3xl"
          aria-hidden
        />
        <div className="relative p-4 sm:p-6 lg:p-7">
          <div className="flex flex-col items-center gap-3 text-center min-[520px]:flex-row min-[520px]:items-start min-[520px]:gap-4 min-[520px]:text-left">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-brand-700 shadow-sm ring-1 ring-emerald-200/70 sm:h-14 sm:w-14">
              <ShoppingBag className="h-6 w-6 sm:h-7 sm:w-7" />
            </span>
            <div className="min-w-0">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-800 shadow-sm ring-1 ring-emerald-100 sm:text-[11px]">
                <Sparkles className="h-3.5 w-3.5" />
                Sales & payments
              </span>
              <h2 className="mt-2 text-xl font-extrabold tracking-tight text-navy sm:mt-3 sm:text-3xl">
                All orders
              </h2>
              <p className="mx-auto mt-1.5 max-w-xl text-xs leading-relaxed text-slate-600 min-[520px]:mx-0 sm:mt-2 sm:text-sm">
                Track customer purchases, payment status, and order amounts.
              </p>
            </div>
          </div>
        </div>
      </header>

      {showFilterPanel && (
        <AdminFiltersPanel
          title="Find orders"
          subtitle={`Email needs ${filterTextMinLen}+ letters · amount is exact match`}
          hasInput={hasInput}
          hasAppliedFilter={hasAppliedFilter}
          matchCount={totalDataCount}
          matchLabel="order"
          onClear={reset}
        >
          <AdminFilterField
            icon={Mail}
            label="Customer email"
            value={values.email}
            onChange={(e) => setField("email", e.target.value)}
            placeholder="user@example.com"
            hint={
              emailPending
                ? `Type ${filterTextMinLen - emailTrim.length} more character(s)`
                : undefined
            }
          />
          <AdminFilterField
            icon={CircleDot}
            label="Payment status"
            type="select"
            value={values.status}
            onChange={(e) => setField("status", e.target.value)}
            options={STATUS_OPTIONS}
          />
          <AdminFilterField
            icon={IndianRupee}
            label="Amount (exact)"
            type="number"
            value={values.amount}
            onChange={(e) => setField("amount", e.target.value)}
            placeholder="e.g. 4999"
          />
        </AdminFiltersPanel>
      )}

      <CommonTable
        {...tableConfig}
        tableTitle="Order history"
        tableSubtitle="Newest orders first"
        filterBadge={
          hasAppliedFilter ? (
            <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-800 ring-1 ring-brand-100">
              Filter applied
            </span>
          ) : null
        }
      />
    </PageShell>
  );
}

export default AllOrders;
