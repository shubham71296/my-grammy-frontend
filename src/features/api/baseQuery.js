import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logout } from "../auth/authSlice";

import { normalizeApiBase } from "../../utils/apiBase";

const API_BASE = normalizeApiBase(import.meta.env.VITE_API_BASE_URL);

export const prepareHeaders = (headers, { getState }) => {
  const token = getState().auth?.token;
  if (token) headers.set("authorization", `Bearer ${token}`);
  return headers;
};

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_BASE,
  prepareHeaders,
});

export const baseQueryWithReauth = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);
  if (result.error?.status === 401) {
    api.dispatch(logout());
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }
  return result;
};
