import { useMemo, useState } from "react";
import { useDebounce } from "./useDebounce";
import { buildTextOrPriceQuery } from "../utils/api-query";
import { useGetMyOrdersQuery } from "../features/api/catalogApi";

const ORDER_SEARCH = {
  textField: "items.title",
  priceField: "amount",
};

export function useOrderListQuery() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);

  const listParams = useMemo(() => {
    const q = String(debouncedSearch ?? "").trim();
    return q ? { query: buildTextOrPriceQuery(q, ORDER_SEARCH) } : {};
  }, [debouncedSearch]);

  const { data = [], isLoading, isError, refetch } = useGetMyOrdersQuery(listParams);

  return { search, setSearch, data, isLoading, isError, refetch };
}
