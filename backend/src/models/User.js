const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: String,
  email: String,
  phone: String,
  idNumber: { type: String, unique: true, sparse: true },
  role: {
    type: String,
    enum: ['candidate', 'content_admin', 'system_admin'],
    default: 'candidate',
  }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

module.exports = User;