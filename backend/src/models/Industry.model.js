const mongoose = require('mongoose');
const User = require('./User.model');

const industrySchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  industryType: { type: String },
  website: { type: String },
  contactPerson: { type: String },
  logoUrl: { type: String },
  isVerified: { type: Boolean, default: false },
});

const Industry = User.discriminator('industry', industrySchema);

module.exports = Industry;
