const mongoose = require('mongoose');

const admissionResultSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    majorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Major',
      required: true,
    },
    methodId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AdmissionMethod',
      required: true,
    },
    // Truy vết theo hồ sơ/ưu tiên
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application',
      required: true,
    },
    preferenceId: {
      type: mongoose.Schema.Types.ObjectId,
    },

    status: {
      type: String,
      enum: ['approved', 'rejected'],
      default: 'approved',
    },
    note: String,
  },
  { timestamps: true }
);

admissionResultSchema.index({ userId: 1, majorId: 1, methodId: 1 });

module.exports = mongoose.model('AdmissionResult', admissionResultSchema);

