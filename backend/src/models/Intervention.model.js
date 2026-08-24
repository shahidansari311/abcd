const mongoose = require('mongoose');

const interventionSchema = new mongoose.Schema({
  institution: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Institution',
    required: true,
  },
  interventionType: {
    type: String,
    enum: ['Curriculum Update', 'Guest Lecture', 'Workshop', 'Mentorship Program', 'Other'],
    required: true,
  },
  targetSkill: {
    type: String,
    required: true,
  },
  expectedImpact: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Planned', 'In Progress', 'Completed'],
    default: 'Planned',
  },
  dateRecorded: {
    type: Date,
    default: Date.now,
  }
}, { timestamps: true });

const Intervention = mongoose.model('Intervention', interventionSchema);

module.exports = Intervention;
