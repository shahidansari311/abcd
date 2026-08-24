const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  opportunity: { type: mongoose.Schema.Types.ObjectId, ref: 'Opportunity' }, // Optional for backwards compatibility, but should be used going forward
  company: { type: String, required: true },
  role: { type: String, required: true },
  status: { type: String, enum: ['Applied', 'Screening', 'Interview', 'Offer', 'Hired'], default: 'Applied' },
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);
