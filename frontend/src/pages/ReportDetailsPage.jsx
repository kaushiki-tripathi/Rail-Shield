import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getReportById, updateReportStatus } from "../api/apiService";
import { format } from "date-fns";
import { FaCheck, FaExclamation } from 'react-icons/fa';

// Your InfoItem component is perfect and unchanged
const InfoItem = ({ label, value }) => (
  <div>
    <p className="text-sm font-medium text-gray-500">{label}</p>
    <p className="mt-1 text-lg text-gray-900">{value}</p>
  </div>
);

const ReportDetailsPage = () => {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // All your functions (fetchReport, useEffect for map, handleStatusUpdate) are perfect and unchanged.
  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const response = await getReportById(id);
        setReport(response.data);
      } catch (err) {
        setError("Failed to fetch report details.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [id]);

  useEffect(() => {
    if (report && report.location?.latitude) {
      let mapContainer = document.getElementById("reportMap");
      if (mapContainer && mapContainer._leaflet_id) {
        mapContainer._leaflet_id = null;
      }
      const map = L.map("reportMap").setView(
        [report.location.latitude, report.location.longitude],
        16
      );
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
      L.marker([report.location.latitude, report.location.longitude])
        .addTo(map)
        .bindPopup("Passenger Location")
        .openPopup();
    }
  }, [report]);

  const handleStatusUpdate = async (newStatus) => {
    if (!confirm(`Are you sure you want to mark this report as "${newStatus}"?`)) {
        return;
    }
    try {
        const updatedReport = await updateReportStatus(id, newStatus);
        setReport(updatedReport.data);
        alert(`Report status successfully updated to "${newStatus}"!`);
    } catch (err) {
        console.error("Failed to update status:", err);
        alert("There was an error updating the status. Please try again.");
    }
  };

  if (loading)
    return <div className="p-8 text-center">Loading report details...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;
  if (!report) return <div className="p-8 text-center">Report not found.</div>;

  return (
    // Your beautiful gradient background is preserved
    <div className="min-h-screen bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900">
      <header className="shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <Link to="/admin" className="text-teal-300 hover:underline mb-4 inline-block">
            &larr; Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold text-gray-100">
            Emergency Report Details
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* --- THIS IS THE ONLY SECTION THAT HAS CHANGED --- */}
        {/* Left Column now includes the Action Panel */}
        <div className="lg:col-span-2 bg-white shadow-xl rounded-lg p-8">
          <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 border-b pb-4">
                Incident Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <InfoItem label="Emergency Type" value={report.emergencyType} />
                <InfoItem label="Status" value={report.status} />
                <InfoItem label="Reported At" value={format(new Date(report.timestamp), "PPP p")} />
                <InfoItem label="PNR Number" value={report.trainDetails.pnr} />
                <InfoItem label="Train Number" value={report.trainDetails.trainNumber} />
                <InfoItem label="Coach" value={report.trainDetails.coach} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Description</p>
                <p className="mt-1 text-lg text-gray-900 font-bold bg-gray-50 p-4 rounded-md">
                  {report.description || "No description provided."}
                </p>
              </div>
          </div>
          
          {/* The Action Panel has been moved here, with a separator */}
          <div className="border-t mt-8 pt-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Take Action</h3>
            <div className="space-y-4">
              {report.status === 'Pending' && (
                <button 
                  onClick={() => handleStatusUpdate('Acknowledged')}
                  className="w-full flex items-center justify-center gap-2 bg-teal-600 text-white font-bold py-3 rounded-lg hover:bg-blue-600 transition cursor-pointer"
                >
                  <FaExclamation />
                  <span>Acknowledge Report</span>
                </button>
              )}
              {report.status !== 'Resolved' && (
                <button 
                  onClick={() => handleStatusUpdate('Resolved')}
                  className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white font-bold py-3 rounded-lg hover:bg-green-800 transition cursor-pointer"
                >
                  <FaCheck />
                  <span>Mark as Resolved</span>
                </button>
              )}
              {report.status === 'Resolved' && (
                <p className="text-center text-gray-600">This incident has been resolved.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column is now shorter and cleaner */}
        <div className="space-y-8">
          <div className="bg-white shadow-xl rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 border-b pb-4 mb-4">
              Passenger Details
            </h2>
            <div className="space-y-4">
              <InfoItem label="Name" value={report.passengerDetails.name} />
              <InfoItem label="Contact Number" value={report.passengerDetails.contactNumber} />
            </div>
          </div>
          <div className="bg-white shadow-xl rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 border-b pb-4 mb-4">
              Live Location
            </h2>
            <div id="reportMap" className="h-64 w-full rounded-md border"></div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReportDetailsPage;