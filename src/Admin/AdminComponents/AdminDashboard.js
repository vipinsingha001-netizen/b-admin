import React from "react";
import { Upload, Image } from "lucide-react"; // optional: lucide-react icons
import { FaUsers } from "react-icons/fa";

const AdminDashboard = () => {
  const cards = [
    {
      title: "Manage Users",
      href: "/admin/panel/all-users",
      icon: <FaUsers className="w-6 h-6 text-blue-500" />, // optional
    },
    {
      title: "Upload Name-Comments",
      href: "/admin/panel/add-names-comments",
      icon: <Upload className="w-6 h-6 text-blue-500" />, // optional
    },
    {
      title: "Upload Images",
      href: "/admin/panel/upload-images",
      icon: <Image className="w-6 h-6 text-blue-500" />, // optional
    },
  ];

  return (
    <section className="px-6 py-12 h-full w-full bg-gradient-to-br from-gray-50 to-white min-h-screen">
      <div className="max-w-7xl h-full flex justify-center items-center">
        <h2 className="text-2xl md:text-5xl font-bold text-gray-800 mb-10">
          Admin Dashboard
        </h2>
      </div>
    </section>
  );
};

export default AdminDashboard;
