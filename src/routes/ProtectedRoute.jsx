import { useSelector } from "react-redux";
import { getDecodedToken } from "../utils/common-util";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { token } = useSelector((state) => state.auth);

  if (!token) return <Navigate to="/login" replace />;

  const user = getDecodedToken(token);
  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={`/${user.role}`} replace />;
  }

  return children;
}
