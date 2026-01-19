import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import {
  CustomerAuthContext,
  useCustomerAuth,
} from "../context/CustomerAuthContext";

const CustomerProtectedRoute = ({ children }) => {
  const {
    verifyCustomerAuth,
    isCustomerAuthenticated,
    setIsCustomerAuthenticated,
  } = useCustomerAuth();
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const isValid = await verifyCustomerAuth(); // use return value
      setIsCustomerAuthenticated(isValid); // set accordingly
      setIsAuthChecked(true);
    };
    checkAuth();
  }, [verifyCustomerAuth]);

  // if (!isAuthChecked) {
  //   return <div>Loading....</div>; // or show a loader component if you have one
  // }

  return children;
};

export default CustomerProtectedRoute;
