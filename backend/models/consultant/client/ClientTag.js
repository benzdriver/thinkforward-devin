/**
 * 客户标签模型
 * 用于管理客户的标签分类
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clientTagSchema = new Schema({
  clientId: {
    type: Schema.Types.ObjectId,
    ref: 'Client',
    required: true,
    index: true
  },
  tag: {
    type: String,
    required: true,
    trim: true
  },
  color: {
    type: String,
    default: '#1890ff'
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  collection: 'clientTags'
});

clientTagSchema.index({ clientId: 1, tag: 1 }, { unique: true });

clientTagSchema.statics.getClientTags = function(clientId) {
  return this.find({ clientId }).sort({ tag: 1 }).exec();
};

clientTagSchema.statics.getConsultantTags = async function(consultantId) {
  const Client = mongoose.model('Client');
  
  const clients = await Client.find({ assignedConsultantId: consultantId }, '_id');
  const clientIds = clients.map(client => client._id);
  
  const tags = await this.find({ clientId: { $in: clientIds } })
    .select('tag color')
    .sort({ tag: 1 });
  
  const uniqueTags = [];
  const tagMap = new Map();
  
  tags.forEach(tag => {
    if (!tagMap.has(tag.tag)) {
      tagMap.set(tag.tag, tag.color);
      uniqueTags.push({
        tag: tag.tag,
        color: tag.color
      });
    }
  });
  
  return uniqueTags;
};

clientTagSchema.statics.findClientsByTag = async function(consultantId, tag) {
  const Client = mongoose.model('Client');
  
  const taggedClients = await this.find({ tag }).select('clientId');
  const clientIds = taggedClients.map(tc => tc.clientId);
  
  return Client.find({
    _id: { $in: clientIds },
    assignedConsultantId: consultantId
  });
};

clientTagSchema.statics.addTag = async function(clientId, tag, color, userId) {
  try {
    return await this.create({
      clientId,
      tag,
      color: color || '#1890ff',
      createdBy: userId
    });
  } catch (error) {
    if (error.code === 11000) {
      return this.findOneAndUpdate(
        { clientId, tag },
        { color: color || '#1890ff', createdBy: userId },
        { new: true }
      );
    }
    throw error;
  }
};

clientTagSchema.statics.removeTag = function(clientId, tag) {
  return this.findOneAndDelete({ clientId, tag });
};

clientTagSchema.statics.addTagsToClients = async function(clientIds, tag, color, userId) {
  const tags = clientIds.map(clientId => ({
    clientId,
    tag,
    color: color || '#1890ff',
    createdBy: userId
  }));
  
  try {
    return await this.insertMany(tags, { ordered: false });
  } catch (error) {
    if (error.code === 11000) {
      return { acknowledged: true, insertedCount: error.result.nInserted };
    }
    throw error;
  }
};

const ClientTag = mongoose.model('ClientTag', clientTagSchema);

module.exports = ClientTag;
