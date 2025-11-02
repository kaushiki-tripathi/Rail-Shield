import { React, useState, useEffect } from "react";
import axios from "axios";
import { FaTrainSubway } from "react-icons/fa6";
import { FaUserShield, FaExclamationTriangle, FaDesktop } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

// The SosButton component now correctly accepts an `onClick` prop
const SosButton = ({ onClick }) => {
  return (
    <div className="fixed bottom-8 right-8 z-50">
      <button
        className="bg-red-600 hover:bg-red-700 text-white font-bold py-6 px-6 rounded-full shadow-lg transition-transform transform hover:scale-110 active:scale-95 animate-pulse-slow cursor-pointer"
        onClick={onClick}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
};

// All other components (FeatureCard, StepCard) remain unchanged
const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transform hover:-translate-y-5 transition-all duration-300 cursor-pointer">
    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-teal-100 text-teal-700 mb-5">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const StepCard = ({ number, title, description }) => (
  <div className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-xl transform hover:-translate-y-5 transition-all duration-300 cursor-pointer">
    <div className="flex items-center justify-center h-16 w-16 mx-auto mb-4 rounded-full bg-emerald-100 text-emerald-800 font-bold text-2xl shadow-inner">
      {number}
    </div>
    <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
    <p className="text-gray-500 mt-1">{description}</p>
  </div>
);

// The main HomePage component now contains all the necessary logic
function HomePage() {
  const [trainPositions, setTrainPositions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const icons = Array.from({ length: 160 }).map(() => ({
      top: `${Math.random() * 200}%`,
      left: `${Math.random() * 100}%`,
      size: 20 + Math.random() * 20,
      rotate: Math.random() * 360,
    }));
    setTrainPositions(icons);
  }, []);

  // --- The `handleSosClick` logic is correctly defined here ---
  const handleSosClick = async () => {
    // ----------------------------------------------------
    // START OF AUTHENTICATION LOGIC (NEW CODE)
    // ----------------------------------------------------
    let passengerId = null;
    let passengerName = "Anonymous";
    let passengerContact = "0000000000";

    const userStorage = localStorage.getItem("user");
    if (userStorage) {
      try {
        const user = JSON.parse(userStorage);
        // Retrieving the user's ID, Name, and Mobile Number from local storage
        passengerId = user.id || user._id; // Use ID to link to the user record
        passengerName = user.name || "Logged-in User";
        passengerContact = user.mobileNumber || "Contact Unavailable";
      } catch (e) {
        console.error("Error parsing user data from local storage", e);
      }
    }

    if (!passengerId) {
      // If no user is logged in, alert and redirect them to login first
      alert("Please log in or register to send an authenticated SOS alert.");
      navigate("/login");
      return;
    }

    const passengerDetails = {
      name: passengerName,
      contactNumber: passengerContact,
    };
    // ----------------------------------------------------
    // END OF AUTHENTICATION LOGIC
    // ----------------------------------------------------

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            // Send the data to our backend API with the now authenticated details
            const response = await axios.post(
              "http://localhost:5000/api/reports",
              {
                emergencyType: "SOS_ALERT",
                location: {
                  latitude,
                  longitude,
                },
                trainDetails: { pnr: "N/A", trainNumber: "N/A", coach: "N/A" },
                description: "SOS button pressed by passenger.", // --- UPDATE THE PAYLOAD WITH AUTHENTICATED DATA ---
                passenger: passengerId, // This links the report to the User document
                passengerDetails: passengerDetails, // This puts the name/contact right on the report
              }
            );
            console.log("SOS alert sent successfully:", response.data);
            navigate("/status");
          } catch (error) {
            console.error("Error sending SOS alert:", error);
            alert(
              "Failed to send alert. Please try again or call emergency contacts."
            );
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          alert(
            "Unable to get your location. Please check your browser settings."
          );
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none opacity-15">
        {trainPositions.map((icon, i) => (
          <FaTrainSubway
            key={i}
            className="text-white"
            style={{
              fontSize: `${icon.size}px`,
              position: "absolute",
              top: icon.top,
              left: icon.left,
              transform: `rotate(${icon.rotate}deg)`,
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <section className="h-[70vh] md:h-[80vh] flex items-center justify-center text-white overflow-hidden relative">
        {/* Hero Content */}
        <div className="text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight drop-shadow-2xl">
            Every stop, every mile,
            <br /> we protect you all the while.
          </h1>
          <p className="mt-8 text-lg md:text-xl text-gray-200 max-w-3xl mx-auto">
            Travel with confidence on Indian Railways. RailShield provides a
            direct line to immediate assistance, anytime, anywhere.
          </p>
          <button
            onClick={() => navigate("/report")}
            className="mt-15 bg-white text-teal-700 font-bold py-3 px-10 rounded text-lg hover:bg-emerald-100 transition-all duration-300 shadow-lg transform hover:scale-110 cursor-pointer"
          >
            Report an Emergency
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white tracking-tight mb-8 text-center">
            Features
          </h2>
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<FaUserShield size={30} />}
              title="Passenger SOS"
              description="Instantly report medical emergencies, theft, harassment, or any other issue with a single click."
            />
            <FeatureCard
              icon={<FaExclamationTriangle size={30} />}
              title="Accident Alerts"
              description="Receive real-time alerts from railway control about accidents, delays, or potential hazards on your route."
            />
            <FeatureCard
              icon={<FaDesktop size={30} />}
              title="Real-time Monitoring"
              description="Our admin dashboard allows staff to monitor and respond to incidents in real-time for efficient coordination."
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white tracking-tight mb-8">
            How It Works
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            <StepCard
              number="1"
              title="Activate System"
              description="Enter your PNR before you travel to enable the service."
            />
            <StepCard
              number="2"
              title="Press SOS Button"
              description="Click the emergency button and select the type of incident."
            />
            <StepCard
              number="3"
              title="Get Help Fast"
              description="Nearest authorities are alerted with your live location."
            />
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="py-20 relative z-10 text-white text-center">
        <h2 className="text-3xl font-bold mb-6">Your Safety is Our Priority</h2>
        <p className="mb-8 text-lg max-w-2xl mx-auto">
          Don't wait until it's too late. Report an incident and get immediate
          assistance.
        </p>
        <button
          onClick={() => navigate("/report")}
          className="bg-white text-teal-700 font-bold py-3 px-12 rounded text-lg hover:bg-emerald-100 transition-all duration-300 shadow-lg transform hover:scale-105 cursor-pointer"
        >
          Report an Emergency
        </button>
      </section>

      {/* --- Pass the `handleSosClick` function to the SosButton component --- */}
      <SosButton onClick={handleSosClick} />
    </div>
  );
}

export default HomePage;
