import React, { useState, useEffect } from "react";
import {
  FaMobileAlt,
  FaEnvelope,
  FaLock,
  FaUserCircle,
  FaKey,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  sendPassengerOtp,
  verifyPassengerOtp,
  registerPassenger,
} from "../api/apiService"; // Assuming apiService exports these

// --- Helper component for the segmented control ---
const AuthSegmentedControl = ({ view, setView }) => {
  const activeClass = "bg-white text-teal-700 shadow-md";
  const inactiveClass = "bg-transparent text-gray-500 hover:text-gray-800";

  return (
    <div className="flex w-full bg-gray-100 rounded-lg p-1 mb-8">
      <button
        className={`flex-1 py-2 text-lg font-bold rounded-lg transition-colors ${
          view === "login" ? activeClass : inactiveClass
        }`}
        onClick={() => setView("login")}
      >
        Login
      </button>
      <button
        className={`flex-1 py-2 text-lg font-bold rounded-lg transition-colors ${
          view === "register" ? activeClass : inactiveClass
        }`}
        onClick={() => setView("register")}
      >
        Register
      </button>
    </div>
  );
};

// --- Main AuthFlow Component ---
const AuthFlow = ({ defaultView = "login" }) => {
  // Takes defaultView prop from router
  const [view, setView] = useState(defaultView); // 'login' | 'register' | 'admin'
  const [passengerStep, setPassengerStep] = useState("enterMobile"); // 'enterMobile' | 'enterOtp'
  const [formData, setFormData] = useState({
    name: "",
    mobileNumber: "",
    otp: "",
    adminEmail: "",
    adminPassword: "",
  });

  const [mobileStatus, setMobileStatus] = useState("none");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Keep component view in sync if parent changes defaultView
  useEffect(() => {
    setView(defaultView);
  }, [defaultView]);

  // Ensure a clean state on mount
  useEffect(() => {
    localStorage.removeItem("token");
    console.log("Token cleared on AuthFlow mount for clean login attempt.");
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "mobileNumber") {
      // keep digits only and limit to 10 chars
      const digits = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({ ...prev, [name]: digits }));

      if (digits.length === 10) {
        setMobileStatus("valid");
      } else if (digits === "") {
        setMobileStatus("none");
      } else {
        setMobileStatus("invalid");
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // New logic for the Register submit button
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (mobileStatus !== "valid") {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await registerPassenger({
        name: formData.name,
        mobileNumber: formData.mobileNumber,
      });

      console.log("Registration successful:", response.data);
      alert("Registration successful! Now send OTP to login.");

      // On successful registration, switch to the login view and reset step
      setView("login");
      setPassengerStep("enterMobile");
      setFormData((prev) => ({ ...prev, otp: "" }));
    } catch (error) {
      console.error(
        "Registration failed:",
        error.response?.data?.message || error.message || error
      );
      alert(
        error.response?.data?.message ||
          "Registration failed. Please check your network or contact support."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Logic for Login (Send OTP)
  const handleLoginSendOtp = async (e) => {
    e.preventDefault();
    if (mobileStatus !== "valid") {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }
    setIsSubmitting(true);
    try {
      const passengerData = {
        name: formData.name,
        mobileNumber: formData.mobileNumber,
      };
      const response = await sendPassengerOtp(passengerData);
      console.log(response.data?.message || "OTP sent");
      setPassengerStep("enterOtp");
    } catch (error) {
      console.error("Failed to send OTP:", error);
      const message =
        error.response?.data?.message || error.message || "An error occurred. Please try again.";
      alert(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Logic for OTP verification
  const handleOtpSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  try {
    const otpData = {
      mobileNumber: formData.mobileNumber,
      otp: formData.otp,
    };
    const response = await verifyPassengerOtp(otpData);

    const { token, user } = response.data;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    // window.dispatchEvent(new Event("authChange")); // This line is no longer necessary
    alert("Login Successful! Welcome, " + user.name);
    
    // --- THIS IS THE FIX ---
    // This forces a full page reload, so the Navbar and
    // ProtectedRoutes will see the new token.
    window.location.href = "/"; 

  } catch (error) {
    console.error("Failed to verify OTP:", error);
    const message =
      error.response?.data?.message || "Invalid or expired OTP.";
    alert(message);
  } finally {
    setIsSubmitting(false);
  }
};

  const handleAdminSubmit = (e) => {
    e.preventDefault();
    alert("Admin login is a future step!");
  };

  // Admin/Passenger view toggle
  const toggleRoleView = () => {
    setView((prevView) => (prevView === "admin" ? "login" : "admin"));
    setFormData({
      name: "",
      mobileNumber: "",
      otp: "",
      adminEmail: "",
      adminPassword: "",
    });
    setPassengerStep("enterMobile");
    setMobileStatus("none");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white shadow-2xl rounded-2xl p-8">
          {/* The unified segmented control sits at the top */}
          {view !== "admin" && (
            <AuthSegmentedControl view={view} setView={setView} />
          )}

          {/* Passenger Registration View */}
          {view === "register" && (
            <div>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">
                  Passenger Registration
                </h1>
                <p className="text-gray-500 mt-2">
                  Create your account for secure, immediate assistance.
                </p>
              </div>
              <form onSubmit={handleRegisterSubmit} className="mt-8 space-y-6">
                {/* Name Input */}
                <div className="relative">
                  <FaUserCircle className="absolute top-3.5 left-4 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                  />
                </div>
                {/* Mobile Input */}
                <div className="relative">
                  <FaMobileAlt className="absolute top-3.5 left-4 text-gray-400" />
                  <input
                    type="tel"
                    name="mobileNumber"
                    placeholder="10-Digit Mobile Number"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    required
                    maxLength={10}
                    className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                  />
                  <div className="absolute top-3.5 right-4">
                    {mobileStatus === "valid" && (
                      <FaCheckCircle className="text-green-500" />
                    )}
                    {mobileStatus === "invalid" && (
                      <FaTimesCircle className="text-red-500" />
                    )}
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 transition text-lg font-bold shadow-lg transform hover:scale-105 disabled:bg-gray-400 disabled:scale-100 cursor-pointer"
                >
                  {isSubmitting ? "Registering..." : "Register Account"}
                </button>
              </form>
            </div>
          )}

          {/* Passenger Login View */}
          {view === "login" && (
            <div>
              {passengerStep === "enterMobile" ? (
                <>
                  <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">
                      Passenger Login
                    </h1>
                    <p className="text-gray-500 mt-2">
                      Enter your details to receive a secure OTP.
                    </p>
                  </div>
                  <form
                    onSubmit={handleLoginSendOtp}
                    className="mt-8 space-y-6"
                  >
                    {/* Name Input */}
                    <div className="relative">
                      <FaUserCircle className="absolute top-3.5 left-4 text-gray-400" />
                      <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                      />
                    </div>
                    {/* Mobile Input */}
                    <div className="relative">
                      <FaMobileAlt className="absolute top-3.5 left-4 text-gray-400" />
                      <input
                        type="tel"
                        name="mobileNumber"
                        placeholder="10-Digit Mobile Number"
                        value={formData.mobileNumber}
                        onChange={handleChange}
                        required
                        maxLength={10}
                        className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                      />
                      <div className="absolute top-3.5 right-4">
                        {mobileStatus === "valid" && (
                          <FaCheckCircle className="text-green-500" />
                        )}
                        {mobileStatus === "invalid" && (
                          <FaTimesCircle className="text-red-500" />
                        )}
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 transition text-lg font-bold shadow-lg transform hover:scale-105 disabled:bg-gray-400 disabled:scale-100 cursor-pointer"
                    >
                      {isSubmitting ? "Sending..." : "Send OTP"}
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800">
                      Verify OTP
                    </h2>
                    <p className="text-gray-500 mt-2">
                      An OTP has been sent to your console, {formData.mobileNumber}.
                    </p>
                  </div>
                  <form onSubmit={handleOtpSubmit} className="mt-8 space-y-6">
                    <div className="relative">
                      <FaKey className="absolute top-3.5 left-4 text-gray-400" />
                      <input
                        type="text"
                        name="otp"
                        placeholder="6-Digit OTP"
                        value={formData.otp}
                        onChange={handleChange}
                        required
                        maxLength={6}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 transition text-lg font-bold shadow-lg transform hover:scale-105 disabled:bg-gray-400 disabled:scale-100 cursor-pointer"
                    >
                      {isSubmitting ? "Verifying..." : "Login"}
                    </button>
                  </form>
                  <button
                    onClick={() => setPassengerStep("enterMobile")}
                    className="text-center text-sm text-gray-600 mt-4 w-full hover:underline"
                  >
                    Go Back
                  </button>
                </>
              )}
            </div>
          )}

          {/* Admin View */}
          {view === "admin" && (
            <div>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Admin Login</h1>
                <p className="text-gray-500 mt-2">Enter your authority credentials.</p>
              </div>
              <form onSubmit={handleAdminSubmit} className="mt-8 space-y-6">
                <div className="relative">
                  <FaEnvelope className="absolute top-3.5 left-4 text-gray-400" />
                  <input
                    type="email"
                    name="adminEmail"
                    placeholder="Admin Email"
                    value={formData.adminEmail}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                  />
                </div>
                <div className="relative">
                  <FaLock className="absolute top-3.5 left-4 text-gray-400" />
                  <input
                    type="password"
                    name="adminPassword"
                    placeholder="Password"
                    value={formData.adminPassword}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 transition text-lg font-bold shadow-lg transform hover:scale-105 disabled:bg-gray-400 disabled:scale-100 cursor-pointer"
                >
                  {isSubmitting ? "Logging in..." : "Login"}
                </button>
              </form>
            </div>
          )}

          {/* Role toggle button remains at the bottom */}
          <p className="text-center text-gray-600 mt-8">
            {view === "admin" ? "Not an Admin?" : "Are you an Admin?"}
            <button
              onClick={toggleRoleView}
              className="text-teal-600 font-semibold hover:underline ml-2 cursor-pointer"
            >
              {view === "admin" ? "Passenger Login" : "Login Here"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthFlow;