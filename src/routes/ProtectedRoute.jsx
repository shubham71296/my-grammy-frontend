// import { Navigate } from "react-router-dom";
// import { getDecodedToken } from "../../utils/common-utils";

import { useSelector } from "react-redux";
import { getDecodedToken } from "../utils/common-util";
import { Navigate } from "react-router-dom";

// export default function ProtectedRoute({ children, role = "user" }) {
//   const token = localStorage.getItem("token");
//   const decoded = getDecodedToken(token);

//   // If no token
//   if (!decoded) return <Navigate to="/login" replace />;

//   // If role mismatch
//   if (decoded.role !== role) {
//     return role === "admin"
//       ? <Navigate to="/admin/login" replace />
//       : <Navigate to="/login" replace />;
//   }

//   return children;
// }

 export default function ProtectedRoute({ children, allowedRoles }) {
  const { token } = useSelector((state) => state.auth);
  
  if (!token) return <Navigate to="/login" replace />;

  const user = getDecodedToken(token);
  if (!user) return <Navigate to="/login" replace />;

  // Restrict by role
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Send user to their correct dashboard
    return <Navigate to={`/${user.role}`} replace />;
  }

  return children;
};

// import React, { useMemo } from "react";
// import { Navigate, useLocation } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import { getDecodedToken } from "../utils/common-util"; // adjust path
// // import your logout action — adjust path to your auth slice
// // e.g. import { logout } from "../store/authSlice";
// import { logout } from "../store/authSlice"; // <-- change or remove if different

/**
 * ProtectedRoute:
 * - children: node to render when authorized
 * - allowedRoles: optional array/string of allowed roles (e.g. ['admin'])
 *
 * Behavior:
 * - No token / invalid token -> redirect to /login
 * - Expired token -> dispatch logout and redirect to /login (state.reason = "token_expired")
 * - Wrong role -> redirect to /unauthorized
 */
// export default function ProtectedRoute({ children, allowedRoles }) {
//   const location = useLocation();
//   const dispatch = useDispatch();

//   // protect against missing slice
//   const { token } = useSelector((state) => state.auth || {});

//   // not logged in
//   if (!token) return <Navigate to="/login" replace state={{ from: location }} />;

//   // decode token (memoized)
//   const user = useMemo(() => {
//     try {
//       return getDecodedToken(token);
//     } catch {
//       return null;
//     }
//   }, [token]);

//   // invalid token
//   if (!user) {
//     return <Navigate to="/login" replace state={{ from: location }} />;
//   }

//   // token expiry check if `exp` present (exp is seconds since epoch in JWT)
//   if (user.exp && typeof user.exp === "number") {
//     const nowSec = Math.floor(Date.now() / 1000);
//     if (user.exp <= nowSec) {
//       // token expired -> try to logout then redirect to login
//       try {
//         // if you export a logout action from your auth slice, dispatch it
//         dispatch(logout());
//       } catch (e) {
//         // fallback: clear localStorage and any client state you use
//         try {
//           localStorage.removeItem("token");
//         } catch (err) {}
//       }

//       return (
//         <Navigate
//           to="/login"
//           replace
//           state={{ from: location, reason: "token_expired" }}
//         />
//       );
//     }
//   }

//   // role check (optional)
//   if (allowedRoles) {
//     const roles = Array.isArray(allowedRoles) ? allowedRoles.map(String) : [String(allowedRoles)];
//     if (!roles.includes(String(user.role))) {
//       return <Navigate to="/unauthorized" replace />;
//     }
//   }

//   // all good -> render children
//   return <>{children}</>;
// }
