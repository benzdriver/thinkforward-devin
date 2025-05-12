/**
 * 案例文档模型
 * 用于管理案例相关的文档和附件
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const caseDocumentSchema = new Schema({
  caseId: {
    type: Schema.Types.ObjectId,
    ref: 'Case',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['application', 'identification', 'education', 'employment', 'financial', 'medical', 'reference', 'other'],
    default: 'other',
    index: true
  },
  size: {
    type: Number,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  uploadedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    enum: ['submitted', 'draft', 'template', 'reference', 'other'],
    default: 'draft',
    index: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'needs-revision'],
    default: 'pending'
  },
  notes: {
    type: String,
    trim: true
  },
  version: {
    type: Number,
    default: 1
  },
  previousVersions: [{
    url: String,
    version: Number,
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    uploadedAt: Date,
    notes: String
  }],
  isPublic: {
    type: Boolean,
    default: false
  },
  metadata: {
    type: Map,
    of: Schema.Types.Mixed
  }
}, {
  timestamps: true,
  collection: 'caseDocuments'
});

caseDocumentSchema.index({ caseId: 1, type: 1 });
caseDocumentSchema.index({ caseId: 1, category: 1 });
caseDocumentSchema.index({ uploadedBy: 1, createdAt: -1 });

caseDocumentSchema.statics.getCaseDocuments = function(caseId, options = {}) {
  const { type, category, status, sort = { createdAt: -1 } } = options;
  
  const query = { caseId };
  
  if (type) {
    query.type = type;
  }
  
  if (category) {
    query.category = category;
  }
  
  if (status) {
    query.status = status;
  }
  
  return this.find(query)
    .sort(sort)
    .populate('uploadedBy', 'firstName lastName displayName email avatar')
    .exec();
};

caseDocumentSchema.statics.getUserDocuments = function(userId, options = {}) {
  const { caseIds, type, category, sort = { createdAt: -1 }, page = 1, limit = 20 } = options;
  
  const query = { uploadedBy: userId };
  
  if (caseIds && caseIds.length > 0) {
    query.caseId = { $in: caseIds };
  }
  
  if (type) {
    query.type = type;
  }
  
  if (category) {
    query.category = category;
  }
  
  return this.find(query)
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('caseId', 'title clientId')
    .populate('caseId.clientId', 'firstName lastName displayName')
    .exec();
};

caseDocumentSchema.statics.getDocumentStats = async function(caseId) {
  const stats = await this.aggregate([
    { $match: { caseId: mongoose.Types.ObjectId(caseId) } },
    { $group: {
        _id: '$type',
        count: { $sum: 1 },
        totalSize: { $sum: '$size' }
      }
    }
  ]);
  
  const result = {
    total: {
      count: 0,
      size: 0
    },
    byType: {}
  };
  
  stats.forEach(stat => {
    result.byType[stat._id] = {
      count: stat.count,
      size: stat.totalSize
    };
    
    result.total.count += stat.count;
    result.total.size += stat.totalSize;
  });
  
  return result;
};

caseDocumentSchema.statics.searchDocuments = function(caseId, searchTerm, options = {}) {
  const { type, category, sort = { createdAt: -1 } } = options;
  
  const query = {
    caseId,
    $or: [
      { name: { $regex: searchTerm, $options: 'i' } },
      { notes: { $regex: searchTerm, $options: 'i' } }
    ]
  };
  
  if (type) {
    query.type = type;
  }
  
  if (category) {
    query.category = category;
  }
  
  return this.find(query)
    .sort(sort)
    .populate('uploadedBy', 'firstName lastName displayName email avatar')
    .exec();
};

caseDocumentSchema.methods.updateStatus = function(status, notes) {
  this.status = status;
  
  if (notes) {
    this.notes = notes;
  }
  
  return this.save();
};

caseDocumentSchema.methods.addVersion = function(url, uploadedBy, notes) {
  this.previousVersions.push({
    url: this.url,
    version: this.version,
    uploadedBy: this.uploadedBy,
    uploadedAt: this.updatedAt,
    notes: this.notes
  });
  
  this.url = url;
  this.version += 1;
  this.uploadedBy = uploadedBy;
  
  if (notes) {
    this.notes = notes;
  }
  
  return this.save();
};

caseDocumentSchema.methods.togglePublic = function() {
  this.isPublic = !this.isPublic;
  return this.save();
};

const CaseDocument = mongoose.model('CaseDocument', caseDocumentSchema);

module.exports = CaseDocument;
