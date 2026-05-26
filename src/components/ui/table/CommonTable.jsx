import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ListOrdered,
} from "lucide-react";
import DynamicRowComponent from "./DynamicRowComponent";
import DynamicOption from "./DynamicOption";
import DataNotFoundDynamicTable from "./DataNotFoundDynamicTable";
import { renderTableAction } from "../../../features/ui/uiSlice";
import { Dropdown } from "../tw/Dropdown";
import { Spinner } from "../tw/Spinner";
import { cn } from "../../../lib/cn";

const DEFAULT_LIMITS = [5, 10, 20, 50];

function parsePagination(searchParams, defaultLimit) {
  const pageRaw = parseInt(searchParams.get("page") ?? "", 10);
  const limitRaw = parseInt(searchParams.get("limit") ?? "", 10);
  const page = Number.isFinite(pageRaw) && pageRaw > 0 ? pageRaw : 1;
  const limit =
    Number.isFinite(limitRaw) && limitRaw > 0 ? limitRaw : defaultLimit;
  return { page, limit, offset: (page - 1) * limit };
}

const TableDataRow = memo(function TableDataRow({
  row,
  rowIndex,
  headCells,
  menuOptions,
  isLastRow,
}) {
  const actionCell = row.find(
    (c) => typeof c === "object" && c !== null && !Array.isArray(c)
  );

  return (
    <tr
      className={cn(
        "group border-b border-slate-100/90 bg-white transition duration-200",
        "hover:bg-gradient-to-r hover:from-brand-50/60 hover:to-violet-50/30",
        rowIndex % 2 === 1 && "bg-slate-50/35",
        isLastRow && "border-b-0"
      )}
    >
      {row.map((cell, colIndex) => {
        const isAction =
          typeof cell === "object" && cell !== null && !Array.isArray(cell);

        if (isAction) {
          return (
            <td
              key={colIndex}
              className="w-12 px-1.5 py-2.5 text-center sm:w-14 sm:px-3 sm:py-3"
            >
              <Dropdown
                align="right"
                trigger={
                  <button
                    type="button"
                    aria-label="Row actions"
                    className={cn(
                      "inline-flex h-9 w-9 items-center justify-center rounded-xl",
                      "border border-slate-200/90 bg-white text-slate-500 shadow-sm",
                      "transition group-hover:border-brand-200 group-hover:text-brand-700",
                      "hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
                    )}
                  >
                    <MoreVertical size={18} />
                  </button>
                }
              >
                {(close) =>
                  menuOptions?.map((option, i) => (
                    <DynamicOption
                      key={option._check ?? i}
                      selectedData={actionCell}
                      handleClose={close}
                      {...option}
                    />
                  ))
                }
              </Dropdown>
            </td>
          );
        }

        return (
          <td
            key={colIndex}
            className="max-w-[15rem] px-3 py-3 text-sm text-slate-700 sm:max-w-none sm:px-4 sm:py-3.5 first:pl-4 sm:first:pl-5"
          >
            <DynamicRowComponent val={cell} i2={colIndex} headCells={headCells} />
          </td>
        );
      })}
    </tr>
  );
});

function CommonTable({
  getData,
  header,
  headCells,
  menuOptions,
  data,
  totalDataCount,
  limitDropdown = DEFAULT_LIMITS,
  textLabel,
  buttonRoute,
  query,
  tableTitle,
  tableSubtitle = "Sorted by newest first",
  filterBadge,
  className,
}) {
  const dispatch = useDispatch();
  const { renderTable } = useSelector((state) => state.ui);
  const { countTotalData } = useSelector((state) => state.dataCount);
  const [searchParams, setSearchParams] = useSearchParams();

  const defaultLimit = limitDropdown[0] ?? 5;
  const { page, limit, offset } = useMemo(
    () => parsePagination(searchParams, defaultLimit),
    [searchParams, defaultLimit]
  );

  const paramsReady =
    searchParams.has("page") &&
    searchParams.has("limit") &&
    searchParams.has("offset");

  const pageCount = Math.max(1, Math.ceil(totalDataCount / limit) || 1);
  const safePage = Math.min(page, pageCount);
  const rangeStart = totalDataCount === 0 ? 0 : (safePage - 1) * limit + 1;
  const rangeEnd = Math.min(safePage * limit, totalDataCount);

  const [loading, setLoading] = useState(false);

  const syncPaginationUrl = useCallback(
    (nextPage, nextLimit) => {
      const nextOffset = (nextPage - 1) * nextLimit;
      setSearchParams(
        {
          page: String(nextPage),
          limit: String(nextLimit),
          offset: String(nextOffset),
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  const getDataRef = useRef(getData);
  getDataRef.current = getData;

  useEffect(() => {
    if (!paramsReady) {
      syncPaginationUrl(1, defaultLimit);
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        await getDataRef.current(limit, offset, query);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [paramsReady, limit, offset, query, defaultLimit, syncPaginationUrl]);

  useEffect(() => {
    if (!renderTable || !paramsReady) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        await getDataRef.current(limit, offset, query);
      } finally {
        if (!cancelled) setLoading(false);
      }
      if (!cancelled) dispatch(renderTableAction({ renderTable: false }));
    })();
    return () => {
      cancelled = true;
    };
  }, [renderTable, paramsReady, limit, offset, query, dispatch]);

  const onChangeLimit = (event) => {
    const nextLimit = parseInt(event.target.value, 10);
    syncPaginationUrl(1, nextLimit);
  };

  const onChangePage = (nextPage) => {
    if (nextPage < 1 || nextPage > pageCount) return;
    syncPaginationUrl(nextPage, limit);
  };

  const resolvedTitle =
    tableTitle ?? (textLabel ? `All ${textLabel}s` : "Data table");

  if (!loading && data.length === 0) {
    return (
      <div className={cn("w-full", className)}>
        <DataNotFoundDynamicTable
          showSimple
          textLabel={textLabel}
          buttonRoute={buttonRoute}
          countTotalData={countTotalData}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "min-w-0 w-full max-w-[calc(100vw-1.5rem)] overflow-hidden md:max-w-full",
        className
      )}
    >
      <div className="min-w-0 max-w-full overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_4px_24px_-10px_rgba(15,23,42,0.12)]">
        {(tableTitle || tableSubtitle || filterBadge) && (
          <div className="flex flex-col gap-3 border-b border-slate-100 bg-gradient-to-r from-slate-50/90 via-white to-brand-50/40 px-4 py-3.5 md:flex-row md:items-center md:justify-between md:px-5">
            <div className="flex min-w-0 items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white shadow-md shadow-brand-600/20">
                <ListOrdered className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <h3 className="text-sm font-extrabold text-navy sm:text-base">
                  {resolvedTitle}
                </h3>
                {tableSubtitle ? (
                  <p className="text-xs text-muted">{tableSubtitle}</p>
                ) : null}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:justify-end">
              {filterBadge}
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                {totalDataCount.toLocaleString("en-IN")} total
              </span>
            </div>
          </div>
        )}

        <div className="relative">
          {loading && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-white/80 backdrop-blur-[2px]">
              <Spinner size="lg" />
              <p className="text-xs font-semibold text-slate-600">Loading…</p>
            </div>
          )}

          <div className="w-full max-w-[calc(100vw-1.5rem)] overflow-x-auto overscroll-x-contain pb-2 [scrollbar-gutter:stable] md:max-w-full">
            <table
              className="w-full min-w-[720px] border-collapse text-left text-sm lg:min-w-full"
              aria-label={textLabel ? `${textLabel} table` : "data table"}
            >
              <thead>
                <tr className="border-b-2 border-brand-100 bg-brand-50/60">
                  {header?.map((headCell, i) => (
                    <th
                      key={headCell}
                      className={cn(
                        "whitespace-nowrap px-3 py-3 text-[11px] font-bold uppercase tracking-wider text-brand-900/70 sm:px-4 sm:py-4 sm:text-xs",
                        i === 0 && "pl-4 sm:pl-5",
                        i === header.length - 1 &&
                          "bg-brand-50 text-center"
                      )}
                    >
                      {headCell}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, rowIndex) => {
                  const actionCell = row.find(
                    (c) =>
                      typeof c === "object" && c !== null && !Array.isArray(c)
                  );
                  const rowKey = actionCell?._id ?? rowIndex;
                  return (
                    <TableDataRow
                      key={rowKey}
                      row={row}
                      rowIndex={rowIndex}
                      headCells={headCells}
                      menuOptions={menuOptions}
                      isLastRow={rowIndex === data.length - 1}
                    />
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-slate-100 bg-gradient-to-r from-slate-50/80 via-white to-brand-50/30 px-3 py-4 md:flex-row md:items-center md:justify-between md:px-5">
          <p className="text-center text-xs font-medium text-slate-600 md:text-left">
            Showing{" "}
            <span className="font-bold text-navy">
              {rangeStart.toLocaleString("en-IN")}–{rangeEnd.toLocaleString("en-IN")}
            </span>{" "}
            of{" "}
            <span className="font-bold text-brand-700">
              {totalDataCount.toLocaleString("en-IN")}
            </span>
          </p>

          <div className="flex w-full min-w-0 flex-col items-center gap-3 md:w-auto md:flex-row">
            <div className="inline-flex max-w-full items-center gap-0.5 rounded-xl border border-slate-200/90 bg-white p-1 shadow-sm sm:gap-1">
              <button
                type="button"
                disabled={safePage <= 1}
                onClick={() => onChangePage(1)}
                className={cn(
                  "rounded-lg p-1.5 text-slate-600 transition hover:bg-brand-50 hover:text-brand-700 sm:p-2",
                  safePage <= 1 && "cursor-not-allowed opacity-35"
                )}
                aria-label="First page"
              >
                <ChevronsLeft size={16} />
              </button>
              <button
                type="button"
                disabled={safePage <= 1}
                onClick={() => onChangePage(safePage - 1)}
                className={cn(
                  "rounded-lg p-1.5 text-slate-600 transition hover:bg-brand-50 hover:text-brand-700 sm:p-2",
                  safePage <= 1 && "cursor-not-allowed opacity-35"
                )}
                aria-label="Previous page"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="min-w-[4.75rem] px-1.5 text-center text-sm font-bold text-navy sm:min-w-[5.5rem] sm:px-2">
                {safePage}{" "}
                <span className="font-medium text-slate-400">/</span> {pageCount}
              </span>
              <button
                type="button"
                disabled={safePage >= pageCount}
                onClick={() => onChangePage(safePage + 1)}
                className={cn(
                  "rounded-lg p-1.5 text-slate-600 transition hover:bg-brand-50 hover:text-brand-700 sm:p-2",
                  safePage >= pageCount && "cursor-not-allowed opacity-35"
                )}
                aria-label="Next page"
              >
                <ChevronRight size={18} />
              </button>
              <button
                type="button"
                disabled={safePage >= pageCount}
                onClick={() => onChangePage(pageCount)}
                className={cn(
                  "rounded-lg p-1.5 text-slate-600 transition hover:bg-brand-50 hover:text-brand-700 sm:p-2",
                  safePage >= pageCount && "cursor-not-allowed opacity-35"
                )}
                aria-label="Last page"
              >
                <ChevronsRight size={16} />
              </button>
            </div>

            <label className="flex w-full items-center justify-center gap-2 text-xs font-semibold text-slate-600 md:w-auto">
              <span className="hidden md:inline">Rows</span>
              <select
                value={limit}
                onChange={onChangeLimit}
                className="input-search-elevated min-w-[7rem] py-2 text-sm font-medium"
                aria-label="Rows per page"
              >
                {limitDropdown.map((n) => (
                  <option key={n} value={n}>
                    {n} / page
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommonTable;
