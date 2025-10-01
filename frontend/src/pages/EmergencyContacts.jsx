import React from 'react';
// Importing icons for each contact type
import { FaShieldAlt, FaAmbulance, FaFemale, FaPhoneAlt } from 'react-icons/fa';

// Reusable component for each contact card
const ContactCard = ({ icon, title, number, description }) => (
    <div className="bg-white rounded-lg shadow-lg p-6 flex items-center space-x-6 transform hover:scale-105 transition-transform duration-300 cursor-pointer">
        <div className="flex-shrink-0 text-3xl text-teal-600">
            {icon}
        </div>
        <div className="flex-grow">
            <h3 className="text-xl font-bold text-gray-800">{title}</h3>
            <p className="text-gray-500">{description}</p>
        </div>
        <a 
            href={`tel:${number}`} 
            className="text-white bg-teal-700 hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition duration-300 transform hover:scale-105 cursor-pointer  font-bold py-3 px-6 rounded flex items-center gap-2"
        >
            <FaPhoneAlt />
            <span>{number}</span>
        </a>
    </div>
);

const EmergencyContactsPage = () => {
    return (
        <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900">
            {/* Page Header Banner */}
            <section className="text-white py-20 text-center">
                <div className="max-w-4xl mx-auto px-4">
                    <h1 className="text-5xl font-bold tracking-tight">Emergency Helplines</h1>
                    <p className="mt-4 text-xl text-red-100">
                        Immediate assistance is just a call away. Save these numbers.
                    </p>
                </div>
            </section>

            {/* Main Content with Contact Cards */}
            <div className="max-w-4xl mx-auto py-3 px-4 space-y-8 pb-20">
                <ContactCard 
                    icon={<FaShieldAlt />}
                    title="Railway Protection Force (RPF)"
                    number="182"
                    description="For security-related issues like theft, harassment, or vandalism."
                />
                <ContactCard 
                    icon={<FaAmbulance />}
                    title="Medical Emergency"
                    number="102"
                    description="For any urgent medical assistance required during your journey."
                />
                <ContactCard 
                    icon={<FaFemale />}
                    title="Women's Helpline"
                    number="1091"
                    description="For safety and security concerns specific to women passengers."
                />
                <ContactCard 
                    icon={<FaPhoneAlt />}
                    title="All-in-One Emergency"
                    number="112"
                    description="The national emergency number for police, fire, and ambulance."
                />
            </div>
        </div>
    );
};

export default EmergencyContactsPage;