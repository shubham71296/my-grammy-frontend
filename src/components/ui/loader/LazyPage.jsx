import { Suspense } from "react";
import PageSpinner from "./PageSpinner";

/** Suspense boundary for standalone lazy pages (login, policies, etc.) */
export default function LazyPage({ children }) {
  return <Suspense fallback={<PageSpinner />}>{children}</Suspense>;
}
