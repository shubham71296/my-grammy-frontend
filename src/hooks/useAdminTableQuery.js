import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { buildListBody } from "../utils/api-query";
import { adminApi } from "../features/api/adminApi";

const ENDPOINTS = {
  users: "getAllUsers",
  orders: "getAllUserOrders",
  instruments: "getAdminInstruments",
  courses: "getAdminCourses",
};

/**
 * Imperative fetch for CommonTable pagination (RTK lazy initiate).
 * @param {'users'|'orders'|'instruments'|'courses'} table
 */
export function useAdminTableQuery(table) {
  const dispatch = useDispatch();
  const endpointName = ENDPOINTS[table];

  const fetchPage = useCallback(
    async ({ query = {}, projection = {}, skip = 0, limit = 5, sort = { createdAt: -1 } }) => {
      const body = buildListBody({ query, projection, skip, limit, sort });
      const result = await dispatch(
        adminApi.endpoints[endpointName].initiate(body, { forceRefetch: true })
      ).unwrap();
      return result;
    },
    [dispatch, endpointName]
  );

  return { fetchPage };
}
