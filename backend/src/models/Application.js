// models/Application.js
const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  applicationCode: { 
    type: String, 
    required: true, 
    unique: true 
  },
  idNumber: String,
  fullName: String,
  email: String,
  phone: String,
  address: String,
  highSchool: String,
  graduationYear: Number,
  preferences: [{
    priority: Number,
    majorId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Major' 
    },
    methodId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'AdmissionMethod' 
    },
    methodData: mongoose.Schema.Types.Mixed,
    status: { 
      type: String, 
      enum: ['pending', 'approved', 'rejected'], 
      default: 'pending' 
    },
    note: String
  }],
  documents: [{
    name: String,
    url: String,
    uploadDate: { 
      type: Date, 
      default: Date.now 
    }
  }],
  status: {
    type: String,
    enum: ['draft', 'submitted', 'under_review', 'need_more_info', 'approved', 'rejected'],
    default: 'draft'
  },
  submissionDate: Date,
  reviewLog: [{
    adminId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User' 
    },
    status: String,
    comment: String,
    timestamp: { 
      type: Date, 
      default: Date.now 
    }
  }]
}, { timestamps: true });

// Tạo chỉ mục cho các trường thường xuyên truy vấn
applicationSchema.index({ userId: 1 }, { unique: true });
applicationSchema.index({ applicationCode: 1 }, { unique: true });
applicationSchema.index({ idNumber: 1 });
applicationSchema.index({ status: 1 });
applicationSchema.index({ 'preferences.majorId': 1 });
applicationSchema.index({ 'preferences.methodId': 1 });

module.exports = mongoose.model('Application', applicationSchema);