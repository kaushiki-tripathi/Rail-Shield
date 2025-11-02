// Lightweight request validators (no external deps)
export function validateRegisterPassenger(req, res, next) {
  const { name, email } = req.body || {};
  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return res.status(400).json({ message: 'Invalid name' });
  }
  if (!email || typeof email !== 'string' || !/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ message: 'Invalid email' });
  }
  return next();
}

export function validateReport(req, res, next) {
  const body = req.body || {};
  const { emergencyType, passengerDetails, trainDetails } = body;
  if (!emergencyType || typeof emergencyType !== 'string') {
    return res.status(400).json({ message: 'Invalid or missing emergencyType' });
  }
  if (!passengerDetails || typeof passengerDetails !== 'object') {
    return res.status(400).json({ message: 'Missing passengerDetails' });
  }
  if (!passengerDetails.name || !passengerDetails.contactNumber) {
    return res.status(400).json({ message: 'Passenger name and contactNumber are required' });
  }
  if (!trainDetails || !trainDetails.pnr || !trainDetails.trainNumber || !trainDetails.coach) {
    return res.status(400).json({ message: 'Incomplete trainDetails (pnr, trainNumber, coach required)' });
  }
  return next();
}

export function validateUpdateStatus(req, res, next) {
  const { status } = req.body || {};
  const allowed = ['Pending', 'Acknowledged', 'InProgress', 'Resolved', 'Rejected'];
  if (!status || typeof status !== 'string' || !allowed.includes(status)) {
    return res.status(400).json({ message: `Invalid status. Allowed: ${allowed.join(', ')}` });
  }
  return next();
}

export default { validateRegisterPassenger, validateReport, validateUpdateStatus };
