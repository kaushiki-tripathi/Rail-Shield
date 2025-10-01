import React, { useState, useEffect } from "react";
import { FaEye } from "react-icons/fa";
// --- 1. NEW: We import the Link component from the router ---
import { Link } from "react-router-dom";
import { getAllReports } from "../api/apiService";
import { formatDistanceToNow } from "date-fns";

const StatusBadge = ({ status }) => {
  const styles = {
    Pending: "bg-yellow-100 text-yellow-800",
    Acknowledged: "bg-blue-100 text-blue-800",
    Resolved: "bg-green-100 text-green-800",
  };
  return (
    <span
      className={`px-3 py-1 text-sm font-semibold rounded-full ${
        styles[status] || "bg-gray-100 text-gray-800"
      }`}
    >
      {status}
    </span>
  );
};

const AdminDashboardPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const response = await getAllReports();
        setReports(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching reports:", err);
        setError("Failed to load reports. Please try refreshing the page.");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 py-12 lg:py-20">
      
        <div className="max-w-7xl mx-auto  px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-white ">Admin Dashboard</h1>
          <p className="mt-1 text-gray-100">
            Live emergency reports from across the railway network.
          </p>
        </div>
      

      <main className="max-w-7xl mx-auto py-13 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-xl rounded-lg overflow-x-auto">
          {loading && <p className="p-6 text-center">Loading reports...</p>}
          {error && <p className="p-6 text-center text-red-600">{error}</p>}

          {!loading && !error && (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-10 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Emergency Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Passenger Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Train No.
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    Reported
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reports.map((report) => (
                  <tr key={report._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={report.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800">
                      {report.emergencyType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                      {report.passengerDetails.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                      {report.trainDetails.trainNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                      {formatDistanceToNow(new Date(report.timestamp), {
                        addSuffix: true,
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {/* --- 2. THE FIX: The button is now wrapped in a Link --- */}
                      {/* We create a dynamic URL using the report's unique _id */}
                      <Link
                        to={`/admin/report/${report._id}`}
                        className="text-teal-600 hover:text-teal-900 flex items-center gap-2"
                      >
                        <FaEye />
                        <span className="hidden sm:inline">View Details</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {!loading && !error && reports.length === 0 && (
            <p className="p-6 text-center text-gray-500">
              No emergency reports found.
            </p>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboardPage;
