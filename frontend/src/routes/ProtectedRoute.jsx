import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, role }) {

  // =========================================
  // GET USER FROM LOCAL STORAGE
  // =========================================

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  // =========================================
  // CHECK LOGIN
  // =========================================

  if (!user) {

    return <Navigate to="/" />;
  }

  // =========================================
  // CHECK ROLE
  // =========================================

  if (role && user.role_name !== role) {

    return <Navigate to="/" />;
  }

  // =========================================
  // ALLOW ACCESS
  // =========================================

  return children;
}

export default ProtectedRoute;