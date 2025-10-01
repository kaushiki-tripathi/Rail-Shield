import React, { useState } from "react";
import {
  FaMobileAlt,
  FaEnvelope,
  FaLock,
  FaUserCircle,
  FaKey,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // Import useNavigate
// Import our new API functions
import { sendPassengerOtp, verifyPassengerOtp } from "../api/apiService";

const LoginPage = () => {
  const [view, setView] = useState("passenger");
  const [passengerStep, setPassengerStep] = useState("enterMobile");
  const [formData, setFormData] = useState({
    name: "",
    mobileNumber: "",
    otp: "",
    adminEmail: "",
    adminPassword: "",
  });
  
  const [mobileStatus, setMobileStatus] = useState('none');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate(); // Get the navigate function

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === 'mobileNumber') {
        const mobileRegex = /^\d{10}$/;
        if (mobileRegex.test(value)) {
            setMobileStatus('valid');
        } else if (value === '') {
            setMobileStatus('none');
        } else {
            setMobileStatus('invalid');
        }
    }
  };

  const handlePassengerSubmit = async (e) => {
    e.preventDefault();
    if (mobileStatus !== 'valid') {
        alert("Please enter a valid 10-digit mobile number.");
        return; 
    }
    setIsSubmitting(true);
    try {
        const passengerData = { name: formData.name, mobileNumber: formData.mobileNumber };
        const response = await sendPassengerOtp(passengerData);
        console.log(response.data.message);
        setPassengerStep("enterOtp");
    } catch (error) {
        console.error("Failed to send OTP:", error);
        const message = error.response?.data?.message || "An error occurred. Please try again.";
        alert(message);
    } finally {
        setIsSubmitting(false);
    }
  };

  // --- THIS IS THE ONLY FUNCTION THAT HAS CHANGED ---
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
        const otpData = {
            mobileNumber: formData.mobileNumber,
            otp: formData.otp,
        };
        // We call the verification API
        const response = await verifyPassengerOtp(otpData);
        
        // On success, the backend sends a token. We save it.
        const { token, user } = response.data;
        localStorage.setItem('token', token); // Save the "I-Card"
        localStorage.setItem('user', JSON.stringify(user));

        alert('Login Successful! Welcome, ' + user.name);
        // Redirect the user to the homepage after successful login
        navigate('/');

    } catch (error) {
        console.error("Failed to verify OTP:", error);
        const message = error.response?.data?.message || "An error occurred. Please try again.";
        alert(message);
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleAdminSubmit = (e) => {
    e.preventDefault();
    console.log(`Logging in admin ${formData.adminEmail}...`);
    alert('Admin login is a future step!');
  };
  
  const toggleView = () => {
    setView((prevView) => (prevView === "passenger" ? "admin" : "passenger"));
    setFormData({ name: "", mobileNumber: "", otp: "", adminEmail: "", adminPassword: "" });
    setPassengerStep("enterMobile");
    setMobileStatus('none');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white shadow-2xl rounded-2xl p-8">
          
          {view === "passenger" && (
            <div>
              {passengerStep === "enterMobile" ? (
                <>
                  <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Passenger Login</h1>
                    <p className="text-gray-500 mt-2">Enter your details to receive a secure OTP.</p>
                  </div>
                  <form onSubmit={handlePassengerSubmit} className="mt-8 space-y-6">
                    <div className="relative">
                      <FaUserCircle className="absolute top-3.5 left-4 text-gray-400" />
                      <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition"/>
                    </div>
                    <div className="relative">
                      <FaMobileAlt className="absolute top-3.5 left-4 text-gray-400" />
                      <input type="tel" name="mobileNumber" placeholder="10-Digit Mobile Number" value={formData.mobileNumber} onChange={handleChange} required maxLength="10" 
                        className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition" />
                      <div className="absolute top-3.5 right-4">
                        {mobileStatus === 'valid' && <FaCheckCircle className="text-green-500" />}
                        {mobileStatus === 'invalid' && <FaTimesCircle className="text-red-500" />}
                      </div>
                    </div>
                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 transition text-lg font-bold shadow-lg transform hover:scale-105 disabled:bg-gray-400 disabled:scale-100 cursor-pointer"
                    >
                      {isSubmitting ? 'Sending...' : 'Send OTP'}
                    </button>
                  </form>
                </>
              ) : (
                 <>
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-800">Verify OTP</h2>
                        <p className="text-gray-500 mt-2">An OTP has been sent to your console, {formData.mobileNumber}.</p>
                    </div>
                    <form onSubmit={handleOtpSubmit} className="mt-8 space-y-6">
                        <div className="relative">
                            <FaKey className="absolute top-3.5 left-4 text-gray-400" />
                            <input type="text" name="otp" placeholder="6-Digit OTP" value={formData.otp} onChange={handleChange} required maxLength="6" className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition"/>
                        </div>
                        <button 
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 transition text-lg font-bold shadow-lg transform hover:scale-105 disabled:bg-gray-400 disabled:scale-100 cursor-pointer"
                        >
                            {isSubmitting ? 'Verifying...' : 'Login'}
                        </button>
                    </form>
                    <button onClick={() => setPassengerStep('enterMobile')} className="text-center text-sm text-gray-600 mt-4 w-full hover:underline">Go Back</button>
                 </>
              )}
            </div>
          )}
          
          {/* Your Admin view is unchanged */}
          {view === "admin" && (
            <div>
                 <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Admin Login</h1>
                    <p className="text-gray-500 mt-2">Enter your credentials to access the dashboard.</p>
                </div>
                <form onSubmit={handleAdminSubmit} className="mt-8 space-y-6">
                    <div className="relative">
                        <FaEnvelope className="absolute top-3.5 left-4 text-gray-400" />
                        <input type="email" name="adminEmail" placeholder="Email Address" value={formData.adminEmail} onChange={handleChange} required className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition"/>
                    </div>
                    <div className="relative">
                        <FaLock className="absolute top-3.5 left-4 text-gray-400" />
                        <input type="password" name="adminPassword" placeholder="Password" value={formData.adminPassword} onChange={handleChange} required className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition"/>
                    </div>
                    <button type="submit" className="w-full bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 transition text-lg font-bold shadow-lg transform hover:scale-105 cursor-pointer">
                        Login to Dashboard
                    </button>
                </form>
            </div>
          )}
          
          <p className="text-center text-gray-600 mt-8">
            {view === "passenger" ? "Are you an Admin?" : "Not an Admin?"}
            <button
              onClick={toggleView}
              className="text-teal-600 font-semibold hover:underline ml-2 cursor-pointer"
            >
              {view === "passenger" ? "Login Here" : "Passenger Login"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;