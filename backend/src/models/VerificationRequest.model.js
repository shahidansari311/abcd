const mongoose = require('mongoose');

const verificationRequestSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  academician: { type: mongoose.Schema.Types.ObjectId, ref: 'Academician' },
  industry: { type: mongoose.Schema.Types.ObjectId, ref: 'Industry' },
  skillRef: { type: mongoose.Schema.Types.ObjectId, required: true }, // Points to a specific skill inside the student's SkillProfile
  skillName: { type: String, required: true },
  evidenceUrl: { type: String },
  evidenceDescription: { type: String },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  reviewerNotes: { type: String },
  reviewedAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('VerificationRequest', verificationRequestSchema);
