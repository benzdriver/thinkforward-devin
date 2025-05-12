/**
 * 案例笔记模型
 * 用于管理案例相关的笔记记录
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const caseNoteSchema = new Schema({
  caseId: {
    type: Schema.Types.ObjectId,
    ref: 'Case',
    required: true,
    index: true
  },
  authorId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  isPrivate: {
    type: Boolean,
    default: false
  },
  pinned: {
    type: Boolean,
    default: false
  },
  category: {
    type: String,
    enum: ['general', 'meeting', 'call', 'email', 'document', 'application', 'other'],
    default: 'general'
  },
  attachments: [{
    name: String,
    url: String,
    type: String,
    size: Number,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  mentions: [{
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    isRead: {
      type: Boolean,
      default: false
    }
  }]
}, {
  timestamps: true,
  collection: 'caseNotes'
});

caseNoteSchema.index({ caseId: 1, createdAt: -1 });
caseNoteSchema.index({ authorId: 1, createdAt: -1 });
caseNoteSchema.index({ caseId: 1, pinned: -1, createdAt: -1 });
caseNoteSchema.index({ 'mentions.userId': 1, 'mentions.isRead': 1 });

caseNoteSchema.statics.getCaseNotes = function(caseId, options = {}) {
  const { isPrivate, authorId, category, sort = { pinned: -1, createdAt: -1 } } = options;
  
  const query = { caseId };
  
  if (isPrivate !== undefined) {
    query.isPrivate = isPrivate;
  }
  
  if (authorId) {
    query.authorId = authorId;
  }
  
  if (category) {
    query.category = category;
  }
  
  return this.find(query)
    .sort(sort)
    .populate('authorId', 'firstName lastName displayName email avatar')
    .populate('mentions.userId', 'firstName lastName displayName email avatar')
    .exec();
};

caseNoteSchema.statics.getAuthorNotes = function(authorId, options = {}) {
  const { caseIds, isPrivate, category, sort = { createdAt: -1 }, page = 1, limit = 20 } = options;
  
  const query = { authorId };
  
  if (caseIds && caseIds.length > 0) {
    query.caseId = { $in: caseIds };
  }
  
  if (isPrivate !== undefined) {
    query.isPrivate = isPrivate;
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

caseNoteSchema.statics.searchNotes = function(caseId, searchTerm, options = {}) {
  const { authorId, isPrivate, sort = { createdAt: -1 } } = options;
  
  const query = {
    caseId,
    content: { $regex: searchTerm, $options: 'i' }
  };
  
  if (authorId) {
    query.authorId = authorId;
  }
  
  if (isPrivate !== undefined) {
    query.isPrivate = isPrivate;
  }
  
  return this.find(query)
    .sort(sort)
    .populate('authorId', 'firstName lastName displayName email avatar')
    .exec();
};

caseNoteSchema.statics.getPinnedNotes = function(caseId) {
  return this.find({
    caseId,
    pinned: true
  })
  .sort({ createdAt: -1 })
  .populate('authorId', 'firstName lastName displayName email avatar')
  .exec();
};

caseNoteSchema.statics.getUnreadMentions = function(userId) {
  return this.find({
    'mentions.userId': userId,
    'mentions.isRead': false
  })
  .sort({ createdAt: -1 })
  .populate('caseId', 'title')
  .populate('authorId', 'firstName lastName displayName email avatar')
  .exec();
};

caseNoteSchema.methods.togglePrivate = function() {
  this.isPrivate = !this.isPrivate;
  return this.save();
};

caseNoteSchema.methods.togglePinned = function() {
  this.pinned = !this.pinned;
  return this.save();
};

caseNoteSchema.methods.changeCategory = function(category) {
  if (!this.schema.path('category').enumValues.includes(category)) {
    throw new Error('无效的笔记类别');
  }
  this.category = category;
  return this.save();
};

caseNoteSchema.methods.addMention = function(userId) {
  const mentionExists = this.mentions.some(mention => 
    mention.userId.toString() === userId.toString()
  );
  
  if (!mentionExists) {
    this.mentions.push({
      userId,
      isRead: false
    });
    return this.save();
  }
  
  return Promise.resolve(this);
};

caseNoteSchema.methods.markMentionAsRead = function(userId) {
  const mention = this.mentions.find(mention => 
    mention.userId.toString() === userId.toString()
  );
  
  if (mention) {
    mention.isRead = true;
    return this.save();
  }
  
  return Promise.resolve(this);
};

const CaseNote = mongoose.model('CaseNote', caseNoteSchema);

module.exports = CaseNote;
