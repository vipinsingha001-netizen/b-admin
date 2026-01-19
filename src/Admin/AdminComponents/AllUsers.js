import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ITEMS_PER_PAGE = 10;

// Only display Name and Phone No. (Mobile Number). Clicking row redirects to /panel/actions with row data in state.
const AllUsers = () => {
  const [userData, setUserData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
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

  return (
    <div className="px-4 py-4 sm:px-6 sm:py-6 max-w-2xl mx-auto">
      <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">
        All Users
      </h2>

      {/* Search */}
      <div className="mb-4 sm:mb-6">
        <input
          type="text"
          placeholder="Search by name or phone number"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
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
              </tr>
            </thead>
            <tbody>
              {currentRows.length > 0 ? (
                currentRows.map((row) => (
                  <tr
                    key={row._id}
                    className="border-t cursor-pointer hover:bg-blue-50 transition"
                    onClick={() => handleRowClick(row)}
                  >
                    <td className="px-4 py-2 sm:px-6 sm:py-4 font-medium">{row.name || ""}</td>
                    <td className="px-4 py-2 sm:px-6 sm:py-4">{row.mobileNumber || ""}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" className="text-center px-4 py-8 sm:px-6 sm:py-10 text-gray-500">
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
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="text-xs sm:text-sm text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="px-3 py-1 sm:px-4 sm:py-2 bg-gray-200 text-xs sm:text-sm rounded hover:bg-gray-300 disabled:opacity-50"
          onClick={() => setCurrentPage((prev) => prev + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AllUsers;
