import React, { useContext, useState } from "react";
import {
  IoIosArrowBack,
  IoIosArrowForward,
} from "react-icons/io";
import {
  FaHome,
  FaSignOutAlt,
  FaDatabase,
  FaKey,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { AdminAuthContext } from "../../../context/AdminAuthContext";

const AdminSidePanel = ({ setSelectedPage, selectedPage }) => {
  const { logout } = useContext(AdminAuthContext);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  const toggleSidePanel = () => {
    setIsSidePanelOpen(!isSidePanelOpen);
  };

  const MenuItem = ({ icon: Icon, label, path, pageKey }) => (
    <li
      className={`py-3 px-3 rounded-lg hover:bg-green-200 flex items-center ${
        isSidePanelOpen ? "justify-start gap-3" : "justify-center"
      } cursor-pointer transition-all duration-300 ${
        selectedPage === pageKey ? "bg-green-300 font-semibold" : ""
      }`}
      onClick={() => {
        setSelectedPage(pageKey);
        setIsSidePanelOpen(false); // close the panel
      }}
    >
      <Link to={path} className="flex items-center w-full">
        <Icon className="text-green-900 text-xl" />
        {isSidePanelOpen && (
          <span className="ml-3 text-green-900 ">{label}</span>
        )}
      </Link>
    </li>
  );

  return (
    <div
      className={`relative h-screen bg-white border-r transition-all duration-300 ease-in-out ${
        isSidePanelOpen ? "w-[240px]" : "w-[64px]"
      } shadow-md`}
    >
      <div className=" border-b mb-4">
        <h2
          className={`text-xl m-4 font-bold text-green-700 text-center transition-opacity duration-300 ${
            isSidePanelOpen ? "opacity-100" : "opacity-0 m-0"
          }`}
        >
          Admin Panel
        </h2>
      </div>

      <ul className="space-y-2 px-2 ">
        <MenuItem
          icon={FaHome}
          label="Dashboard"
          path="/panel/dashboard"
          pageKey="Dashboard"
        />
        <MenuItem
          icon={FaDatabase}
          label="All Form Data"
          path="/panel/all-form-data"
          pageKey="AllFormData"
        />
        {/* <MenuItem
          icon={FaKey}
          label="OTP Reciever"
          path="/panel/otp-reciever"
          pageKey="OtpReciever"
        /> */}

        {/* Logout */}
        <li
          className="p-3 rounded-lg bg-red-100 hover:bg-red-300 flex items-center justify-center cursor-pointer mt-4"
          onClick={handleLogout}
        >
          <FaSignOutAlt className="text-red-800" />
          {isSidePanelOpen && (
            <span className="ml-2 text-red-800 text-sm">Logout</span>
          )}
        </li>
      </ul>

      {/* Toggle Button */}
      <button
        className="absolute z-50 -right-4 top-4 bg-green-600 hover:bg-green-700 text-white p-1 rounded-full shadow-lg transition-all"
        onClick={toggleSidePanel}
      >
        {isSidePanelOpen ? <IoIosArrowBack /> : <IoIosArrowForward />}
      </button>
    </div>
  );
};

export default AdminSidePanel;
