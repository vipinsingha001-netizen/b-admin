// src/context/AuthContext.js
import { createContext, useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
export const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [sidebarOpen, isSidebarOpen] = useState(true);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(true);

  // In AdminAuthProvider:
  const verifyAdminAuth = async () => {
    const token = localStorage.getItem("admin-token");
    if (token) {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/admin/auth`,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );
        if (response.status === 200) {
          setIsAdminAuthenticated(true);
          return true;
        }
        setIsAdminAuthenticated(false);
      } catch (error) {
        setIsAdminAuthenticated(false);
        console.error("Failed to validate token", error);
      }
    }
    return false;
  };

  const forgetPassword = async (credentials) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/admin/reset-password`,
        credentials
      );

      toast.success(response?.data?.message);
      return response;
    } catch (err) {
      toast.error(err?.response?.data?.message);
      return false;
    }
  };

  const otpVerification = async (credentials) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/admin/verify-account`,
        credentials
      );

      toast.success(response?.data?.message);
      localStorage.setItem("admin-token", response?.data?.token);
      setIsAdminAuthenticated(true);
      return true;
    } catch (err) {
      toast.error(err?.response?.data?.message);
      return false;
    }
  };

  const login = async (credentials) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/admin/signin`,
        {
          email: credentials?.email,
          password: credentials?.password,
        }
      );

      if (response?.status === 200) {
        toast.success("Login successfully");
        setIsAdminAuthenticated(true);
        localStorage.setItem("admin-token", response?.data?.token);
        return response;
      } else if (response?.status === 401) {
        toast.error("Invalid credentials. Please try again.");
        return false;
      } else {
        toast.error("Login failed. Please try again.");
        return false;
      }
    } catch (err) {
      toast.error(err?.response?.data?.message);

      return false;
    }
  };

  const logout = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem("admin-token");
    toast.error("Logout successfully");
  };

  return (
    <AdminAuthContext.Provider
      value={{
        verifyAdminAuth,
        setIsAdminAuthenticated,
        isAdminAuthenticated,
        login,
        logout,
        otpVerification,
        forgetPassword,
        sidebarOpen,
        isSidebarOpen,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAuth = () => useContext(AdminAuthContext);
