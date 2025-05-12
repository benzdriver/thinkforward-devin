/**
 * 客户笔记模型
 * 用于存储顾问对客户的笔记记录
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clientNoteSchema = new Schema({
  clientId: {
    type: Schema.Types.ObjectId,
    ref: 'Client',
    required: true,
    index: true
  },
  consultantId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  content: {
    type: String,
    required: true
  },
  isPrivate: {
    type: Boolean,
    default: false
  },
  category: {
    type: String,
    enum: ['general', 'meeting', 'call', 'email', 'document', 'application', 'other'],
    default: 'general'
  },
  pinned: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  collection: 'clientNotes'
});

clientNoteSchema.statics.getClientNotes = function(clientId, options = {}) {
  const { consultantId, category, isPrivate, sort = { createdAt: -1 }, skip = 0, limit = 20 } = options;
  
  const query = { clientId };
  
  if (consultantId) {
    query.consultantId = consultantId;
  }
  
  if (category && category !== 'all') {
    query.category = category;
  }
  
  if (isPrivate !== undefined) {
    query.isPrivate = isPrivate;
  }
  
  return this.find(query)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .populate('consultantId', 'name email')
    .exec();
};

clientNoteSchema.statics.getConsultantNotes = function(consultantId, options = {}) {
  const { clientId, category, isPrivate, sort = { createdAt: -1 }, skip = 0, limit = 20 } = options;
  
  const query = { consultantId };
  
  if (clientId) {
    query.clientId = clientId;
  }
  
  if (category && category !== 'all') {
    query.category = category;
  }
  
  if (isPrivate !== undefined) {
    query.isPrivate = isPrivate;
  }
  
  return this.find(query)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .populate('clientId', 'firstName lastName displayName email')
    .exec();
};

clientNoteSchema.statics.getNoteStats = async function(consultantId) {
  const stats = await this.aggregate([
    { $match: { consultantId: mongoose.Types.ObjectId(consultantId) } },
    { $group: {
        _id: '$category',
        count: { $sum: 1 }
      }
    }
  ]);
  
  const result = {
    general: 0,
    meeting: 0,
    call: 0,
    email: 0,
    document: 0,
    application: 0,
    other: 0,
    total: 0
  };
  
  stats.forEach(stat => {
    result[stat._id] = stat.count;
    result.total += stat.count;
  });
  
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const recentlyAdded = await this.countDocuments({
    consultantId,
    createdAt: { $gte: thirtyDaysAgo }
  });
  
  result.recentlyAdded = recentlyAdded;
  
  return result;
};

clientNoteSchema.statics.searchNotes = function(consultantId, searchTerm, limit = 10) {
  const searchRegex = new RegExp(searchTerm, 'i');
  
  return this.find({
    consultantId,
    content: searchRegex
  })
  .sort({ createdAt: -1 })
  .limit(limit)
  .populate('clientId', 'firstName lastName displayName email')
  .exec();
};

clientNoteSchema.statics.addNote = function(noteData) {
  return this.create(noteData);
};

clientNoteSchema.methods.updateContent = function(content) {
  this.content = content;
  return this.save();
};

clientNoteSchema.methods.togglePrivate = function() {
  this.isPrivate = !this.isPrivate;
  return this.save();
};

clientNoteSchema.methods.togglePinned = function() {
  this.pinned = !this.pinned;
  return this.save();
};

clientNoteSchema.methods.changeCategory = function(category) {
  this.category = category;
  return this.save();
};

clientNoteSchema.index({ content: 'text' });
clientNoteSchema.index({ clientId: 1, consultantId: 1, createdAt: -1 });

const ClientNote = mongoose.model('ClientNote', clientNoteSchema);

module.exports = ClientNote;
