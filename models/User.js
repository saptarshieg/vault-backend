const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  pin: { type: String, required: true }, // hashed
  refreshToken: { type: String },        // optionally store refresh token
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);