const mongoose = require('mongoose');

const assessmentResultSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  assessment: { type: mongoose.Schema.Types.ObjectId, ref: 'Assessment', required: true },
  score: { type: Number, required: true },
  maxScore: { type: Number, required: true },
  percentage: { type: Number, required: true },
  answers: [{
    questionId: { type: mongoose.Schema.Types.ObjectId },
    providedAnswer: { type: String },
    isCorrect: { type: Boolean },
  }],
  status: { type: String, enum: ['completed', 'timeout'], default: 'completed' },
}, { timestamps: true });

module.exports = mongoose.model('AssessmentResult', assessmentResultSchema);
