import mongoose from 'mongoose';

const emergencyReportSchema = new mongoose.Schema({
  // --- NEW: Added a section for user details ---
  passehieldngerDetails: {
    name: { type: String, required: true },
    contactNumber: { type: String, required: true },
  },
  emergencyType: {
    type: String,
    required: true,
  },
  location: {
    latitude: { type: Number },
    longitude: { type: Number }
  },
  trainDetails: {
    pnr: { type: String, required: true },
    trainNumber: { type: String, required: true },
    coach: { type: String, required: true },
  },
  description: { // Changed from 'notes' to 'description' to match the frontend
    type: String,
  },
  status: {
    type: String,
    required: true,
    default: 'Pending',
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const EmergencyReport = mongoose.model('EmergencyReport', emergencyReportSchema);

export default EmergencyReport;