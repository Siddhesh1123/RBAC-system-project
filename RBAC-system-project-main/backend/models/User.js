const mongoose = require('mongoose'); // Ensure mongoose is installed
const bcrypt = require('bcrypt'); // Ensure bcrypt is installed

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  avatar: { type: String }, // Add this if not already present
});

// Hash password before saving


module.exports = mongoose.model('User', UserSchema);
