/**
 * 顾问案例管理服务
 * 提供案例管理相关的业务逻辑
 */

const Case = require('../../../models/consultant/case/Case');
const CaseTask = require('../../../models/consultant/case/CaseTask');
const CaseNote = require('../../../models/consultant/case/CaseNote');
const CaseDocument = require('../../../models/consultant/case/CaseDocument');
const CaseTimeline = require('../../../models/consultant/case/CaseTimeline');
const mongoose = require('mongoose');
const { createError } = require('../../../utils/errorHandler');

/**
 * 获取顾问的案例列表
 * @param {string} consultantId - 顾问ID
 * @param {Object} options - 查询选项
 * @returns {Promise<Array>} 案例列表
 */
exports.getConsultantCases = async (consultantId, options = {}) => {
  try {
    const cases = await Case.getConsultantCases(consultantId, options);
    const total = await Case.countDocuments({ consultantId, ...buildFilterQuery(options) });
    
    return {
      cases,
      pagination: {
        total,
        page: options.page || 1,
        limit: options.limit || 20,
        pages: Math.ceil(total / (options.limit || 20))
      }
    };
  } catch (error) {
    throw createError('获取案例列表失败', 500, error);
  }
};

/**
 * 获取客户的案例列表
 * @param {string} clientId - 客户ID
 * @param {Object} options - 查询选项
 * @returns {Promise<Array>} 案例列表
 */
exports.getClientCases = async (clientId, options = {}) => {
  try {
    const cases = await Case.getClientCases(clientId, options);
    const total = await Case.countDocuments({ clientId, ...buildFilterQuery(options) });
    
    return {
      cases,
      pagination: {
        total,
        page: options.page || 1,
        limit: options.limit || 20,
        pages: Math.ceil(total / (options.limit || 20))
      }
    };
  } catch (error) {
    throw createError('获取客户案例列表失败', 500, error);
  }
};

/**
 * 获取案例详情
 * @param {string} caseId - 案例ID
 * @returns {Promise<Object>} 案例详情
 */
exports.getCaseById = async (caseId) => {
  try {
    const caseData = await Case.findById(caseId)
      .populate('clientId', 'firstName lastName displayName email avatar')
      .populate('consultantId', 'firstName lastName displayName email avatar');
    
    if (!caseData) {
      throw createError('案例不存在', 404);
    }
    
    return caseData;
  } catch (error) {
    if (error.statusCode) throw error;
    throw createError('获取案例详情失败', 500, error);
  }
};

/**
 * 创建新案例
 * @param {Object} caseData - 案例数据
 * @param {string} userId - 创建者ID
 * @returns {Promise<Object>} 创建的案例
 */
exports.createCase = async (caseData, userId) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const newCase = new Case({
      ...caseData,
      consultantId: userId
    });
    
    await newCase.save({ session });
    
    await CaseTimeline.create([{
      caseId: newCase._id,
      type: 'status-change',
      description: `案例已创建，初始状态为 "${newCase.status}"`,
      userId,
      isImportant: true
    }], { session });
    
    await session.commitTransaction();
    session.endSession();
    
    return newCase;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw createError('创建案例失败', 500, error);
  }
};

/**
 * 更新案例信息
 * @param {string} caseId - 案例ID
 * @param {Object} updateData - 更新数据
 * @param {string} userId - 更新者ID
 * @returns {Promise<Object>} 更新后的案例
 */
exports.updateCase = async (caseId, updateData, userId) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const caseData = await Case.findById(caseId).session(session);
    
    if (!caseData) {
      throw createError('案例不存在', 404);
    }
    
    if (caseData.consultantId.toString() !== userId) {
      throw createError('无权更新此案例', 403);
    }
    
    if (updateData.status && updateData.status !== caseData.status) {
      await CaseTimeline.addStatusChangeEvent(
        caseId,
        userId,
        caseData.status,
        updateData.status
      );
    }
    
    Object.keys(updateData).forEach(key => {
      caseData[key] = updateData[key];
    });
    
    await caseData.save({ session });
    
    await session.commitTransaction();
    session.endSession();
    
    return caseData;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    
    if (error.statusCode) throw error;
    throw createError('更新案例失败', 500, error);
  }
};

/**
 * 删除案例
 * @param {string} caseId - 案例ID
 * @param {string} userId - 用户ID
 * @returns {Promise<Object>} 删除结果
 */
exports.deleteCase = async (caseId, userId) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const caseData = await Case.findById(caseId).session(session);
    
    if (!caseData) {
      throw createError('案例不存在', 404);
    }
    
    if (caseData.consultantId.toString() !== userId) {
      throw createError('无权删除此案例', 403);
    }
    
    await CaseTask.deleteMany({ caseId }, { session });
    await CaseNote.deleteMany({ caseId }, { session });
    await CaseDocument.deleteMany({ caseId }, { session });
    await CaseTimeline.deleteMany({ caseId }, { session });
    
    await Case.findByIdAndDelete(caseId, { session });
    
    await session.commitTransaction();
    session.endSession();
    
    return { success: true, message: '案例已成功删除' };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    
    if (error.statusCode) throw error;
    throw createError('删除案例失败', 500, error);
  }
};

/**
 * 获取案例统计数据
 * @param {string} consultantId - 顾问ID
 * @returns {Promise<Object>} 统计数据
 */
exports.getCaseStats = async (consultantId) => {
  try {
    return await Case.getCaseStats(consultantId);
  } catch (error) {
    throw createError('获取案例统计数据失败', 500, error);
  }
};

/**
 * 获取即将到期的案例
 * @param {string} consultantId - 顾问ID
 * @param {number} limit - 限制数量
 * @returns {Promise<Array>} 即将到期的案例
 */
exports.getUpcomingDeadlines = async (consultantId, limit = 5) => {
  try {
    return await Case.getUpcomingDeadlines(consultantId, limit);
  } catch (error) {
    throw createError('获取即将到期的案例失败', 500, error);
  }
};

/**
 * 更新案例进度
 * @param {string} caseId - 案例ID
 * @param {number} progress - 进度值
 * @param {string} userId - 用户ID
 * @returns {Promise<Object>} 更新后的案例
 */
exports.updateCaseProgress = async (caseId, progress, userId) => {
  try {
    const caseData = await Case.findById(caseId);
    
    if (!caseData) {
      throw createError('案例不存在', 404);
    }
    
    if (caseData.consultantId.toString() !== userId) {
      throw createError('无权更新此案例', 403);
    }
    
    const oldProgress = caseData.progress;
    const updatedCase = await Case.updateCaseProgress(caseId, progress);
    
    if ((oldProgress < 100 && progress === 100) || (oldProgress === 100 && progress < 100)) {
      await CaseTimeline.create({
        caseId,
        type: 'status-change',
        description: progress === 100 ? '案例已完成' : '案例重新开始处理',
        userId,
        isImportant: true,
        metadata: {
          oldProgress,
          newProgress: progress
        }
      });
    }
    
    return updatedCase;
  } catch (error) {
    if (error.statusCode) throw error;
    throw createError('更新案例进度失败', 500, error);
  }
};

/**
 * 获取案例任务列表
 * @param {string} caseId - 案例ID
 * @param {Object} options - 查询选项
 * @returns {Promise<Array>} 任务列表
 */
exports.getCaseTasks = async (caseId, options = {}) => {
  try {
    return await CaseTask.getCaseTasks(caseId, options);
  } catch (error) {
    throw createError('获取案例任务失败', 500, error);
  }
};

/**
 * 创建案例任务
 * @param {string} caseId - 案例ID
 * @param {Object} taskData - 任务数据
 * @param {string} userId - 创建者ID
 * @returns {Promise<Object>} 创建的任务
 */
exports.createCaseTask = async (caseId, taskData, userId) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const caseData = await Case.findById(caseId).session(session);
    
    if (!caseData) {
      throw createError('案例不存在', 404);
    }
    
    const newTask = new CaseTask({
      caseId,
      ...taskData,
      assigneeId: taskData.assigneeId || userId
    });
    
    await newTask.save({ session });
    
    await CaseTimeline.addTaskEvent(
      caseId,
      userId,
      newTask._id,
      newTask.title,
      'created'
    );
    
    await session.commitTransaction();
    session.endSession();
    
    return newTask;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    
    if (error.statusCode) throw error;
    throw createError('创建任务失败', 500, error);
  }
};

/**
 * 更新案例任务
 * @param {string} taskId - 任务ID
 * @param {Object} updateData - 更新数据
 * @param {string} userId - 更新者ID
 * @returns {Promise<Object>} 更新后的任务
 */
exports.updateCaseTask = async (taskId, updateData, userId) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const task = await CaseTask.findById(taskId)
      .populate('caseId')
      .session(session);
    
    if (!task) {
      throw createError('任务不存在', 404);
    }
    
    if (task.caseId.consultantId.toString() !== userId && task.assigneeId.toString() !== userId) {
      throw createError('无权更新此任务', 403);
    }
    
    if (updateData.status && updateData.status !== task.status) {
      if (updateData.status === 'completed') {
        await CaseTimeline.addTaskEvent(
          task.caseId._id,
          userId,
          task._id,
          task.title,
          'completed'
        );
      } else {
        await CaseTimeline.addTaskEvent(
          task.caseId._id,
          userId,
          task._id,
          task.title,
          updateData.status
        );
      }
    }
    
    Object.keys(updateData).forEach(key => {
      task[key] = updateData[key];
    });
    
    await task.save({ session });
    
    await session.commitTransaction();
    session.endSession();
    
    return task;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    
    if (error.statusCode) throw error;
    throw createError('更新任务失败', 500, error);
  }
};

/**
 * 删除案例任务
 * @param {string} taskId - 任务ID
 * @param {string} userId - 用户ID
 * @returns {Promise<Object>} 删除结果
 */
exports.deleteCaseTask = async (taskId, userId) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const task = await CaseTask.findById(taskId)
      .populate('caseId')
      .session(session);
    
    if (!task) {
      throw createError('任务不存在', 404);
    }
    
    if (task.caseId.consultantId.toString() !== userId) {
      throw createError('无权删除此任务', 403);
    }
    
    await CaseTask.findByIdAndDelete(taskId, { session });
    
    await CaseTimeline.create([{
      caseId: task.caseId._id,
      type: 'task-created',
      description: `删除了任务 "${task.title}"`,
      userId
    }], { session });
    
    await session.commitTransaction();
    session.endSession();
    
    return { success: true, message: '任务已成功删除' };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    
    if (error.statusCode) throw error;
    throw createError('删除任务失败', 500, error);
  }
};

/**
 * 获取案例笔记列表
 * @param {string} caseId - 案例ID
 * @param {Object} options - 查询选项
 * @returns {Promise<Array>} 笔记列表
 */
exports.getCaseNotes = async (caseId, options = {}) => {
  try {
    return await CaseNote.getCaseNotes(caseId, options);
  } catch (error) {
    throw createError('获取案例笔记失败', 500, error);
  }
};

/**
 * 创建案例笔记
 * @param {string} caseId - 案例ID
 * @param {Object} noteData - 笔记数据
 * @param {string} userId - 创建者ID
 * @returns {Promise<Object>} 创建的笔记
 */
exports.createCaseNote = async (caseId, noteData, userId) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const caseData = await Case.findById(caseId).session(session);
    
    if (!caseData) {
      throw createError('案例不存在', 404);
    }
    
    const newNote = new CaseNote({
      caseId,
      authorId: userId,
      ...noteData
    });
    
    await newNote.save({ session });
    
    await CaseTimeline.addNoteEvent(
      caseId,
      userId,
      newNote._id,
      newNote.isPrivate
    );
    
    await session.commitTransaction();
    session.endSession();
    
    return newNote;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    
    if (error.statusCode) throw error;
    throw createError('创建笔记失败', 500, error);
  }
};

/**
 * 更新案例笔记
 * @param {string} noteId - 笔记ID
 * @param {Object} updateData - 更新数据
 * @param {string} userId - 更新者ID
 * @returns {Promise<Object>} 更新后的笔记
 */
exports.updateCaseNote = async (noteId, updateData, userId) => {
  try {
    const note = await CaseNote.findById(noteId);
    
    if (!note) {
      throw createError('笔记不存在', 404);
    }
    
    if (note.authorId.toString() !== userId) {
      throw createError('无权更新此笔记', 403);
    }
    
    Object.keys(updateData).forEach(key => {
      note[key] = updateData[key];
    });
    
    await note.save();
    
    return note;
  } catch (error) {
    if (error.statusCode) throw error;
    throw createError('更新笔记失败', 500, error);
  }
};

/**
 * 删除案例笔记
 * @param {string} noteId - 笔记ID
 * @param {string} userId - 用户ID
 * @returns {Promise<Object>} 删除结果
 */
exports.deleteCaseNote = async (noteId, userId) => {
  try {
    const note = await CaseNote.findById(noteId);
    
    if (!note) {
      throw createError('笔记不存在', 404);
    }
    
    if (note.authorId.toString() !== userId) {
      throw createError('无权删除此笔记', 403);
    }
    
    await CaseNote.findByIdAndDelete(noteId);
    
    return { success: true, message: '笔记已成功删除' };
  } catch (error) {
    if (error.statusCode) throw error;
    throw createError('删除笔记失败', 500, error);
  }
};

/**
 * 获取案例文档列表
 * @param {string} caseId - 案例ID
 * @param {Object} options - 查询选项
 * @returns {Promise<Array>} 文档列表
 */
exports.getCaseDocuments = async (caseId, options = {}) => {
  try {
    return await CaseDocument.getCaseDocuments(caseId, options);
  } catch (error) {
    throw createError('获取案例文档失败', 500, error);
  }
};

/**
 * 上传案例文档
 * @param {string} caseId - 案例ID
 * @param {Object} documentData - 文档数据
 * @param {string} userId - 上传者ID
 * @returns {Promise<Object>} 上传的文档
 */
exports.uploadCaseDocument = async (caseId, documentData, userId) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const caseData = await Case.findById(caseId).session(session);
    
    if (!caseData) {
      throw createError('案例不存在', 404);
    }
    
    const newDocument = new CaseDocument({
      caseId,
      uploadedBy: userId,
      ...documentData
    });
    
    await newDocument.save({ session });
    
    await CaseTimeline.addDocumentEvent(
      caseId,
      userId,
      newDocument._id,
      newDocument.name,
      'uploaded'
    );
    
    await session.commitTransaction();
    session.endSession();
    
    return newDocument;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    
    if (error.statusCode) throw error;
    throw createError('上传文档失败', 500, error);
  }
};

/**
 * 更新案例文档
 * @param {string} documentId - 文档ID
 * @param {Object} updateData - 更新数据
 * @param {string} userId - 更新者ID
 * @returns {Promise<Object>} 更新后的文档
 */
exports.updateCaseDocument = async (documentId, updateData, userId) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const document = await CaseDocument.findById(documentId)
      .populate('caseId')
      .session(session);
    
    if (!document) {
      throw createError('文档不存在', 404);
    }
    
    if (document.caseId.consultantId.toString() !== userId && document.uploadedBy.toString() !== userId) {
      throw createError('无权更新此文档', 403);
    }
    
    if (updateData.url && updateData.url !== document.url) {
      await document.addVersion(updateData.url, userId, updateData.notes);
      
      await CaseTimeline.addDocumentEvent(
        document.caseId._id,
        userId,
        document._id,
        document.name,
        'updated'
      );
    } else {
      Object.keys(updateData).forEach(key => {
        if (key !== 'url') { // 避免重复更新URL
          document[key] = updateData[key];
        }
      });
      
      await document.save({ session });
    }
    
    await session.commitTransaction();
    session.endSession();
    
    return document;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    
    if (error.statusCode) throw error;
    throw createError('更新文档失败', 500, error);
  }
};

/**
 * 删除案例文档
 * @param {string} documentId - 文档ID
 * @param {string} userId - 用户ID
 * @returns {Promise<Object>} 删除结果
 */
exports.deleteCaseDocument = async (documentId, userId) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const document = await CaseDocument.findById(documentId)
      .populate('caseId')
      .session(session);
    
    if (!document) {
      throw createError('文档不存在', 404);
    }
    
    if (document.caseId.consultantId.toString() !== userId && document.uploadedBy.toString() !== userId) {
      throw createError('无权删除此文档', 403);
    }
    
    await CaseDocument.findByIdAndDelete(documentId, { session });
    
    await CaseTimeline.create([{
      caseId: document.caseId._id,
      type: 'document-upload',
      description: `删除了文档 "${document.name}"`,
      userId
    }], { session });
    
    await session.commitTransaction();
    session.endSession();
    
    return { success: true, message: '文档已成功删除' };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    
    if (error.statusCode) throw error;
    throw createError('删除文档失败', 500, error);
  }
};

/**
 * 获取案例时间线
 * @param {string} caseId - 案例ID
 * @param {Object} options - 查询选项
 * @returns {Promise<Array>} 时间线事件列表
 */
exports.getCaseTimeline = async (caseId, options = {}) => {
  try {
    return await CaseTimeline.getCaseTimeline(caseId, options);
  } catch (error) {
    throw createError('获取案例时间线失败', 500, error);
  }
};

/**
 * 添加里程碑事件
 * @param {string} caseId - 案例ID
 * @param {string} description - 事件描述
 * @param {Object} metadata - 元数据
 * @param {string} userId - 用户ID
 * @returns {Promise<Object>} 创建的事件
 */
exports.addMilestoneEvent = async (caseId, description, metadata, userId) => {
  try {
    const caseData = await Case.findById(caseId);
    
    if (!caseData) {
      throw createError('案例不存在', 404);
    }
    
    return await CaseTimeline.addMilestoneEvent(caseId, userId, description, metadata);
  } catch (error) {
    if (error.statusCode) throw error;
    throw createError('添加里程碑事件失败', 500, error);
  }
};

/**
 * 添加申请提交事件
 * @param {string} caseId - 案例ID
 * @param {string} description - 事件描述
 * @param {Object} metadata - 元数据
 * @param {string} userId - 用户ID
 * @returns {Promise<Object>} 创建的事件
 */
exports.addApplicationEvent = async (caseId, description, metadata, userId) => {
  try {
    const caseData = await Case.findById(caseId);
    
    if (!caseData) {
      throw createError('案例不存在', 404);
    }
    
    return await CaseTimeline.addApplicationEvent(caseId, userId, description, metadata);
  } catch (error) {
    if (error.statusCode) throw error;
    throw createError('添加申请提交事件失败', 500, error);
  }
};

/**
 * 添加决定接收事件
 * @param {string} caseId - 案例ID
 * @param {string} decision - 决定结果
 * @param {string} description - 事件描述
 * @param {Object} metadata - 元数据
 * @param {string} userId - 用户ID
 * @returns {Promise<Object>} 创建的事件
 */
exports.addDecisionEvent = async (caseId, decision, description, metadata, userId) => {
  try {
    const caseData = await Case.findById(caseId);
    
    if (!caseData) {
      throw createError('案例不存在', 404);
    }
    
    return await CaseTimeline.addDecisionEvent(caseId, userId, decision, description, metadata);
  } catch (error) {
    if (error.statusCode) throw error;
    throw createError('添加决定接收事件失败', 500, error);
  }
};

/**
 * 搜索案例
 * @param {string} consultantId - 顾问ID
 * @param {string} searchTerm - 搜索词
 * @param {Object} options - 查询选项
 * @returns {Promise<Array>} 搜索结果
 */
exports.searchCases = async (consultantId, searchTerm, options = {}) => {
  try {
    const query = {
      consultantId,
      $or: [
        { title: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } },
        { tags: { $regex: searchTerm, $options: 'i' } }
      ]
    };
    
    if (options.status) {
      query.status = options.status;
    }
    
    if (options.priority) {
      query.priority = options.priority;
    }
    
    if (options.type) {
      query.type = options.type;
    }
    
    const sort = options.sort || { createdAt: -1 };
    const page = options.page || 1;
    const limit = options.limit || 20;
    
    const cases = await Case.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('clientId', 'firstName lastName displayName email avatar');
    
    const total = await Case.countDocuments(query);
    
    return {
      cases,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    throw createError('搜索案例失败', 500, error);
  }
};

/**
 * 构建过滤查询对象
 * @param {Object} options - 查询选项
 * @returns {Object} 查询对象
 */
function buildFilterQuery(options) {
  const query = {};
  
  if (options.status) {
    query.status = options.status;
  }
  
  if (options.priority) {
    query.priority = options.priority;
  }
  
  if (options.type) {
    query.type = options.type;
  }
  
  if (options.search) {
    query.$or = [
      { title: { $regex: options.search, $options: 'i' } },
      { description: { $regex: options.search, $options: 'i' } },
      { tags: { $regex: options.search, $options: 'i' } }
    ];
  }
  
  return query;
}
