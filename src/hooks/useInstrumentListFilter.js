import { useDebouncedAdminFilter } from "./useDebouncedAdminFilter";
import {
  buildInstrumentAdminFilterQuery,
  filterTextMinLen,
} from "../utils/api-query";

const INITIAL = { title: "", price: "" };

export function useInstrumentListFilter({ applyQuery, enabled = true }) {
  const { values, setField, reset, hasInput, hasAppliedFilter } =
    useDebouncedAdminFilter({
      applyQuery,
      enabled,
      buildQuery: buildInstrumentAdminFilterQuery,
      initialValues: INITIAL,
    });

  const titleTrim = String(values.title).trim();
  const titlePending =
    titleTrim.length > 0 && titleTrim.length < filterTextMinLen;

  return {
    title: values.title,
    price: values.price,
    setTitle: (v) => setField("title", v),
    setPrice: (v) => setField("price", v),
    reset,
    hasInput,
    hasAppliedFilter,
    titlePending,
  };
}
