const mongoose = require('mongoose');
const User = require('./User.model');

const studentSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  institution: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  degree: { type: String },
  graduationYear: { type: Number },
  skillProfileRef: { type: mongoose.Schema.Types.ObjectId, ref: 'SkillProfile' },
  resumeUrl: { type: String },
  readinessScore: { type: Number, default: 0 },
  readinessHistory: [{
    score: { type: Number },
    date: { type: Date, default: Date.now }
  }],
  targetRole: { type: String },
  careerRoadmap: [{
    title: { type: String },
    status: { type: String, enum: ['done', 'current', 'upcoming'] },
    desc: { type: String }
  }],
  momentumStreak: { type: Number, default: 0 },
  momentumShields: { type: Number, default: 0 },
  weeklyPaceGoal: { type: Number, default: 50 },
  weeklyPaceProgress: { type: Number, default: 0 },
  lastMomentumUpdate: { type: Date }
});

const Student = User.discriminator('student', studentSchema);

module.exports = Student;
