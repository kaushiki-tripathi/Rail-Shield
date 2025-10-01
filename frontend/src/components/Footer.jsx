import React from "react";
import { FaTrainSubway } from "react-icons/fa6";
import { Link } from "react-router-dom";

const RailShieldIcon = () => (
  <div className="flex items-center justify-center bg-white rounded-full p-1 shadow-md">
    <FaTrainSubway className="h-7 w-7 text-teal-600" />
  </div>
);

function Footer({ navigate }) {
  return (
    <footer className="bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-600 shadow-lg text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Use flex so columns stay on one horizontal line on md+ */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10">
          {/* App Info & Logo */}
          <div className="space-y-4 md:w-1/4 min-w-0">
            <div className="flex items-center">
              <RailShieldIcon />
              <h3 className="ml-2 text-2xl font-bold tracking-wide">
                RailShield
              </h3>
            </div>
            <p className="text-teal-100">
              Protecting every journey. Your safety is our priority. Report
              emergencies, get real-time alerts, and travel with peace of mind.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4 md:w-1/4 min-w-0 ml-15">
            <h3 className="text-lg font-semibold tracking-wider">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/about"
                  className="cursor-pointer hover:text-white hover:font-bold transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="cursor-pointer hover:text-white hover:font-bold transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="cursor-pointer hover:text-white hover:font-bold transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Emergency Helplines */}
          <div className="space-y-4 md:w-1/4 min-w-0">
            <h3 className="text-lg font-semibold tracking-wider">
              Emergency Helplines
            </h3>
            <ul className="space-y-2">
              <li>
                Railway Police (RPF):{" "}
                <a href="tel:182" className="hover:text-white hover:font-bold">
                  182
                </a>
              </li>
              <li>
                Ambulance:{" "}
                <a href="tel:102" className="hover:text-white hover:font-bold">
                  102
                </a>
              </li>
              <li>
                Women Helpline:{" "}
                <a href="tel:1091" className="hover:text-white hover:font-bold">
                  1091
                </a>
              </li>
            </ul>
          </div>

          {/* Location & Contact */}
          <div className="space-y-4 md:w-1/4 min-w-0">
            <h3 className="text-lg font-semibold tracking-wider">Reach Us</h3>
            <p>📍 Kanpur, India</p>
            <p>📧 support@railshield.com</p>
          </div>
        </div>

        <div className="mt-10 border-t border-teal-500 pt-8 text-center text-teal-200">
          <p>
            &copy; {new Date().getFullYear()} RailShield. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
