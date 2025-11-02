import React, { useState } from "react";
import AuthStatus from "./AuthStatus";
import { FaTrainSubway } from "react-icons/fa6";
// --- 1. We import both Link and useNavigate to handle all cases ---
import { Link, useNavigate } from 'react-router-dom';
import { logout as apiLogout } from '../api/apiService';
import { useContext } from 'react';
import AuthContext from '../contexts/AuthContext';

// Your custom icons are unchanged
const RailShieldIcon = () => (
  <div className="flex items-center justify-center bg-white rounded-full p-1 shadow-md">
    <FaTrainSubway className="h-7 w-7 text-teal-600" />
  </div>
);
const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);
const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

// --- 2. The old 'navigate' prop is removed ---
function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  // --- 3. We get the official navigate function from the router ---
  const navigate = useNavigate();

  // --- 4. We create one function to handle all mobile clicks ---
  const handleMobileLinkClick = (path) => {
      navigate(path); // Navigate to the new page
      setIsOpen(false); // Close the menu
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Safety Alerts", path: "/alerts" },
    { name: "Emergency Contacts", path: "/contacts" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const { user, logout } = useContext(AuthContext);

  const handleLogout = async () => {
    try { await apiLogout(); } catch { /* ignore network errors */ }
    logout();
    navigate('/');
  };

  return (
    // Your beautiful navbar styling is unchanged
    <nav className="bg-gradient-to-r from-emerald-900 via-teal-600 to-teal-900 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm-px-6 lg-px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo link is now a simple Link */}
          <Link to="/" className="flex items-center cursor-pointer ml-2 sm:ml-4" onClick={() => setIsOpen(false)}>
            <RailShieldIcon />
            <span className="ml-2 text-2xl font-bold text-white tracking-wide drop-shadow-md">
              RailShield
            </span>
          </Link>

          {/* Desktop Menu uses pure Link components */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path} // Use the 'to' prop for navigation
                className="relative text-white font-medium cursor-pointer group"
              >
                {link.name}
                <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-emerald-300 transition-all group-hover:w-full"></span>
              </Link>
            ))}
<<<<<<< HEAD
            
            <AuthStatus/>
=======
            {user ? (
              <div className="flex items-center gap-3">
                {user.role === 'Admin' && (
                  <Link to="/admin" className="text-white font-medium">Dashboard</Link>
                )}
                <span className="text-white">{user.name}</span>
                <button onClick={handleLogout} className="bg-white text-teal-700 px-3 py-1.5 rounded text-m font-bold shadow-md hover:bg-emerald-200 transition cursor-pointer">Logout</button>
              </div>
            ) : (
              <Link to="/login">
                <button
                  className="bg-white text-teal-700 px-3 py-1.5 rounded text-m font-bold shadow-md hover:bg-emerald-200 transition cursor-pointer"
                >
                  Login/Signup
                </button>
              </Link>
            )}
>>>>>>> 188d3d2d8d57a93019249947f2e85128711d1307
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-teal-500 focus:outline-none"
            >
              {isOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </div>

      {/* --- 5. Mobile Menu now uses our new handler function to work correctly --- */}
      <div className={`md:hidden bg-white shadow-md transition-all duration-300 ease-in-out ${isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0 overflow-hidden"}`}>
        <div className="px-4 pt-3 pb-4 space-y-2">
          {navLinks.map((link) => (
            // The spans are now buttons that call our new function
            <button
              key={link.name}
              onClick={() => handleMobileLinkClick(link.path)}
              className="block w-full text-left text-gray-900 hover:text-emerald-500 font-medium cursor-pointer"
            >
              {link.name}
            </button>
          ))}
          <button
            onClick={() => handleMobileLinkClick("/login")}
            className="w-full bg-teal-600 text-white mt-3 px-3 py-2 rounded-md font-medium hover:bg-emerald-600 transition cursor-pointer"
          >
            Login / Signup
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;