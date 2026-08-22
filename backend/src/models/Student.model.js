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
});

const Student = User.discriminator('student', studentSchema);

module.exports = Student;
