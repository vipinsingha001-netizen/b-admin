import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminAuthContext } from "../../context/AdminAuthContext";


const AdminResetPassword = () => {
  const { forgetPassword } = useContext(AdminAuthContext);
  const navigate = useNavigate();

  // State to manage email and password input
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");

  //   // Handle form submission
  const handleResetPassword = async (e) => {
    e.preventDefault();

    // Create reset password data object
    const resetPasswordData = {
      email,
      newPassword,
    };

    try {
      const response = await forgetPassword(resetPasswordData);
      if (response.status === 200) {
        navigate("/admin/panel/verify-account", { state: { email } });
      }
    } catch (error) {
      setError("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="flex items-center justify-center h-full bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded shadow-lg">
        <div className="flex justify-between items-center ">
          <h2 className="text-xl font-semibold text-center text-gray-900 ">
            Forget Admin Password
          </h2>
        </div>

        {/* Error message */}
        {error && <p className="text-red-500 text-center">{error}</p>}

        <form className="space-y-6" onSubmit={handleResetPassword}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="relative block w-full px-3 py-2 mb-4 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="new-password" className="sr-only">
                New Password
              </label>
              <input
                id="new-password"
                name="newPassword"
                type="password"
                autoComplete="new-password"
                required
                className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md group hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Reset Password
            </button>
          </div>
          {/* LogIn */}
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <a
                href="/admin/panel/signin"
                className="font-medium text-indigo-600 hover:text-indigo-500 px-1"
              >
                Log In
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminResetPassword;
