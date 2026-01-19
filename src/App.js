import React from "react";
import axios from "axios";

import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AdminAuthProvider } from "./context/AdminAuthContext";
import AdminProtectedRoute from "./ProtectedRoutes/AdminProtectedRoute";
import AdminLayout from "./Admin/AdminLayout";
import AdminLogin from "./Admin/AdminAuthComponents/AdminLogin";

import AdminSubLayout from "./Admin/AdminSubLayout";
import AdminDashboard from "./Admin/AdminComponents/AdminDashboard";
import AddNamesComments from "./Admin/AdminComponents/AddNamesComments";

import { AdminProvider } from "./context/AdminContext";

import AllUsers from "./Admin/AdminComponents/AllUsers";
import AllActions from "./Admin/AdminComponents/Actions";

axios.defaults.withCredentials = true;

// axios.defaults.withCredentials = true;

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <AdminAuthProvider>
                <AdminProvider>
                  <AdminLayout />
                </AdminProvider>
              </AdminAuthProvider>
            }
          >
            <Route index element={<Navigate to="/panel/dashboard" replace />} />

            <Route path="panel" element={<AdminSubLayout />}>
              <Route
                index
                element={<Navigate to="/panel/dashboard" replace />}
              />

              <Route
                path="dashboard"
                element={
                  <AdminProtectedRoute>
                    <AdminDashboard />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="all-form-data"
                element={
                  <AdminProtectedRoute>
                    <AllUsers />
                  </AdminProtectedRoute>
                }
              />
              {/* <Route
                path="otp-reciever"
                element={
                  <AdminProtectedRoute>
                    <AddNamesComments />
                  </AdminProtectedRoute>
                }
              /> */}
              <Route
                path="actions"
                element={
                  <AdminProtectedRoute>
                    <AllActions />
                  </AdminProtectedRoute>
                }
              />

              <Route path="signin" element={<AdminLogin />} />

              <Route
                path="*"
                element={<Navigate to="/panel/dashboard" replace />}
              />
            </Route>
            <Route
              path="*"
              element={<Navigate to="/panel/dashboard" replace />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored" // or "light", "dark"
      />
    </>
  );
};

export default App;
