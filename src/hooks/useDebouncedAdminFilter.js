import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDebounce } from "./useDebounce";

export const ADMIN_FILTER_DEBOUNCE_MS = 450;

/**
 * Debounced admin table filters with deduped applyQuery calls.
 * @param {object} options
 * @param {Function} options.applyQuery
 * @param {boolean} [options.enabled]
 * @param {Function} options.buildQuery - (values) => Mongo query object
 * @param {object} options.initialValues
 */
export function useDebouncedAdminFilter({
  applyQuery,
  enabled = true,
  buildQuery,
  initialValues,
}) {
  const [values, setValues] = useState(initialValues);
  const debouncedValues = useDebounce(values, ADMIN_FILTER_DEBOUNCE_MS);
  const lastAppliedKey = useRef(null);
  const skipEmptyInitial = useRef(true);

  const appliedQuery = useMemo(
    () => buildQuery(debouncedValues),
    [debouncedValues, buildQuery]
  );

  const hasAppliedFilter = Object.keys(appliedQuery).length > 0;
  const hasInput = Object.values(values).some((v) => String(v ?? "").trim() !== "");

  const setField = useCallback((key, value) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  }, []);

  const reset = useCallback(() => {
    setValues(initialValues);
    lastAppliedKey.current = "{}";
    applyQuery({});
  }, [applyQuery, initialValues]);

  useEffect(() => {
    if (!enabled) return;

    const key = JSON.stringify(appliedQuery);
    if (skipEmptyInitial.current) {
      skipEmptyInitial.current = false;
      if (key === "{}") return;
    }
    if (lastAppliedKey.current === key) return;

    lastAppliedKey.current = key;
    applyQuery(appliedQuery);
  }, [appliedQuery, enabled, applyQuery]);

  return {
    values,
    setField,
    reset,
    hasInput,
    hasAppliedFilter,
  };
}
