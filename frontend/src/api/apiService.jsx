import axios from 'axios';

// Backend ka port 3000 hai
const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

export const createEmergencyReport = (reportData) => {
  return api.post('/reports', reportData);
};

export const getAllReports = () => {
  return api.get('/reports');
}

export const getReportById = (id) => {
  return api.get(`/reports/${id}`);
};

export const updateReportStatus = (id, newStatus) => {
  return api.put(`/reports/${id}`, { status: newStatus });
};

export const sendPassengerOtp = (passengerData) => {
  return api.post('/auth/register-passenger', passengerData);
};

// --- THIS IS THE NEW FUNCTION WE ARE ADDING ---
// OTP ko verify karne ka function
export const verifyPassengerOtp = (otpData) => {
  // Yeh POST request /auth/verify-otp endpoint par jaayega
  return api.post('/auth/verify-otp', otpData);
};


export default api;