import React, { useContext, useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidePanel from "./AdminComponents/SidePanel/AdminSidePanel";
import { AdminAuthContext } from "../context/AdminAuthContext";

const AdminSubLayout = () => {
  const [selectedPage, setSelectedPage] = useState("Category");
  const { isAdminAuthenticated } = useContext(AdminAuthContext);

  return (
    <div className="flex h-[100vh] w-screen overflow-y-hidden">
      {isAdminAuthenticated && (
        <div className="flex  flex-col h-full flex-wrap justify-center gap-4 hide-scrollbar">
          <AdminSidePanel
            setSelectedPage={setSelectedPage}
            selectedPage={selectedPage}
            // handleLogout={handleLogout}
          />
        </div>
      )}

      <div className="w-full h-full overflow-y-auto overflow-x-hidden hide-scrollbar">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminSubLayout;
