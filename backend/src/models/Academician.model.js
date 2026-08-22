const mongoose = require('mongoose');
const User = require('./User.model');

const academicianSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  institution: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  department: { type: String },
  designation: { type: String },
  expertiseAreas: [{ type: String }],
});

const Academician = User.discriminator('academician', academicianSchema);

module.exports = Academician;
