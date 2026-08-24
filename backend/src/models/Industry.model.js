const mongoose = require('mongoose');
const User = require('./User.model');

const industrySchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  industryType: { type: String },
  website: { type: String },
  contactPerson: { type: String },
  logoUrl: { type: String },
  isVerified: { type: Boolean, default: false },
  // Rich profile fields
  description: { type: String, default: 'We are an innovative company looking for top talent.' },
  companySize: { type: String, default: '50-200 employees' },
  founded: { type: String, default: '2020' },
  headquarters: { type: String, default: 'Global' },
  benefits: { type: [String], default: ['Remote Work', 'Health Insurance'] },
});

const Industry = User.discriminator('industry', industrySchema);

module.exports = Industry;
