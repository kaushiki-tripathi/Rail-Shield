import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { FaChevronDown, FaSignOutAlt, FaUser } from "react-icons/fa";

const AuthStatus = () => {
  const [userName, setUserName] = useState(null);
  const [userMobile, setUserMobile] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const location = useLocation();

  // Function to check local storage for user data
  const checkAuthStatus = () => {
    // --- THIS IS THE FIX ---
    // Check for BOTH the token and the user
    const token = localStorage.getItem("token");
    const userStorage = localStorage.getItem("user");

    if (token && userStorage) { // <-- NOW CHECKS FOR BOTH
      try {
        const user = JSON.parse(userStorage);
        setUserName(user.name ? user.name.split(" ")[0] : "User");
        setUserMobile(user.mobileNumber);
      } catch (e) {
        console.error("Error parsing user data:", e);
        // If data is bad, clear everything
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUserName(null);
        setUserMobile(null);
      }
    } else {
      // If either is missing, user is not logged in
      setUserName(null);
      setUserMobile(null);
    }
  };

  const handleLogout = () => {
    // Clear all session data
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUserName(null);
    setUserMobile(null);
    setIsDropdownOpen(false);
    alert("Logged out successfully.");
    navigate("/login");
  };

  // Effect to handle initial check and closing the dropdown when clicking outside
  useEffect(() => {
    checkAuthStatus();
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (userName) {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          className="flex items-center space-x-2 py-1.5 px-3 rounded-full bg-teal-600 hover:bg-teal-700 transition focus:outline-none shadow-md"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          {/* Compact Profile Indicator (Initial) */}
          <div className="h-7 w-7 rounded-full bg-white flex items-center justify-center text-teal-600 font-bold text-sm">
            {userName.charAt(0).toUpperCase()}
          </div>

          {/* User Name and Dropdown Arrow */}
          <span className="text-white text-md font-semibold hidden md:inline">
            {userName}
          </span>
          <FaChevronDown
            className={`text-white text-xs transition-transform ${
              isDropdownOpen ? "transform rotate-180" : ""
            }`}
          />
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl z-50 overflow-hidden border border-gray-200">
            {/* User Header */}
            <div className="p-4 flex items-center space-x-3 border-b border-gray-100 bg-gray-50">
              <FaUser className="text-teal-600 text-3xl" />
              <div>
                <p className="text-sm font-bold text-gray-800">{userName}</p>
                <p className="text-xs text-gray-500 mt-0.5">{userMobile}</p>
              </div>
            </div>

            {/* Menu Actions */}
            <div className="p-2">
              {/* Log out Button */}
              <button
                onClick={handleLogout}
                className="w-full text-left flex items-center space-x-3 p-2 rounded-md text-gray-700 hover:bg-red-100 hover:text-red-600 transition cursor-pointer"
              >
                <FaSignOutAlt className="text-lg" />
                <span className="font-medium">Log out</span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  } else {
    // --- Logged-Out Link (Matching the profile style) ---
    return (
      <Link
        to={location.pathname.includes("/register") ? "/register" : "/login"}
        className="flex items-center space-x-2 py-1.5 px-3 rounded-full bg-white hover:bg-gray-100 transition focus:outline-none shadow-md"
      >
        {/* Profile Initial/Picture placeholder */}
        <div className="h-7 w-7 rounded-full bg-teal-600 flex items-center justify-center text-white font-bold text-sm">
          <FaUser className="h-4 w-4" />
        </div>

        {/* Text changes based on current route */}
        <span className="text-teal-700 text-md font-semibold">
          {location.pathname.includes("/register") ? "Register" : "Login"}
        </span>
      </Link>
    );
  }
};

export default AuthStatus;
