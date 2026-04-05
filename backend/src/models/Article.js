// models/Article.js
const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  content: String,
  category: {
    type: String,
    enum: ['news', 'regulation', 'admission_result', 'announcement', 'scholarship'],
    required: true
  },
  tags: [String],
  publishedAt: Date,
  authorId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  isPublished: { 
    type: Boolean, 
    default: false 
  },
  viewCount: { 
    type: Number, 
    default: 0 
  },
  attachments: [{
    name: String,
    url: String
  }]
}, { timestamps: true });

// Tạo chỉ mục cho các trường thường xuyên truy vấn
articleSchema.index({ category: 1 });
articleSchema.index({ publishedAt: -1 });
articleSchema.index({ isPublished: 1 });
articleSchema.index({ tags: 1 });
articleSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Article', articleSchema);