const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['student', 'industry', 'academician', 'institution_admin', 'super_admin'],
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'suspended', 'deleted'],
    default: 'active',
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
}, { 
  timestamps: true,
  discriminatorKey: 'role' 
});

userSchema.methods.isPasswordMatch = async function (password) {
  return bcrypt.compare(password, this.passwordHash);
};

userSchema.pre('save', async function () {
  if (this.isModified('passwordHash')) {
    this.passwordHash = await bcrypt.hash(this.passwordHash, 10);
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
