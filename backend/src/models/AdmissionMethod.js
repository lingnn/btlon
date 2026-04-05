const mongoose = require('mongoose');

const admissionMethodSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  name: String,
  description: String,
  fields: [{
    key: String,
    label: String,
    type: { type: String, enum: ['text', 'number', 'file', 'date', 'select'] },
    required: Boolean,
    options: [String]
  }],
  isActive: { type: Boolean, default: true },
  year: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('AdmissionMethod', admissionMethodSchema);