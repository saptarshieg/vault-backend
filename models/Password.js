const mongoose = require('mongoose');

const passwordSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  url: String,
  category: String,
  username: String,
  // encryptedPassword will hold the AES-256 encrypted password
  encryptedPassword: { type: String, required: true },
  iv: { type: String, required: true }, // initialization vector
  notes: String
}, { timestamps: true });

module.exports = mongoose.model('Password', passwordSchema);