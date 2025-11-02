import React, { useEffect, useState } from "react";
import { FaCheckCircle, FaSpinner } from "react-icons/fa";
import { getAllReports } from "../api/apiService";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

const StatusPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        // Get all reports (in real app, filter by passenger ID)
        const response = await getAllReports();
        // Sort newest to oldest
        const sorted = response.data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setReports(sorted);
      } catch (err) {
        setError("Failed to fetch report history.");
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  // Find the most recent active report (Pending or Acknowledged)
  const activeReport = reports.find(r => r.status === "Pending" || r.status === "Acknowledged");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <div className="bg-gray-800 p-8 md:p-12 rounded-lg shadow-xl text-center w-full max-w-2xl">
        <div className="text-teal-500 mb-6 animate-spin-slow">
          <FaSpinner size={80} />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Your SOS Alert Has Been Sent</h1>
        <p className="text-lg text-gray-400 max-w-lg mx-auto">
          We have successfully received your emergency report. Railway authorities have been notified and are processing your request.
        </p>
        <div className="mt-8 text-sm text-gray-500">
          <p>Please stay calm and keep your phone accessible.</p>
        </div>

        {/* --- Report History Section --- */}
        <div className="mt-12 text-left">
          <h2 className="text-2xl font-bold text-white mb-4">Your Emergency Report History</h2>
          {loading ? (
            <div className="text-center text-teal-300">Loading history...</div>
          ) : error ? (
            <div className="text-center text-red-400">{error}</div>
          ) : reports.length === 0 ? (
            <div className="text-center text-gray-400">No reports found.</div>
          ) : (
            <ul className="space-y-4">
              {reports.map((report, idx) => {
                const isActive = report._id === activeReport?._id;
                return (
                  <li
                    key={report._id}
                    className={`p-4 rounded-lg shadow-md bg-gray-700 flex flex-col md:flex-row md:items-center justify-between ${isActive ? "border-2 border-teal-400" : ""}`}
                  >
                    <div>
                      <div className="font-semibold text-teal-200">Report #{report._id}</div>
                      <div className="text-sm text-gray-300">{format(new Date(report.timestamp), "PPP p")}</div>
                      <div className="mt-1 text-gray-100">Type: {report.emergencyType === "SOS_ALERT" ? "One-Click SOS" : "Detailed Report"}</div>
                      <div className="mt-1 text-gray-100">Status: <span className={`font-bold ${report.status === "Resolved" ? "text-green-400" : report.status === "Acknowledged" ? "text-yellow-300" : "text-red-400"}`}>{report.status}</span></div>
                    </div>
                    {isActive && (
                      <button
                        className="mt-4 md:mt-0 bg-teal-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-teal-700 transition"
                        onClick={() => navigate(`/status?report=${report._id}`)}
                      >
                        View Live Status
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatusPage;
