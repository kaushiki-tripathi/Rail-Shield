import React, { useState, useEffect } from "react";
import {
  FaInfoCircle,
  FaExclamationTriangle,
  FaTimesCircle,
  FaSearch,
} from "react-icons/fa";
import { getAllReports } from "../api/apiService";
// --- 1. NEW: We import the function to format our date ---
import { formatDistanceToNow } from "date-fns";

const alertStyles = {
  Medical: {
    icon: <FaExclamationTriangle />,
    borderClass: "border-yellow-500",
    iconColorClass: "text-yellow-600",
  },
  Theft: {
    icon: <FaTimesCircle />,
    borderClass: "border-red-500",
    iconColorClass: "text-red-600",
  },
  default: {
    icon: <FaInfoCircle />,
    borderClass: "border-blue-500",
    iconColorClass: "text-blue-600",
  },
};

const SafetyAlertsPage = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoading(true);
        const response = await getAllReports();
        setAlerts(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching alerts:", err);
        setError("Could not load safety alerts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchAlerts();
  }, []);

  const filteredAlerts = alerts.filter(
    (alert) =>
      alert.emergencyType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.trainDetails.trainNumber
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 min-h-screen">
      <section className="text-white py-20 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-5xl font-bold tracking-tight">
            Safety Alerts & Advisories
          </h1>
          <p className="mt-4 text-xl text-blue-100">
            Stay informed with the latest official updates for your journey.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto py-3 px-4 pb-20">
        <div className="relative mb-12">
          <FaSearch className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-900" />
          <input
            type="text"
            placeholder="Search by keyword or train number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
          />
        </div>

        {loading && (
          <div className="text-center text-white py-12">
            <p className="text-xl">Loading live alerts...</p>
          </div>
        )}
        {error && (
          <div className="text-center text-red-300 py-12 bg-red-900 bg-opacity-50 rounded-lg">
            <p className="text-xl font-bold">An error occurred.</p>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="space-y-6">
            {filteredAlerts.length > 0 ? (
              filteredAlerts.map((alert) => {
                const style =
                  alertStyles[alert.emergencyType] || alertStyles.default;
                return (
                  <div
                    key={alert._id}
                    className={`bg-white border-l-4 ${style.borderClass} rounded-r-lg p-6 shadow-md`}
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`text-2xl ${style.iconColorClass}`}>
                        {style.icon}
                      </div>
                      <div className="flex-grow">
                        <h3 className="text-xl font-bold text-gray-800">
                          {alert.emergencyType} Emergency
                        </h3>
                        <p className="text-gray-600 mt-1">
                          {alert.description || "No description provided."}
                        </p>

                        {/* --- 2. THIS IS THE ONLY PART THAT CHANGED --- */}
                        <div className="text-sm text-gray-500 mt-4 flex justify-between flex-wrap gap-2">
                          <span>
                            Train/Route:{" "}
                            <strong>{alert.trainDetails.trainNumber}</strong>
                          </span>
                          <span>
                            Reported by:{" "}
                            <strong>{alert.passengerDetails.name}</strong>
                          </span>
                          <span>
                            Status: <strong>{alert.status}</strong>
                          </span>
                          {/* We now format the timestamp beautifully */}
                          <span>
                            {formatDistanceToNow(new Date(alert.timestamp), {
                              addSuffix: true,
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-700">
                  No active alerts at this time.
                </h3>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SafetyAlertsPage;
