// models/Statistic.js
const mongoose = require('mongoose');

const statisticSchema = new mongoose.Schema({
  type: { type: String, required: true },   // 'by_major', 'by_status', 'monthly_submission'
  data: mongoose.Schema.Types.Mixed,
  year: Number
}, { timestamps: true });

statisticSchema.index({ type: 1, year: 1 });

module.exports = mongoose.model('Statistic', statisticSchema);