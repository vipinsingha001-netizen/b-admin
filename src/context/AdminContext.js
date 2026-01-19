// src/context/AuthContext.js
import { createContext, useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
export const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const uploadNameComments = async (nameComments) => {
    const adminToken = localStorage.getItem("admin-token");
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/admin/upload-name-comments`,
        { nameComments },
        {
          headers: {
            Authorization: `${adminToken}`,
          },
        }
      );
      toast.success(response.data.message);
      return response;
    } catch (error) {
      toast.error(error.response.data.message);
      return false;
    }
  };

  // AdminContext
  const getAllNameComments = async ({ page = 1, limit = 50 } = {}) => {
    const adminToken = localStorage.getItem("admin-token");
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/admin/get-all-name-comments`,
        {
          headers: { Authorization: `${adminToken}` }, // or `Bearer ${adminToken}`
          params: { page, limit },
        }
      );
      return response.data;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error fetching comments");
      return { total: 0, nameComments: [], page: 1, totalPages: 1 };
    }
  };

  const deleteDuplicateComments = async () => {
    const adminToken = localStorage.getItem("admin-token");
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/admin/delete-duplicate-comments`,
        {},
        {
          headers: {
            Authorization: `${adminToken}`,
          },
        }
      );
      toast.success(response.data.message);
      return response;
    } catch (error) {
      toast.error(error.response.data.message);
      return false;
    }
  };

  const deleteAllNameComments = async () => {
    const adminToken = localStorage.getItem("admin-token");
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/admin/delete-all-name-comments`,
        {
          headers: {
            Authorization: `${adminToken}`,
          },
        }
      );
      toast.success(response.data.message);
      return response;
    } catch (error) {
      toast.error(error.response.data.message);
      return false;
    }
  };

  const uploadImages = async (selectedFiles) => {
    const formData = new FormData();
    selectedFiles.forEach((file) => formData.append("images", file));

    const adminToken = localStorage.getItem("admin-token");
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/admin/upload-images`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `${adminToken}`,
          },
        }
      );

      toast.success("Images uploaded successfully");
      return response;

      toast.success("Images uploaded successfully");
      return response.data; // ✅ return only data
    } catch (error) {
      console.error("Upload Failed:", error);
      toast.error("Failed to upload images");
      return false;
    }
  };

  const getUploadedImages = async () => {
    const adminToken = localStorage.getItem("admin-token");
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/admin/get-uploaded-images`,
        {
          headers: {
            Authorization: `${adminToken}`,
          },
        }
      );
      toast.success("Images fetched successfully");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch images:", error);
      toast.error("Failed to fetch images");
      return false;
    }
  };

  const uploadVideo = async (file, text) => {
    const formData = new FormData();
    formData.append("video", file);
    formData.append("text", text);

    const adminToken = localStorage.getItem("admin-token");
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/admin/upload-video`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `${adminToken}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Upload Failed:", error);
      toast.error("Failed to upload video");
      return false;
    }
  };

  const getUploadedVideos = async () => {
    const adminToken = localStorage.getItem("admin-token");
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/admin/get-uploaded-videos`,
        {
          headers: {
            Authorization: `${adminToken}`,
          },
        }
      );

      toast.success("Videos fetched successfully");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch images:", error);
      toast.error("Failed to fetch videos");
      return false;
    }
  };

  const deleteAllImages = async () => {
    const adminToken = localStorage.getItem("admin-token");
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/admin/delete-all-images`,
        {
          headers: {
            Authorization: `${adminToken}`,
          },
        }
      );

      toast.success("All images deleted successfully");
      return response;
    } catch (error) {
      console.error("Failed to delete all images:", error);
      toast.error("Failed to delete all images");
      return false;
    }
  };

  const deleteAllVideos = async () => {
    const adminToken = localStorage.getItem("admin-token");
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/admin/delete-all-videos`,
        {
          headers: {
            Authorization: `${adminToken}`,
          },
        }
      );

      toast.success("All videos deleted successfully");
      return response;
    } catch (error) {
      console.error("Failed to delete all videos:", error);
      toast.error("Failed to delete all videos");
      return false;
    }
  };

  const getAllUsers = async () => {
    const adminToken = localStorage.getItem("admin-token");
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/admin/get-all-users`,
        {
          headers: {
            Authorization: `${adminToken}`,
          },
        }
      );
      toast.success("Users fetched successfully");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch users:", error);
      toast.error("Failed to fetch users");
      return false;
    }
  };

  const approveUser = async (userId) => {
    const adminToken = localStorage.getItem("admin-token");
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/admin/approve-user/${userId}`,
        {},
        {
          headers: {
            Authorization: `${adminToken}`,
          },
        }
      );
      toast.success("User approved successfully");
      return response;
    } catch (error) {
      console.error("Failed to approve user:", error);
      toast.error("Failed to approve user");
      return false;
    }
  };

  return (
    <AdminContext.Provider
      value={{
        uploadNameComments,
        getAllNameComments,
        deleteAllNameComments,
        uploadImages,
        getUploadedImages,
        deleteAllImages,
        getAllUsers,
        approveUser,
        deleteDuplicateComments,
        getUploadedVideos,
        uploadVideo,
        deleteAllVideos,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);
