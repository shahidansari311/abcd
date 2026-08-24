const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  options: [{ type: String }],
  correctAnswer: { type: String },
  points: { type: Number, default: 1 },
});

const assessmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  type: { type: String, enum: ['technical', 'aptitude', 'soft_skill', 'behavioral'], required: true },
  targetRole: { type: String },
  relatedSkill: { type: String },
  durationMinutes: { type: Number },
  questions: [questionSchema],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Assessment', assessmentSchema);
