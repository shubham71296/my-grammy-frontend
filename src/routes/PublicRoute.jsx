import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { getDecodedToken } from "../utils/common-util";
import { Navigate, useLocation } from "react-router-dom";

/**
 * PublicRoute: used for pages like /login /signup /landing
 * - If no token or invalid token => render children (login page)
 * - If token valid => redirect to user's dashboard (e.g. /user or /admin)
 */
export default function PublicRoute({ children }) {
  // call hooks unconditionally (important!)
  const location = useLocation();
  const { token } = useSelector((state) => state.auth || {});

  // decode token once (hook called every render, keeps hook order stable)
  const user = useMemo(() => {
    if (!token) return null;
    try {
      return getDecodedToken(token);
    } catch {
      return null;
    }
  }, [token]);

  // Now safe to short-circuit
  if (!token) return <>{children}</>;
  if (!user) return <>{children}</>;

  // mapped redirect path
  const role = user.role;
  const rolePath = role === "admin" ? "/admin" : "/user";

  return <Navigate to={rolePath} replace state={{ from: location }} />;
}
