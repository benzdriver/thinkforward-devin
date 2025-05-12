/**
 * 顾问案例管理控制器
 * 处理案例管理相关的HTTP请求
 */

const consultantCaseService = require('../../../services/consultant/case/consultantCaseService');
const { validationResult } = require('express-validator');
const { createError } = require('../../../utils/errorHandler');

/**
 * 获取顾问的案例列表
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件函数
 */
exports.getConsultantCases = async (req, res, next) => {
  try {
    const { consultantId } = req.params;
    const { status, priority, type, search, sort, page, limit } = req.query;
    
    if (req.user.id !== consultantId && !req.user.isAdmin) {
      return next(createError('无权访问此资源', 403));
    }
    
    const options = {
      status,
      priority,
      type,
      search,
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 20
    };
    
    if (sort) {
      options.sort = {};
      const [field, order] = sort.split(':');
      options.sort[field] = order === 'desc' ? -1 : 1;
    }
    
    const result = await consultantCaseService.getConsultantCases(consultantId, options);
    
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * 获取客户的案例列表
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件函数
 */
exports.getClientCases = async (req, res, next) => {
  try {
    const { clientId } = req.params;
    const { status, sort, page, limit } = req.query;
    
    const options = {
      status,
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 20
    };
    
    if (sort) {
      options.sort = {};
      const [field, order] = sort.split(':');
      options.sort[field] = order === 'desc' ? -1 : 1;
    }
    
    const result = await consultantCaseService.getClientCases(clientId, options);
    
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * 获取案例详情
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件函数
 */
exports.getCaseById = async (req, res, next) => {
  try {
    const { caseId } = req.params;
    
    const caseData = await consultantCaseService.getCaseById(caseId);
    
    if (req.user.id !== caseData.consultantId.toString() && 
        req.user.id !== caseData.clientId.toString() && 
        !req.user.isAdmin) {
      return next(createError('无权访问此资源', 403));
    }
    
    res.status(200).json(caseData);
  } catch (error) {
    next(error);
  }
};

/**
 * 创建新案例
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件函数
 */
exports.createCase = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(createError('验证错误', 400, { errors: errors.array() }));
    }
    
    const { consultantId } = req.params;
    
    if (req.user.id !== consultantId && !req.user.isAdmin) {
      return next(createError('无权创建案例', 403));
    }
    
    const newCase = await consultantCaseService.createCase(req.body, req.user.id);
    
    res.status(201).json(newCase);
  } catch (error) {
    next(error);
  }
};

/**
 * 更新案例信息
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件函数
 */
exports.updateCase = async (req, res, next) => {
  try {
    const { caseId } = req.params;
    
    const updatedCase = await consultantCaseService.updateCase(caseId, req.body, req.user.id);
    
    res.status(200).json(updatedCase);
  } catch (error) {
    next(error);
  }
};

/**
 * 删除案例
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件函数
 */
exports.deleteCase = async (req, res, next) => {
  try {
    const { caseId } = req.params;
    
    const result = await consultantCaseService.deleteCase(caseId, req.user.id);
    
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * 获取案例统计数据
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件函数
 */
exports.getCaseStats = async (req, res, next) => {
  try {
    const { consultantId } = req.params;
    
    if (req.user.id !== consultantId && !req.user.isAdmin) {
      return next(createError('无权访问此资源', 403));
    }
    
    const stats = await consultantCaseService.getCaseStats(consultantId);
    
    res.status(200).json(stats);
  } catch (error) {
    next(error);
  }
};

/**
 * 获取即将到期的案例
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件函数
 */
exports.getUpcomingDeadlines = async (req, res, next) => {
  try {
    const { consultantId } = req.params;
    const { limit } = req.query;
    
    if (req.user.id !== consultantId && !req.user.isAdmin) {
      return next(createError('无权访问此资源', 403));
    }
    
    const cases = await consultantCaseService.getUpcomingDeadlines(consultantId, parseInt(limit) || 5);
    
    res.status(200).json(cases);
  } catch (error) {
    next(error);
  }
};

/**
 * 更新案例进度
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件函数
 */
exports.updateCaseProgress = async (req, res, next) => {
  try {
    const { caseId } = req.params;
    const { progress } = req.body;
    
    if (progress === undefined || progress < 0 || progress > 100) {
      return next(createError('进度值必须在0-100之间', 400));
    }
    
    const updatedCase = await consultantCaseService.updateCaseProgress(caseId, progress, req.user.id);
    
    res.status(200).json(updatedCase);
  } catch (error) {
    next(error);
  }
};

/**
 * 获取案例任务列表
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件函数
 */
exports.getCaseTasks = async (req, res, next) => {
  try {
    const { caseId } = req.params;
    const { status, assigneeId, sort } = req.query;
    
    const options = { status, assigneeId };
    
    if (sort) {
      options.sort = {};
      const [field, order] = sort.split(':');
      options.sort[field] = order === 'desc' ? -1 : 1;
    }
    
    const tasks = await consultantCaseService.getCaseTasks(caseId, options);
    
    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};

/**
 * 创建案例任务
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件函数
 */
exports.createCaseTask = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(createError('验证错误', 400, { errors: errors.array() }));
    }
    
    const { caseId } = req.params;
    
    const newTask = await consultantCaseService.createCaseTask(caseId, req.body, req.user.id);
    
    res.status(201).json(newTask);
  } catch (error) {
    next(error);
  }
};

/**
 * 更新案例任务
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件函数
 */
exports.updateCaseTask = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    
    const updatedTask = await consultantCaseService.updateCaseTask(taskId, req.body, req.user.id);
    
    res.status(200).json(updatedTask);
  } catch (error) {
    next(error);
  }
};

/**
 * 删除案例任务
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件函数
 */
exports.deleteCaseTask = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    
    const result = await consultantCaseService.deleteCaseTask(taskId, req.user.id);
    
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * 获取案例笔记列表
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件函数
 */
exports.getCaseNotes = async (req, res, next) => {
  try {
    const { caseId } = req.params;
    const { isPrivate, authorId, category, sort } = req.query;
    
    const options = {
      isPrivate: isPrivate === 'true',
      authorId,
      category
    };
    
    if (sort) {
      options.sort = {};
      const [field, order] = sort.split(':');
      options.sort[field] = order === 'desc' ? -1 : 1;
    }
    
    const notes = await consultantCaseService.getCaseNotes(caseId, options);
    
    res.status(200).json(notes);
  } catch (error) {
    next(error);
  }
};

/**
 * 创建案例笔记
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件函数
 */
exports.createCaseNote = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(createError('验证错误', 400, { errors: errors.array() }));
    }
    
    const { caseId } = req.params;
    
    const newNote = await consultantCaseService.createCaseNote(caseId, req.body, req.user.id);
    
    res.status(201).json(newNote);
  } catch (error) {
    next(error);
  }
};

/**
 * 更新案例笔记
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件函数
 */
exports.updateCaseNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;
    
    const updatedNote = await consultantCaseService.updateCaseNote(noteId, req.body, req.user.id);
    
    res.status(200).json(updatedNote);
  } catch (error) {
    next(error);
  }
};

/**
 * 删除案例笔记
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件函数
 */
exports.deleteCaseNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;
    
    const result = await consultantCaseService.deleteCaseNote(noteId, req.user.id);
    
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * 获取案例文档列表
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件函数
 */
exports.getCaseDocuments = async (req, res, next) => {
  try {
    const { caseId } = req.params;
    const { type, category, status, sort } = req.query;
    
    const options = { type, category, status };
    
    if (sort) {
      options.sort = {};
      const [field, order] = sort.split(':');
      options.sort[field] = order === 'desc' ? -1 : 1;
    }
    
    const documents = await consultantCaseService.getCaseDocuments(caseId, options);
    
    res.status(200).json(documents);
  } catch (error) {
    next(error);
  }
};

/**
 * 上传案例文档
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件函数
 */
exports.uploadCaseDocument = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(createError('验证错误', 400, { errors: errors.array() }));
    }
    
    const { caseId } = req.params;
    
    const newDocument = await consultantCaseService.uploadCaseDocument(caseId, req.body, req.user.id);
    
    res.status(201).json(newDocument);
  } catch (error) {
    next(error);
  }
};

/**
 * 更新案例文档
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件函数
 */
exports.updateCaseDocument = async (req, res, next) => {
  try {
    const { documentId } = req.params;
    
    const updatedDocument = await consultantCaseService.updateCaseDocument(documentId, req.body, req.user.id);
    
    res.status(200).json(updatedDocument);
  } catch (error) {
    next(error);
  }
};

/**
 * 删除案例文档
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件函数
 */
exports.deleteCaseDocument = async (req, res, next) => {
  try {
    const { documentId } = req.params;
    
    const result = await consultantCaseService.deleteCaseDocument(documentId, req.user.id);
    
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * 获取案例时间线
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件函数
 */
exports.getCaseTimeline = async (req, res, next) => {
  try {
    const { caseId } = req.params;
    const { type, isImportant, startDate, endDate, sort, page, limit } = req.query;
    
    const options = {
      type,
      isImportant: isImportant === 'true',
      startDate,
      endDate,
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 50
    };
    
    if (sort) {
      options.sort = {};
      const [field, order] = sort.split(':');
      options.sort[field] = order === 'desc' ? -1 : 1;
    }
    
    const timeline = await consultantCaseService.getCaseTimeline(caseId, options);
    
    res.status(200).json(timeline);
  } catch (error) {
    next(error);
  }
};

/**
 * 添加里程碑事件
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件函数
 */
exports.addMilestoneEvent = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(createError('验证错误', 400, { errors: errors.array() }));
    }
    
    const { caseId } = req.params;
    const { description, metadata } = req.body;
    
    const event = await consultantCaseService.addMilestoneEvent(caseId, description, metadata, req.user.id);
    
    res.status(201).json(event);
  } catch (error) {
    next(error);
  }
};

/**
 * 添加申请提交事件
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件函数
 */
exports.addApplicationEvent = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(createError('验证错误', 400, { errors: errors.array() }));
    }
    
    const { caseId } = req.params;
    const { description, metadata } = req.body;
    
    const event = await consultantCaseService.addApplicationEvent(caseId, description, metadata, req.user.id);
    
    res.status(201).json(event);
  } catch (error) {
    next(error);
  }
};

/**
 * 添加决定接收事件
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件函数
 */
exports.addDecisionEvent = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(createError('验证错误', 400, { errors: errors.array() }));
    }
    
    const { caseId } = req.params;
    const { decision, description, metadata } = req.body;
    
    const event = await consultantCaseService.addDecisionEvent(caseId, decision, description, metadata, req.user.id);
    
    res.status(201).json(event);
  } catch (error) {
    next(error);
  }
};

/**
 * 搜索案例
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件函数
 */
exports.searchCases = async (req, res, next) => {
  try {
    const { consultantId } = req.params;
    const { searchTerm, status, priority, type, sort, page, limit } = req.query;
    
    if (req.user.id !== consultantId && !req.user.isAdmin) {
      return next(createError('无权访问此资源', 403));
    }
    
    if (!searchTerm) {
      return next(createError('搜索词不能为空', 400));
    }
    
    const options = {
      status,
      priority,
      type,
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 20
    };
    
    if (sort) {
      options.sort = {};
      const [field, order] = sort.split(':');
      options.sort[field] = order === 'desc' ? -1 : 1;
    }
    
    const result = await consultantCaseService.searchCases(consultantId, searchTerm, options);
    
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
