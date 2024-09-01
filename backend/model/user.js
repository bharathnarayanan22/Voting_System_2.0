// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  credentials: [Object], // Array to store WebAuthn credentials
});

const User = mongoose.model('User', userSchema);

module.exports = User;
