import { Link } from "react-router-dom";
import {
  Library,
  Plus,
  Sparkles,
  Package,
  Type,
  IndianRupee,
} from "lucide-react";
import CommonTable from "../../components/ui/table/CommonTable";
import { useSelector } from "react-redux";
import { headCells, menuOptions } from "../../utils/my-instruments-columns";
import { PageShell } from "../../components/ui/tw/PageShell";
import {
  AdminFilterField,
  AdminFiltersPanel,
} from "../../components/ui/tw/AdminFiltersPanel";
import { useAdminTableData } from "../../hooks/useAdminTableData";
import { useInstrumentListFilter } from "../../hooks/useInstrumentListFilter";
import { filterTextMinLen } from "../../utils/api-query";

function MyInstrumentsList() {
  const { countTotalData } = useSelector((state) => state.dataCount);

  const { tableConfig, applyQuery, totalDataCount } = useAdminTableData({
    table: "instruments",
    headCells,
    menuOptions,
    textLabel: "Instrument",
    buttonRoute: "/admin/addinstruments",
  });

  const totalCount = countTotalData ?? 0;
  const showFilters = totalCount > 0;

  const {
    title,
    price,
    setTitle,
    setPrice,
    reset,
    hasInput,
    hasAppliedFilter,
    titlePending,
  } = useInstrumentListFilter({ applyQuery, enabled: showFilters });

  return (
    <PageShell className="pb-10">
      {/* Hero */}
      <header className="relative mb-6 overflow-hidden rounded-[1.75rem] border border-amber-100/80 bg-gradient-to-br from-white via-amber-50/35 to-brand-50/50 shadow-[0_18px_45px_-30px_rgba(146,64,14,0.35)]">
        <div
          className="absolute -right-10 -top-12 h-36 w-36 rounded-full bg-amber-400/15 blur-3xl"
          aria-hidden
        />
        <div
          className="absolute -bottom-14 left-6 h-32 w-32 rounded-full bg-brand-500/10 blur-3xl"
          aria-hidden
        />
        <div className="relative flex flex-col gap-4 p-4 sm:p-6 lg:flex-row lg:items-center lg:justify-between lg:p-7">
          <div className="flex flex-col items-center gap-3 text-center min-[520px]:flex-row min-[520px]:items-start min-[520px]:gap-4 min-[520px]:text-left">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-brand-700 shadow-sm ring-1 ring-amber-200/70 sm:h-14 sm:w-14">
              <Library className="h-6 w-6 sm:h-7 sm:w-7" />
            </span>
            <div className="min-w-0">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-brand-700 shadow-sm ring-1 ring-brand-100 sm:text-[11px]">
                <Sparkles className="h-3.5 w-3.5" />
                Catalog inventory
              </span>
              <h2 className="mt-2 text-xl font-extrabold tracking-tight text-navy sm:mt-3 sm:text-3xl">
                Instruments list
              </h2>
              <p className="mx-auto mt-1.5 max-w-xl text-xs leading-relaxed text-slate-600 min-[520px]:mx-0 sm:mt-2 sm:text-sm">
                Manage storefront instruments — edit details, preview images, or remove
                listings.
              </p>
            </div>
          </div>

          <Link
            to="/admin/addinstruments"
            className="inline-flex min-h-10 w-full shrink-0 items-center justify-center gap-2 rounded-2xl bg-brand-600 px-4 text-sm font-bold text-white shadow-md shadow-brand-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-700 hover:shadow-lg active:translate-y-0 min-[520px]:w-auto"
          >
            <Plus className="h-5 w-5" />
            Add instrument
          </Link>
        </div>
      </header>

      {/* Stats */}
      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            Total instruments
          </p>
          <p className="mt-1 flex items-center gap-2 text-2xl font-extrabold text-navy">
            <Package className="h-5 w-5 text-amber-600" />
            {totalCount.toLocaleString("en-IN")}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            Showing (this page)
          </p>
          <p className="mt-1 text-2xl font-extrabold text-brand-700">
            {totalDataCount.toLocaleString("en-IN")}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            Quick tip
          </p>
          <p className="mt-1 text-sm font-medium leading-snug text-slate-600">
            Use row actions to view, edit, or delete any instrument.
          </p>
        </div>
      </div>

      {/* Filters — auto-apply as you type */}
      {showFilters && (
        <AdminFiltersPanel
          title="Find instruments"
          subtitle={`Name needs ${filterTextMinLen}+ letters · price is exact match`}
          hasInput={hasInput}
          hasAppliedFilter={hasAppliedFilter}
          matchCount={totalDataCount}
          onClear={reset}
          columns={2}
        >
          <AdminFilterField
            icon={Type}
            label="Instrument name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Grammy keyboard…"
            hint={
              titlePending
                ? `Type ${filterTextMinLen - String(title).trim().length} more character(s) to search`
                : undefined
            }
          />
          <AdminFilterField
            icon={IndianRupee}
            label="Price (exact)"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="e.g. 9000"
          />
        </AdminFiltersPanel>
      )}

      <CommonTable
        {...tableConfig}
        tableTitle="All listings"
        tableSubtitle="Sorted by newest first"
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

export default MyInstrumentsList;
