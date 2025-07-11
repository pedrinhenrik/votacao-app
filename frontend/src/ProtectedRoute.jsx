import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) {
    // Não autenticado? Vai pro login.
    return <Navigate to="/login" replace />;
  }
  return children;
}
