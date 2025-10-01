import React, { useState, useEffect } from "react";
import {
  FaHeartbeat,
  FaUserSecret,
  FaFemale,
  FaFireExtinguisher,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { createEmergencyReport } from "../api/apiService";

const emergencyTypes = [
  { name: "Medical", icon: <FaHeartbeat /> },
  { name: "Theft", icon: <FaUserSecret /> },
  { name: "Harassment/Assault", icon: <FaFemale /> },
  { name: "Fire/Safety Hazard", icon: <FaFireExtinguisher /> },
];

const Report = () => {
  const [formData, setFormData] = useState({
    emergencyType: "",
    name: "",
    contactNumber: "",
    pnr: "",
    trainNumber: "",
    coachNumber: "",
    description: "",
    latitude: "",
    longitude: "",
  });

  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [locationAddress, setLocationAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleTypeClick = (type) => {
    setFormData((prevData) => ({
      ...prevData,
      emergencyType: type,
    }));
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setIsFetchingLocation(true);
    setLocationAddress("");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setFormData((prevData) => ({ ...prevData, latitude, longitude }));
        fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
        )
          .then((res) => res.json())
          .then((data) => {
            setLocationAddress(data?.display_name || "Address not found.");
            setIsFetchingLocation(false);
          })
          .catch(() => {
            setLocationAddress("Could not fetch address.");
            setIsFetchingLocation(false);
          });
      },
      (error) => {
        setIsFetchingLocation(false);
        alert(
          "Could not get your location. Please ensure you have given permission."
        );
      }
    );
  };

  // --- THIS IS THE ONLY FUNCTION THAT HAS CHANGED ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.emergencyType) {
      alert("Please select the type of emergency.");
      return;
    }

    setIsSubmitting(true);

    // We now format the data to perfectly match our backend's blueprint
    const reportDataForBackend = {
      emergencyType: formData.emergencyType,
      location: {
        latitude: formData.latitude,
        longitude: formData.longitude,
      },
      trainDetails: {
        pnr: formData.pnr,
        trainNumber: formData.trainNumber,
        coach: formData.coachNumber,
      },
      description: formData.description,
      passengerDetails: {
        name: formData.name,
        contactNumber: formData.contactNumber,
      },
    };

    try {
      await createEmergencyReport(reportDataForBackend);
      alert("Your report has been successfully sent to the authorities!");
      setFormData({
        emergencyType: "",
        name: "",
        contactNumber: "",
        pnr: "",
        trainNumber: "",
        coachNumber: "",
        description: "",
        latitude: "",
        longitude: "",
      });
      setLocationAddress("");
    } catch (error) {
      console.error("Failed to submit report:", error);
      alert("There was an error submitting your report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (formData.latitude && formData.longitude) {
      let mapContainer = document.getElementById("map");
      if (mapContainer && mapContainer._leaflet_id) {
        mapContainer._leaflet_id = null;
      }
      var map = L.map("map").setView(
        [formData.latitude, formData.longitude],
        16
      );
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(
        map
      );
      L.marker([formData.latitude, formData.longitude]).addTo(map);
    }
  }, [formData.latitude, formData.longitude]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-white tracking-tight py-3">
            Report an Emergency
          </h1>
          <p className="mt-4 text-lg text-gray-100">
            Your report will be sent directly to the nearest Railway Protection
            Force (RPF) and control room.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-10 bg-white shadow-2xl rounded-2xl p-8 space-y-8"
        >
          <div>
            <label className="block text-lg font-semibold text-gray-800 mb-4">
              1. What is the emergency?
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {emergencyTypes.map((type) => (
                <button
                  key={type.name}
                  type="button"
                  onClick={() => handleTypeClick(type.name)}
                  className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all duration-200 transform hover:-translate-y-1 ${
                    formData.emergencyType === type.name
                      ? "bg-red-100 border-red-500 ring-2 ring-red-300"
                      : "bg-gray-50 border-gray-200 hover:border-red-400"
                  }`}
                >
                  <span className="text-3xl text-red-600">{type.icon}</span>
                  <p className="font-semibold text-gray-800 text-center mt-2 text-sm">
                    {type.name}
                  </p>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-lg font-semibold text-gray-800 mb-4">
              2. Who are you?
            </label>
            <div className="space-y-4">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Full Name"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
              />
              <input
                type="tel"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                placeholder="Your 10-Digit Contact Number"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
              />
            </div>
          </div>
          <div>
            <label className="block text-lg font-semibold text-gray-800 mb-4">
              3. Where are you?
            </label>
            <div className="space-y-4">
              <input
                type="text"
                name="pnr"
                value={formData.pnr}
                onChange={handleChange}
                placeholder="10-Digit PNR Number"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
              />
              <input
                type="text"
                name="trainNumber"
                value={formData.trainNumber}
                onChange={handleChange}
                placeholder="Train Number (e.g., 12451)"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
              />
              <input
                type="text"
                name="coachNumber"
                value={formData.coachNumber}
                onChange={handleChange}
                placeholder="Coach Number (e.g., S5)"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
              />
              <button
                type="button"
                onClick={handleGetLocation}
                disabled={isFetchingLocation}
                className="w-full flex items-center justify-center gap-2 bg-teal-700 hover:bg-teal-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-300 transform hover:scale-105 cursor-pointer disabled:bg-gray-400"
              >
                <FaMapMarkerAlt />
                {isFetchingLocation
                  ? "Fetching Location..."
                  : "Get My Current Location"}
              </button>
              {formData.latitude && (
                <div className="bg-gray-100 p-4 rounded-lg border relative isolate">
                  <p className="font-semibold text-gray-800">
                    Location Acquired:
                  </p>
                  <p className="text-gray-600 text-sm mt-1">
                    {locationAddress || "Loading address..."}
                  </p>
                  <div
                    id="map"
                    className="mt-2 h-48 w-full rounded-md border"
                  ></div>
                </div>
              )}
            </div>
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-lg font-semibold text-gray-800 mb-2"
            >
              4. Describe the emergency
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide any additional details (optional)..."
              rows="4"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              // The button is now disabled if we are submitting OR if there is no latitude
              disabled={!formData.latitude || isSubmitting}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-semibold text-white bg-teal-700 hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition duration-300 transform hover:scale-105 cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "ALERT AUTHORITIES NOW"}
            </button>

            {/* This helpful message shows up only when the location is missing */}
            {!formData.latitude && (
              <p className="text-center text-sm text-gray-500 mt-2">
                Please click "Get My Current Location" to enable the submit
                button.
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Report;
