import React, { useState } from 'react';

// Updated reasons and icons for RailShield
const contactReasons = [
  { icon: '❓', title: 'General Inquiry' },
  { icon: '🐛', title: 'Technical Issue' },
  { icon: '🤝', title: 'Media Inquiry' },
  { icon: '📝', title: 'Feedback/Suggestion' },
];

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [selectedReason, setSelectedReason] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
    if (name === 'subject') {
      setSelectedReason('');
    }
  };
  
  const handleReasonClick = (reasonTitle) => {
    setSelectedReason(reasonTitle);
    setFormData(prevState => ({ ...prevState, subject: reasonTitle }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, we'd send this to a backend. For now, an alert is fine.
    alert('Thank you for your message! We will get back to you soon.');
    console.log('Form data submitted:', formData);
    // Reset form after submission
    setFormData({ name: '', email: '', subject: '', message: '' });
    setSelectedReason('');
  };

  return (
    <div className=" bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 py-12 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white">Get in Touch</h1>
          <p className="mt-4 text-lg text-gray-100 max-w-2xl mx-auto">
            Have a question, feedback, or a technical issue? We're here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">

          {/* LEFT COLUMN: Interactive Section */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-semibold text-teal-100 mb-3">What is your message about?</h3>
              <p className="text-gray-100">Choose a topic below. This helps us direct your message to the right team.</p>
            </div>
            {/* Grid for the reason cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ">
              {contactReasons.map((reason) => (
                <button
                  key={reason.title}
                  type="button"
                  onClick={() => handleReasonClick(reason.title)}
                  className={`p-4 rounded-lg border-2 text-left transition-all duration-300 transform hover:-translate-y-1 cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-200 w-full
                    ${selectedReason === reason.title
                      ? 'bg-teal-100 border-teal-500 ring-2 ring-teal-300' // Selected state
                      : 'bg-white border-gray-200 hover:border-teal-400' // Default state
                    }`}
                >
                  <span className="text-2xl">{reason.icon}</span>
                  <p className="font-semibold text-gray-800 mt-2">{reason.title}</p>
                </button>
              ))}
            </div>
            <div className="pt-4">
              <h3 className="text-2xl font-semibold text-teal-100 mb-2">Contact Details</h3>
              <div className="space-y-2 text-gray-100">
                <p><strong>📍 Location:</strong> Kanpur, India</p>
                <p><strong>✉️ Email:</strong> support@railshield.com</p>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: CONTACT FORM */}
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-lg font-bold text-gray-800">Full Name</label>
                <input
                  type="text" name="name" id="name" required value={formData.name} onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-lg font-bold text-gray-800">Email Address</label>
                <input
                  type="email" name="email" id="email" required value={formData.email} onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                  placeholder="your.email@example.com"
                />
              </div>
              <div>
                <label htmlFor="subject" className="block text-lg font-bold text-gray-800">Subject</label>
                <input
                  type="text" name="subject" id="subject" required value={formData.subject} onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                  placeholder="Click a topic or type here"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-lg font-bold text-gray-800">Message</label>
                <textarea
                  name="message" id="message" rows="5" required value={formData.message} onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                  placeholder="Please describe your issue or suggestion..."
                ></textarea>
              </div>
              <div>
                <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-semibold text-white bg-teal-700 hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition duration-300 transform hover:scale-105 cursor-pointer">
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;