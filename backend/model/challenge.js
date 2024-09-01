const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  challenge: { type: String, required: true },
  createdAt: { type: Date, expires: 60, default: Date.now }, // Automatically delete after 60 seconds
});

module.exports = mongoose.model('Challenge', challengeSchema);
