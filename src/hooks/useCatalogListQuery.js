import { useMemo, useState } from "react";
import { useDebounce } from "./useDebounce";
import { buildTextOrPriceQuery } from "../utils/api-query";
import { INSTRUMENT_SEARCH, COURSE_SEARCH } from "../constants/catalogSearch";
import { useGetInstrumentsQuery, useGetCoursesQuery } from "../features/api/catalogApi";

const SEARCH_BY_CATALOG = {
  instruments: INSTRUMENT_SEARCH,
  courses: COURSE_SEARCH,
};

/**
 * Debounced search + RTK list query for catalog pages.
 * @param {{ catalog: 'instruments' | 'courses', guest?: boolean }} options
 */
export function useCatalogListQuery({ catalog, guest = false }) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);
  const searchConfig = SEARCH_BY_CATALOG[catalog];

  const listParams = useMemo(() => {
    const q = String(debouncedSearch ?? "").trim();
    const base = q ? { query: buildTextOrPriceQuery(q, searchConfig) } : {};
    return guest ? { guest: true, ...base } : base;
  }, [debouncedSearch, guest, searchConfig]);

  const instrumentQuery = useGetInstrumentsQuery(listParams, {
    skip: catalog !== "instruments",
  });
  const courseQuery = useGetCoursesQuery(listParams, {
    skip: catalog !== "courses",
  });

  const active = catalog === "instruments" ? instrumentQuery : courseQuery;

  return {
    search,
    setSearch,
    data: active.data ?? [],
    isLoading: active.isLoading,
    isError: active.isError,
  };
}
