import axios from "axios";

const API_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
});

export const registerPassenger = (passengerData) => {
  // This calls the fixed backend route to create the user account
  return axios.post("/api/auth/register", passengerData);
};

export const createEmergencyReport = (reportData) => {
  return api.post("/reports", reportData);
};

export const getAllReports = () => {
  return api.get("/reports");
};

export const getReportById = (id) => {
  return api.get(`/reports/${id}`);
};

export const updateReportStatus = (id, newStatus) => {
  return api.put(`/reports/${id}`, { status: newStatus });
};

export const sendPassengerOtp = (passengerData) => {
  return api.post("/auth/register", passengerData);
};

// --- THIS IS THE NEW FUNCTION WE ARE ADDING ---
// OTP ko verify karne ka function
export const verifyPassengerOtp = (otpData) => {
  // Yeh POST request /auth/verify-otp endpoint par jaayega
  return api.post("/auth/verify-otp", otpData);
};

export default api;
