// models/Major.js
const mongoose = require('mongoose');

const majorSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  totalQuota: Number,
  duration: Number,
  description: String,
  isActive: { type: Boolean, default: true },
  year: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Major', majorSchema);