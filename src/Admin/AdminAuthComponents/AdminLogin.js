import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminAuthContext } from "../../context/AdminAuthContext";


const AdminLogin = () => {
  const { login } = useContext(AdminAuthContext);

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    const result = await login({ email, password });

    if (result.status === 200) {
      navigate("/admin/panel/dashboard");
    } else if (result.status === 209) {
      navigate("/admin/verify-account", {
        state: { email: result.email },
      });
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-full bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded shadow-lg">
        <div className="flex justify-between items-center">
          <p>Sign in to Admin Panel</p>
        </div>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <form className="space-y-6" onSubmit={onSubmit}>
          <div className="flex flex-col gap-2">
            <input
              type="email"
              required
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none sm:text-sm"
            />
            <input
              type="password"
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none sm:text-sm"
            />
          </div>

          <div className="flex items-center justify-between">
            <a
              href="/admin/panel/reset-password"
              className="text-sm text-indigo-600 hover:text-indigo-500"
            >
              Forgot your password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
