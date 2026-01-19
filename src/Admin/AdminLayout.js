import React, { useContext, useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { AdminAuthContext } from "../context/AdminAuthContext";



const AdminLayout = () => {
  const { isAdminAuthenticated } = useContext(AdminAuthContext);

  return (
    <div className=" h-screen w-screen overflow-y-hidden">
      <div className={`w-full h-[100vh] overflow-y-auto overflow-x-hidden`}>
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
