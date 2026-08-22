const mongoose = require('mongoose');

const skillEntrySchema = new mongoose.Schema({
  name: { type: String, required: true },
  score: { type: Number, required: true }, // 0-100
  confidence: { type: Number, required: true }, // 0-1 (derived from evidence strength)
  isVerified: { type: Boolean, default: false },
  evidence: [{
    type: { type: String, enum: ['assessment', 'project', 'certification', 'internship', 'resume'] },
    refId: { type: mongoose.Schema.Types.ObjectId }, // Reference to the source entity
    dateAdded: { type: Date, default: Date.now }
  }],
});

const skillProfileSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true, unique: true },
  skills: [skillEntrySchema],
  lastRecomputedAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('SkillProfile', skillProfileSchema);
