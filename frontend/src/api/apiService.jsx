import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// access token stored in-memory; persisted optionally in localStorage
let accessToken = localStorage.getItem('accessToken') || null;

export const setAccessToken = (token) => {
  accessToken = token;
  try { localStorage.setItem('accessToken', token); } catch { /* ignore storage errors */ }
};

export const getAccessToken = () => accessToken;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // send httpOnly refresh cookie
});

// Request interceptor: attach access token
api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Response interceptor: try refresh on 401 once
let isRefreshing = false;
let refreshPromise = null;

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      // prevent infinite loop
      originalRequest._retry = true;
      if (!isRefreshing) {
        isRefreshing = true;
        refreshPromise = api.post('/auth/refresh-token')
          .then((r) => {
            const newAccess = r.data.accessToken;
            setAccessToken(newAccess);
            isRefreshing = false;
            return newAccess;
          })
          .catch((e) => {
            isRefreshing = false;
            throw e;
          });
      }
      try {
        const newAccess = await refreshPromise;
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return api(originalRequest);
      } catch (e) {
        // refresh failed
        return Promise.reject(e);
      }
    }
    return Promise.reject(error);
  }
);

export const createEmergencyReport = (reportData) => api.post('/reports', reportData);
export const getAllReports = () => api.get('/reports');
export const getReportById = (id) => api.get(`/reports/${id}`);
export const updateReportStatus = (id, newStatus) => api.put(`/reports/${id}`, { status: newStatus });
export const sendPassengerOtp = (passengerData) => api.post('/auth/register-passenger', passengerData);
export const verifyPassengerOtp = (otpData) => api.post('/auth/verify-otp', otpData);
export const logout = () => api.post('/auth/logout');

export default api;