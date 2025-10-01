import React from 'react';
import { FaLaptopCode, FaBullseye, FaUsers } from 'react-icons/fa';

// A reusable card component for this page
const InfoCard = ({ icon, title, children }) => (
    <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transform hover:-translate-y-5 transition-all duration-300 cursor-pointer">
        <div className="flex items-center mb-4">
            <div className="text-3xl text-teal-600 mr-4">{icon}</div>
            <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
        </div>
        <div className="text-gray-600 leading-relaxed space-y-4">
            {children}
        </div>
    </div>
);

function AboutPage() {
  return (
    <div className=" bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900">
      {/* Page Header Banner */}
      <section className=" bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white py-20 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-5xl font-bold tracking-tight">Our Mission</h1>
          <p className="mt-4 text-xl text-teal-100">
            To build a safer, more secure travel experience for every railway passenger in India.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto py-10 px-4 space-y-15">
        
        {/* Our Purpose Section */}
        <InfoCard icon={<FaBullseye />} title="Our Purpose">
            <p>
                Indian Railways is the lifeline of the nation, but passenger safety during emergencies remains a critical challenge. Delayed responses, lack of communication channels, and the sheer scale of the network can turn a manageable situation into a crisis.
            </p>
            <p>
                <strong>RailShield was born from a simple idea:</strong> no passenger should ever feel helpless. We aim to bridge the communication gap between passengers in distress and the authorities who can help, using technology to deliver a fast, reliable, and accessible emergency response system.
            </p>
        </InfoCard>

        {/* The Technology Section */}
        <InfoCard icon={<FaLaptopCode />} title="The Technology">
           <p>
               RailShield is built on a modern, robust technology stack designed for reliability and scalability.
           </p>
           <ul className="list-disc list-inside space-y-2">
                <li><strong>Frontend:</strong> A dynamic and responsive user interface built with React.js, Vite, and Tailwind CSS.</li>
                <li><strong>Backend:</strong> A powerful and secure API powered by Node.js, Express.js, and MongoDB.</li>
                <li><strong>Real-time Communication:</strong> We plan to integrate services like Twilio for offline SMS support, ensuring connectivity even in low-network areas.</li>
           </ul>
        </InfoCard>

        {/* The Team Section */}
        <InfoCard icon={<FaUsers />} title="The Team">
            <p>
                RailShield is a final year project conceptualized and developed by a dedicated team of students:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center pt-4">
                <div className="bg-teal-200 p-4 rounded-md">
                    <p className="font-bold text-gray-800">Anand Kumar</p>
                </div>
                <div className="bg-teal-200 p-4 rounded-md  ">
                    <p className="font-bold text-gray-800">Kaushiki Tripathi</p>
                </div>
                <div className="bg-teal-200 p-4 rounded-md">
                    <p className="font-bold text-gray-800">Prateek Verma</p>
                </div>
            </div>
        </InfoCard>
      </div>
    </div>
  );
}

export default AboutPage;