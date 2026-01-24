import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// --- Modal implementation ---
const ConfirmModal = ({ open, title, message, onConfirm, onCancel }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-gray-700 mb-5">{message}</p>
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-gray-100 rounded text-sm hover:bg-gray-200"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-red-500 rounded text-sm text-white hover:bg-red-600"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const ITEMS_PER_PAGE = 10;

// Now display Name, Phone No., and Created At; show createdAt formatted.
const AllUsers = () => {
  const [userData, setUserData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [onModalConfirm, setOnModalConfirm] = useState(() => () => {});

  const navigate = useNavigate();

  // Function to open confirmation modal
  const openModal = (title, message, onConfirm) => {
    setModalTitle(title);
    setModalMessage(message);
    setOnModalConfirm(() => onConfirm); // store function to run
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalTitle("");
    setModalMessage("");
    setOnModalConfirm(() => () => {});
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const adminToken = localStorage.getItem("admin-token");
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/admin/all-save-data`,
        {
          headers: {
            Authorization: `${adminToken}`,
          },
        }
      );
      setUserData(data?.data || data || []);
      setFilteredData(data?.data || data || []);
    } catch (err) {
      setUserData([]);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Update filtering by only name and mobile number
  useEffect(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) {
      setFilteredData(userData);
      setCurrentPage(1);
      return;
    }
    const filtered = userData.filter((row) => {
      return (
        (row.name && row.name.toLowerCase().includes(term)) ||
        (row.mobileNumber && row.mobileNumber.toString().toLowerCase().includes(term))
      );
    });
    setFilteredData(filtered);
    setCurrentPage(1);
  }, [searchTerm, userData]);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentRows = filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleRowClick = (row) => {
    navigate("/panel/actions", { state: row });
  };

  // Delete individual user by mobile number (with modal)
  const handleDeleteUser = (row) => {
    openModal(
      "Delete User",
      `Are you sure you want to permanently delete user "${row.name || row.mobileNumber}"? This action cannot be undone.`,
      () => confirmDeleteUser(row.mobileNumber)
    );
  };

  // Actually delete after modal confirmation
  const confirmDeleteUser = async (mobileNumber) => {
    closeModal();
    setDeleting(true);
    try {
      const adminToken = localStorage.getItem("admin-token");
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/admin/delete-individual-record`,
        { mobileNumber },
        {
          headers: { Authorization: `${adminToken}` },
        }
      );
      await fetchUsers();
    } catch (err) {
      alert(
        "Error deleting user. " +
          (err?.response?.data?.message || err?.message || "")
      );
    } finally {
      setDeleting(false);
    }
  };

  // Delete all users (with modal)
  const handleDeleteAll = () => {
    openModal(
      "Delete All Users",
      "Are you sure you want to permanently delete ALL users? This action will remove ALL user records and CANNOT be undone.",
      confirmDeleteAll
    );
  };

  const confirmDeleteAll = async () => {
    closeModal();
    setDeleting(true);
    try {
      const adminToken = localStorage.getItem("admin-token");
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/admin/delete-all-records`,
        {},
        {
          headers: { Authorization: `${adminToken}` },
        }
      );
      await fetchUsers();
    } catch (err) {
      alert(
        "Error deleting all records. " +
          (err?.response?.data?.message || err?.message || "")
      );
    } finally {
      setDeleting(false);
    }
  };

  // Helper function to format createdAt date string for display
  const formatCreatedAt = (createdAt) => {
    if (!createdAt) return "";
    // Try to create a JS Date from ISO and display as e.g. 2024-03-29 13:40
    const date = new Date(createdAt);
    if (isNaN(date.getTime())) return createdAt;
    // Format as YYYY-MM-DD HH:mm
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const mins = date.getMinutes().toString().padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${mins}`;
  };

  return (
    <div className="px-4 py-4 sm:px-6 sm:py-6 max-w-3xl mx-auto">
      <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6 flex justify-between items-center">
        <span>All Users</span>
        <button
          onClick={handleDeleteAll}
          className="px-4 py-1 sm:py-2 bg-red-100 text-red-700 text-xs sm:text-sm rounded hover:bg-red-200 transition"
          disabled={loading || deleting || userData.length === 0}
        >
          Delete All
        </button>
      </h2>

      {/* Confirmation Modal */}
      <ConfirmModal
        open={modalOpen}
        title={modalTitle}
        message={modalMessage}
        onConfirm={onModalConfirm}
        onCancel={closeModal}
      />

      {/* Search */}
      <div className="mb-4 sm:mb-6">
        <input
          type="text"
          placeholder="Search by name or phone number"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          disabled={loading || deleting}
          className="w-full max-w-md p-2 sm:p-3 text-sm sm:text-base border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow-md rounded-md text-sm sm:text-base">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : (
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="text-left px-4 py-2 sm:px-6 sm:py-3">Name</th>
                <th className="text-left px-4 py-2 sm:px-6 sm:py-3">Phone No.</th>
                <th className="text-left px-4 py-2 sm:px-6 sm:py-3">
                  Created At
                </th>
                <th className="text-center px-4 py-2 sm:px-6 sm:py-3 w-24">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentRows.length > 0 ? (
                currentRows.map((row) => (
                  <tr
                    key={row._id}
                    className="border-t group transition"
                  >
                    <td
                      className="px-4 py-2 sm:px-6 sm:py-4 font-medium cursor-pointer hover:bg-blue-50"
                      onClick={() => handleRowClick(row)}
                    >
                      {row.name ? row.name : "App Installed"}
                    </td>
                    <td
                      className="px-4 py-2 sm:px-6 sm:py-4 cursor-pointer hover:bg-blue-50"
                      onClick={() => handleRowClick(row)}
                    >
                      {row.mobileNumber || ""}
                    </td>
                    <td
                      className="px-4 py-2 sm:px-6 sm:py-4 text-gray-600 font-mono whitespace-nowrap"
                    >
                      {row.createdAt ? formatCreatedAt(row.createdAt) : ""}
                    </td>
                    <td className="px-4 py-2 sm:px-6 sm:py-4 text-center">
                      <button
                        className="px-2 py-1 text-xs sm:text-sm text-red-600 bg-red-50 hover:bg-red-100 rounded transition"
                        onClick={() => handleDeleteUser(row)}
                        disabled={deleting}
                        title="Delete user"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center px-4 py-8 sm:px-6 sm:py-10 text-gray-500">
                    No data found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className="mt-4 sm:mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
        <button
          className="px-3 py-1 sm:px-4 sm:py-2 bg-gray-200 text-xs sm:text-sm rounded hover:bg-gray-300 disabled:opacity-50"
          onClick={() => setCurrentPage((prev) => prev - 1)}
          disabled={currentPage === 1 || loading || deleting}
        >
          Previous
        </button>
        <span className="text-xs sm:text-sm text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="px-3 py-1 sm:px-4 sm:py-2 bg-gray-200 text-xs sm:text-sm rounded hover:bg-gray-300 disabled:opacity-50"
          onClick={() => setCurrentPage((prev) => prev + 1)}
          disabled={currentPage === totalPages || totalPages === 0 || loading || deleting}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AllUsers;
