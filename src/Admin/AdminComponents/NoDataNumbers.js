import React, { useEffect, useState } from 'react';
import axios from 'axios';

const NoDataNumbers = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNumbers = async () => {
      try {
        setLoading(true);
        const apiUrl = process.env.REACT_APP_API_URL || '';
        // Get token from localStorage (or elsewhere, as needed)
        const token = localStorage.getItem('admin-token');
        const response = await axios.get(
          `${apiUrl}/api/admin/phonenumbers-without-data`,
          {
            headers: {
              Authorization: `${token}`
            }
          }
        );
        setData(response.data.phoneNumbers || []);
      } catch (err) {
        setError('Failed to fetch phone numbers');
      } finally {
        setLoading(false);
      }
    };
    fetchNumbers();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-green-800">
        Phone Numbers Without Data
      </h2>
      {loading && (
        <div className="text-gray-500">Loading...</div>
      )}
      {error && (
        <div className="text-red-600 mb-4">{error}</div>
      )}
      {!loading && !error && data.length === 0 && (
        <div className="text-gray-700">All numbers have data.</div>
      )}
      {!loading && !error && data.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow rounded-md">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b text-left text-green-700">Phone Number</th>
                <th className="px-4 py-2 border-b text-left text-green-700">Missing Status</th>
              </tr>
            </thead>
            <tbody>
              {data.map(({ phoneNumber, missing }, idx) => (
                <tr key={phoneNumber || idx}>
                  <td className="px-4 py-2 border-b">{phoneNumber}</td>
                  <td className="px-4 py-2 border-b">{missing}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default NoDataNumbers;