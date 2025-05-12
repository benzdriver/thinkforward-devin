/**
 * 顾问客户管理服务
 * 提供顾问客户管理相关的业务逻辑
 */

const Client = require('../../../models/consultant/client/Client');
const ClientTag = require('../../../models/consultant/client/ClientTag');
const ClientNote = require('../../../models/consultant/client/ClientNote');
const ClientActivity = require('../../../models/consultant/client/ClientActivity');
const mongoose = require('mongoose');

/**
 * 获取客户列表
 * @param {String} consultantId - 顾问ID
 * @param {Object} options - 查询选项
 * @returns {Promise<Array>} 客户列表
 */
const getClients = async (consultantId, options = {}) => {
  try {
    const clients = await Client.getClientsByConsultant(consultantId, options);
    return clients;
  } catch (error) {
    throw new Error(`获取客户列表失败: ${error.message}`);
  }
};

/**
 * 获取客户统计数据
 * @param {String} consultantId - 顾问ID
 * @returns {Promise<Object>} 客户统计数据
 */
const getClientStats = async (consultantId) => {
  try {
    const stats = await Client.getClientStats(consultantId);
    return stats;
  } catch (error) {
    throw new Error(`获取客户统计数据失败: ${error.message}`);
  }
};

/**
 * 获取单个客户详情
 * @param {String} clientId - 客户ID
 * @param {String} consultantId - 顾问ID
 * @returns {Promise<Object>} 客户详情
 */
const getClientById = async (clientId, consultantId) => {
  try {
    const client = await Client.findOne({
      _id: clientId,
      assignedConsultantId: consultantId
    });
    
    if (!client) {
      throw new Error('客户不存在或不属于该顾问');
    }
    
    const tags = await ClientTag.getClientTags(clientId);
    
    const recentNotes = await ClientNote.getClientNotes(clientId, {
      consultantId,
      limit: 5
    });
    
    const recentActivities = await ClientActivity.getClientActivities(clientId, {
      consultantId,
      limit: 10
    });
    
    return {
      ...client.toObject(),
      tags,
      recentNotes,
      recentActivities
    };
  } catch (error) {
    throw new Error(`获取客户详情失败: ${error.message}`);
  }
};

/**
 * 创建新客户
 * @param {Object} clientData - 客户数据
 * @param {String} consultantId - 顾问ID
 * @returns {Promise<Object>} 创建的客户
 */
const createClient = async (clientData, consultantId) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    clientData.assignedConsultantId = consultantId;
    
    const client = await Client.create([clientData], { session });
    
    await ClientActivity.create([{
      clientId: client[0]._id,
      consultantId,
      type: 'profile_update',
      description: '创建了新客户'
    }], { session });
    
    await session.commitTransaction();
    
    return client[0];
  } catch (error) {
    await session.abortTransaction();
    throw new Error(`创建客户失败: ${error.message}`);
  } finally {
    session.endSession();
  }
};

/**
 * 更新客户信息
 * @param {String} clientId - 客户ID
 * @param {Object} updateData - 更新数据
 * @param {String} consultantId - 顾问ID
 * @returns {Promise<Object>} 更新后的客户
 */
const updateClient = async (clientId, updateData, consultantId) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const client = await Client.findOne({
      _id: clientId,
      assignedConsultantId: consultantId
    }).session(session);
    
    if (!client) {
      throw new Error('客户不存在或不属于该顾问');
    }
    
    Object.keys(updateData).forEach(key => {
      if (key !== '_id' && key !== 'assignedConsultantId') {
        client[key] = updateData[key];
      }
    });
    
    await client.save({ session });
    
    await ClientActivity.create([{
      clientId,
      consultantId,
      type: 'profile_update',
      description: '更新了客户信息'
    }], { session });
    
    await session.commitTransaction();
    
    return client;
  } catch (error) {
    await session.abortTransaction();
    throw new Error(`更新客户信息失败: ${error.message}`);
  } finally {
    session.endSession();
  }
};

/**
 * 删除客户
 * @param {String} clientId - 客户ID
 * @param {String} consultantId - 顾问ID
 * @returns {Promise<Boolean>} 是否成功
 */
const deleteClient = async (clientId, consultantId) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const client = await Client.findOne({
      _id: clientId,
      assignedConsultantId: consultantId
    }).session(session);
    
    if (!client) {
      throw new Error('客户不存在或不属于该顾问');
    }
    
    await Promise.all([
      ClientTag.deleteMany({ clientId }, { session }),
      ClientNote.deleteMany({ clientId }, { session }),
      ClientActivity.deleteMany({ clientId }, { session }),
      Client.deleteOne({ _id: clientId }, { session })
    ]);
    
    await session.commitTransaction();
    
    return true;
  } catch (error) {
    await session.abortTransaction();
    throw new Error(`删除客户失败: ${error.message}`);
  } finally {
    session.endSession();
  }
};

/**
 * 添加客户标签
 * @param {String} clientId - 客户ID
 * @param {String} tag - 标签
 * @param {String} color - 颜色
 * @param {String} consultantId - 顾问ID
 * @returns {Promise<Object>} 创建的标签
 */
const addClientTag = async (clientId, tag, color, consultantId) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const client = await Client.findOne({
      _id: clientId,
      assignedConsultantId: consultantId
    }).session(session);
    
    if (!client) {
      throw new Error('客户不存在或不属于该顾问');
    }
    
    const clientTag = await ClientTag.addTag(clientId, tag, color, consultantId);
    
    await ClientActivity.create([{
      clientId,
      consultantId,
      type: 'tag_added',
      description: `添加了标签: ${tag}`
    }], { session });
    
    await session.commitTransaction();
    
    return clientTag;
  } catch (error) {
    await session.abortTransaction();
    throw new Error(`添加客户标签失败: ${error.message}`);
  } finally {
    session.endSession();
  }
};

/**
 * 移除客户标签
 * @param {String} clientId - 客户ID
 * @param {String} tag - 标签
 * @param {String} consultantId - 顾问ID
 * @returns {Promise<Boolean>} 是否成功
 */
const removeClientTag = async (clientId, tag, consultantId) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const client = await Client.findOne({
      _id: clientId,
      assignedConsultantId: consultantId
    }).session(session);
    
    if (!client) {
      throw new Error('客户不存在或不属于该顾问');
    }
    
    const result = await ClientTag.removeTag(clientId, tag);
    
    if (!result) {
      throw new Error('标签不存在');
    }
    
    await ClientActivity.create([{
      clientId,
      consultantId,
      type: 'tag_removed',
      description: `移除了标签: ${tag}`
    }], { session });
    
    await session.commitTransaction();
    
    return true;
  } catch (error) {
    await session.abortTransaction();
    throw new Error(`移除客户标签失败: ${error.message}`);
  } finally {
    session.endSession();
  }
};

/**
 * 添加客户笔记
 * @param {Object} noteData - 笔记数据
 * @param {String} consultantId - 顾问ID
 * @returns {Promise<Object>} 创建的笔记
 */
const addClientNote = async (noteData, consultantId) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const client = await Client.findOne({
      _id: noteData.clientId,
      assignedConsultantId: consultantId
    }).session(session);
    
    if (!client) {
      throw new Error('客户不存在或不属于该顾问');
    }
    
    noteData.consultantId = consultantId;
    
    const note = await ClientNote.create([noteData], { session });
    
    await ClientActivity.create([{
      clientId: noteData.clientId,
      consultantId,
      type: 'note_added',
      description: '添加了新笔记',
      relatedId: note[0]._id,
      relatedType: 'ClientNote'
    }], { session });
    
    await client.updateLastContactDate(new Date());
    
    await session.commitTransaction();
    
    return note[0];
  } catch (error) {
    await session.abortTransaction();
    throw new Error(`添加客户笔记失败: ${error.message}`);
  } finally {
    session.endSession();
  }
};

/**
 * 获取客户笔记
 * @param {String} clientId - 客户ID
 * @param {String} consultantId - 顾问ID
 * @param {Object} options - 查询选项
 * @returns {Promise<Array>} 笔记列表
 */
const getClientNotes = async (clientId, consultantId, options = {}) => {
  try {
    const client = await Client.findOne({
      _id: clientId,
      assignedConsultantId: consultantId
    });
    
    if (!client) {
      throw new Error('客户不存在或不属于该顾问');
    }
    
    const notes = await ClientNote.getClientNotes(clientId, {
      consultantId,
      ...options
    });
    
    return notes;
  } catch (error) {
    throw new Error(`获取客户笔记失败: ${error.message}`);
  }
};

/**
 * 记录客户活动
 * @param {Object} activityData - 活动数据
 * @returns {Promise<Object>} 创建的活动
 */
const addClientActivity = async (activityData) => {
  try {
    const activity = await ClientActivity.logActivity(activityData);
    return activity;
  } catch (error) {
    throw new Error(`记录客户活动失败: ${error.message}`);
  }
};

/**
 * 获取客户活动
 * @param {String} clientId - 客户ID
 * @param {String} consultantId - 顾问ID
 * @param {Object} options - 查询选项
 * @returns {Promise<Array>} 活动列表
 */
const getClientActivities = async (clientId, consultantId, options = {}) => {
  try {
    const client = await Client.findOne({
      _id: clientId,
      assignedConsultantId: consultantId
    });
    
    if (!client) {
      throw new Error('客户不存在或不属于该顾问');
    }
    
    const activities = await ClientActivity.getClientActivities(clientId, {
      consultantId,
      ...options
    });
    
    return activities;
  } catch (error) {
    throw new Error(`获取客户活动失败: ${error.message}`);
  }
};

/**
 * 搜索客户
 * @param {String} consultantId - 顾问ID
 * @param {String} searchTerm - 搜索词
 * @param {Number} limit - 限制数量
 * @returns {Promise<Array>} 客户列表
 */
const searchClients = async (consultantId, searchTerm, limit = 10) => {
  try {
    const clients = await Client.searchClients(consultantId, searchTerm, limit);
    return clients;
  } catch (error) {
    throw new Error(`搜索客户失败: ${error.message}`);
  }
};

/**
 * 获取顾问的所有标签
 * @param {String} consultantId - 顾问ID
 * @returns {Promise<Array>} 标签列表
 */
const getConsultantTags = async (consultantId) => {
  try {
    const tags = await ClientTag.getConsultantTags(consultantId);
    return tags;
  } catch (error) {
    throw new Error(`获取顾问标签失败: ${error.message}`);
  }
};

/**
 * 根据标签查找客户
 * @param {String} consultantId - 顾问ID
 * @param {String} tag - 标签
 * @returns {Promise<Array>} 客户列表
 */
const findClientsByTag = async (consultantId, tag) => {
  try {
    const clients = await ClientTag.findClientsByTag(consultantId, tag);
    return clients;
  } catch (error) {
    throw new Error(`根据标签查找客户失败: ${error.message}`);
  }
};

module.exports = {
  getClients,
  getClientStats,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
  addClientTag,
  removeClientTag,
  addClientNote,
  getClientNotes,
  addClientActivity,
  getClientActivities,
  searchClients,
  getConsultantTags,
  findClientsByTag
};
