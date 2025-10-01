import express from 'express';
import EmergencyReport from "../models/EmergencyReport.js";

const router = express.Router();

// @route   POST /api/reports (Aapka yeh code bilkul sahi hai)
router.post('/', async (req, res) => {
  try {
    const newReport = new EmergencyReport({
      emergencyType: req.body.emergencyType,
      location: req.body.location,
      trainDetails: req.body.trainDetails,
      description: req.body.description,
      passengerDetails: req.body.passengerDetails,
    });
    const savedReport = await newReport.save();
    res.status(201).json(savedReport);
  } catch (error) {
    console.error("Backend Error on Create:", error);
    res.status(400).json({ message: 'Failed to create report', error: error.message });
  }
});

// @route   GET /api/reports (Yeh bhi bilkul sahi hai)
router.get('/', async (req, res) => {
  try {
    const reports = await EmergencyReport.find().sort({ timestamp: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/reports/:id (Yeh bhi bilkul sahi hai)
router.get('/:id', async (req, res) => {
  try {
    const report = await EmergencyReport.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// --- YEH NAYA FUNCTION HAI JO HUM ADD KAR RAHE HAIN ---
// @route   PUT /api/reports/:id
// @desc    Update the status of a report
router.put('/:id', async (req, res) => {
    try {
        const { status } = req.body; // Naya status frontend se aayega
        const updatedReport = await EmergencyReport.findByIdAndUpdate(
            req.params.id,
            { status: status }, // Database mein status ko update karo
            { new: true } // Update hone ke baad naya report waapis bhejo
        );
        if (!updatedReport) {
            return res.status(404).json({ message: 'Report not found' });
        }
        res.json(updatedReport);
    } catch (error) {
        console.error("Backend Error on Update:", error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

export default router;