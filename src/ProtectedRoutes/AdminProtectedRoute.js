import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { AdminAuthContext } from "../context/AdminAuthContext";

const AdminProtectedRoute = ({ children }) => {
  const { verifyAdminAuth, isAdminAuthenticated, setIsAdminAuthenticated } =
    useContext(AdminAuthContext);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const isValid = await verifyAdminAuth(); // use return value
      setIsAdminAuthenticated(isValid); // set accordingly
      setIsAuthChecked(true);
    };
    checkAuth();
  }, [verifyAdminAuth]);

  if (!isAuthChecked) {
    return <div>Loading....</div>; // or show a loader component if you have one
  }

  return isAdminAuthenticated ? (
    children
  ) : (
    <Navigate to="/panel/signin" replace />
  );
};

export default AdminProtectedRoute;
