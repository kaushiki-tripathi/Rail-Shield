import React from 'react';

// A reusable component to keep the sections looking consistent
const PolicySection = ({ title, children }) => (
    <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-teal-200">{title}</h2>
        <div className="space-y-4 text-gray-600 leading-relaxed">
            {children}
        </div>
    </div>
);

const PrivacyPolicyPage = () => {
    return (
        <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900">
            {/* Page Header Banner */}
            <section className="text-white py-20 text-center">
                <div className="max-w-4xl mx-auto px-4">
                    <h1 className="text-5xl font-bold tracking-tight">Privacy Policy</h1>
                    <p className="mt-4 text-xl text-teal-100">
                        Your trust and safety are our highest priority.
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto py-3 px-4">
                <div className="bg-white p-8 sm:p-12 rounded-lg shadow-xl mb-15">
                    <p className="text-gray-600 mb-8">Last updated: September 25, 2025</p>

                    <PolicySection title="Introduction">
                        <p>Welcome to RailShield. This Privacy Policy explains how we collect, use, and protect your personal information when you use our emergency response service. By using RailShield, you agree to the collection and use of information in accordance with this policy.</p>
                    </PolicySection>

                    <PolicySection title="Information We Collect">
                        <p>To provide an effective emergency response, we collect the following information when you submit a report:</p>
                        <ul className="list-disc list-inside ml-4">
                            <li><strong>Personal Details:</strong> Your name and contact number.</li>
                            <li><strong>Journey Information:</strong> Your PNR number, Train Number, and Coach Number.</li>
                            <li><strong>Emergency Details:</strong> The type of emergency and any description you provide.</li>
                            <li><strong>Geolocation Data:</strong> Your precise latitude and longitude, only when you grant permission by clicking the "Get My Current Location" button.</li>
                        </ul>
                    </PolicySection>

                    <PolicySection title="How We Use Your Information">
                        <p>The information we collect is used solely for the purpose of your safety. Specifically, we use it to:</p>
                        <ul className="list-disc list-inside ml-4">
                            <li>Transmit your emergency alert, identity, and location to the nearest Railway Protection Force (RPF) and railway control authorities.</li>
                            <li>Allow railway staff to contact you for further information or to coordinate assistance.</li>
                            <li>Verify your journey details to ensure a legitimate alert.</li>
                        </ul>
                        <p><strong>We will never sell your personal data to third parties.</strong></p>
                    </PolicySection>

                    <PolicySection title="Data Security">
                        <p>We are committed to protecting your data. We use industry-standard practices to secure our application and database to prevent unauthorized access, use, or disclosure of your information.</p>
                    </PolicySection>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicyPage;