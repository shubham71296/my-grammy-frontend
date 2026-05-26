import { useCallback, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { filterData } from "../utils/common-util";
import { setTotalCount } from "../features/dataCountSlice";
import { useAdminTableQuery } from "./useAdminTableQuery";

const DEFAULT_LIMITS = [5, 10, 20, 50];

const TABLE_FOOTER_STYLE = {
  paginateStyle: { sx: { float: "right" } },
  limitDropdownStyle: { sx: { float: "right" } },
};

/**
 * Shared state + fetch for admin CommonTable pages.
 * @param {object} options
 * @param {'users'|'orders'|'instruments'|'courses'} options.table
 * @param {Array} options.headCells
 * @param {Array} options.menuOptions
 * @param {string} options.textLabel
 * @param {string} [options.buttonRoute]
 * @param {object} [options.projection]
 * @param {number[]} [options.limitDropdown]
 * @param {boolean} [options.trackTotalCount] — dispatch global count on first load (instruments filter UI)
 */
export function useAdminTableData({
  table,
  headCells,
  menuOptions,
  textLabel,
  buttonRoute,
  projection = { pwd: 0 },
  limitDropdown = DEFAULT_LIMITS,
  trackTotalCount = true,
}) {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { fetchPage } = useAdminTableQuery(table);

  const [activeQuery, setActiveQuery] = useState({});
  const [tableState, setTableState] = useState({
    header: [],
    data: [],
    totalDataCount: 0,
  });

  const isInitialLoadRef = useRef(true);

  const getData = useCallback(
    async (limit, offset, query = {}) => {
      const res = await fetchPage({
        query,
        projection,
        skip: offset,
        limit,
      });

      if (!res.success) return;

      const fd = filterData(res.data, headCells);
      setTableState({
        header: fd.header,
        totalDataCount: res.totalDataCount,
        data: fd.rows,
      });

      if (trackTotalCount && isInitialLoadRef.current) {
        dispatch(setTotalCount({ countTotalData: res.totalDataCount }));
        isInitialLoadRef.current = false;
      }
    },
    [fetchPage, headCells, projection, dispatch, trackTotalCount]
  );

  const getLimitFromUrl = useCallback(() => {
    const parsed = parseInt(searchParams.get("limit") ?? "", 10);
    return Number.isFinite(parsed) && parsed > 0
      ? parsed
      : (limitDropdown[0] ?? 5);
  }, [searchParams, limitDropdown]);

  /** Set filter query and jump to page 1 (CommonTable refetches via `query` prop). */
  const applyQuery = useCallback(
    (query) => {
      setActiveQuery(query);
      const limit = getLimitFromUrl();
      setSearchParams(
        { page: "1", limit: String(limit), offset: "0" },
        { replace: true }
      );
    },
    [getLimitFromUrl, setSearchParams]
  );

  const tableConfig = useMemo(
    () => ({
      getData,
      data: tableState.data,
      totalDataCount: tableState.totalDataCount,
      limitDropdown,
      headCells,
      header: tableState.header,
      menuOptions,
      query: activeQuery,
      textLabel,
      buttonRoute,
      style: TABLE_FOOTER_STYLE,
    }),
    [
      getData,
      tableState,
      limitDropdown,
      headCells,
      menuOptions,
      activeQuery,
      textLabel,
      buttonRoute,
    ]
  );

  return {
    tableConfig,
    activeQuery,
    setActiveQuery,
    applyQuery,
    getLimitFromUrl,
    totalDataCount: tableState.totalDataCount,
  };
}
