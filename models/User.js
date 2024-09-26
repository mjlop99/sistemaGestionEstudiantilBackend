const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  mail: { type: String, required: true, unique: true },
  username: { type: String, required: true},
  password: { type: String, required: true },
});

module.exports = mongoose.model('User', UserSchema);
