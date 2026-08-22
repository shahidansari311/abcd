const mongoose = require('mongoose');

const opportunitySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  industryPartner: { type: mongoose.Schema.Types.ObjectId, ref: 'Industry', required: true },
  type: { type: String, enum: ['job', 'internship', 'project'], required: true },
  location: { type: String },
  requiredSkills: [{
    skillName: { type: String, required: true },
    minimumScore: { type: Number, required: true }
  }],
  isActive: { type: Boolean, default: true },
  // Vector embedding of the job description for semantic matching
  embedding: { type: [Number], select: false } 
}, { timestamps: true });

module.exports = mongoose.model('Opportunity', opportunitySchema);
