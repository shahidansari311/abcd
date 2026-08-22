const mongoose = require('mongoose');
const User = require('./User.model');

const institutionSchema = new mongoose.Schema({
  institutionName: { type: String, required: true },
  type: { type: String, enum: ['university', 'college', 'training_institute'] },
  website: { type: String },
  accreditationBody: { type: String },
  departments: [{ type: String }],
  isVerified: { type: Boolean, default: false },
});

const Institution = User.discriminator('institution_admin', institutionSchema);

module.exports = Institution;
