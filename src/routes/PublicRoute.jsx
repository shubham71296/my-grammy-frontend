import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { getDecodedToken } from "../utils/common-util";
import { Navigate, useLocation } from "react-router-dom";

export default function PublicRoute({ children }) {
  const location = useLocation();
  const { token } = useSelector((state) => state.auth || {});

  const user = useMemo(() => {
    if (!token) return null;
    try {
      return getDecodedToken(token);
    } catch {
      return null;
    }
  }, [token]);

  if (!token) return <>{children}</>;
  if (!user) return <>{children}</>;

  const role = user.role;
  const rolePath = role === "admin" ? "/admin" : "/user";

  return <Navigate to={rolePath} replace state={{ from: location }} />;
}
