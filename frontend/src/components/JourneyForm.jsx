import React, { useState } from 'react';

function JourneyForm() {
  // Use state to remember the form data
  const [formData, setFormData] = useState({
    pnr: '',
    trainNumber: '',
  });

  // This function runs every time the user types in an input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // This function runs when the form is submitted
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevents the page from reloading
    console.log('Journey Details Submitted:', formData);
    // In the future, we will send this data to our backend API
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="pnr" className="block text-sm font-medium text-gray-700">
          PNR Number
        </label>
        <input
          type="text"
          id="pnr"
          name="pnr"
          value={formData.pnr}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
          placeholder="Enter 10-digit PNR"
        />
      </div>
      <div>
        <label htmlFor="trainNumber" className="block text-sm font-medium text-gray-700">
          Train Number
        </label>
        <input
          type="text"
          id="trainNumber"
          name="trainNumber"
          value={formData.trainNumber}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
          placeholder="Enter 5-digit train number"
        />
      </div>
      <button
        type="submit"
        className="w-full justify-center rounded-md border border-transparent bg-green-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
      >
        Activate System
      </button>
    </form>
  );
}

export default JourneyForm;