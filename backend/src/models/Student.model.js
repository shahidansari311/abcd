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
  // Added fields
  headline: { type: String },
  experience: [{
    company: String,
    title: String,
    startDate: Date,
    endDate: Date,
    description: String
  }],
  education: [{
    institution: String,
    degree: String,
    fieldOfStudy: String,
    startDate: Date,
    endDate: Date
  }],
  certifications: [String],
  projects: [{
    title: String,
    description: String,
    link: String
  }],
  github: { type: String },
  linkedin: { type: String },
  portfolio: { type: String },
  preferredRoles: [{ type: String }],
  preferredLocations: [{ type: String }],
  availability: { type: String }
});

const Student = User.discriminator('student', studentSchema);

module.exports = Student;
