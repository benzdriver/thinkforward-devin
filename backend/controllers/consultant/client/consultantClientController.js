/**
 * 顾问客户管理控制器
 * 处理顾问客户管理相关的HTTP请求
 */

const consultantClientService = require('../../../services/consultant/client/consultantClientService');
const { validationResult } = require('express-validator');

/**
 * 获取客户列表
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件函数
 */
const getClients = async (req, res, next) => {
  try {
    const { consultantId } = req.params;
    const { status, search, sort, page = 1, limit = 20 } = req.query;
    
    if (req.user.id !== consultantId && !req.user.isAdmin) {
      return res.status(403).json({ 
        success: false, 
        message: '无权访问此资源' 
      });
    }
    
    const options = {
      status,
      search,
      skip: (page - 1) * limit,
      limit: parseInt(limit)
    };
    
    if (sort) {
      const [field, order] = sort.split(':');
      options.sort = { [field]: order === 'desc' ? -1 : 1 };
    }
    
    const clients = await consultantClientService.getClients(consultantId, options);
    
    const total = await consultantClientService.getClientStats(consultantId);
    
    res.status(200).json({
      success: true,
      data: {
        clients,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: total.total
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 获取客户统计数据
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件函数
 */
const getClientStats = async (req, res, next) => {
  try {
    const { consultantId } = req.params;
    
    if (req.user.id !== consultantId && !req.user.isAdmin) {
      return res.status(403).json({ 
        success: false, 
        message: '无权访问此资源' 
      });
    }
    
    const stats = await consultantClientService.getClientStats(consultantId);
    
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 获取单个客户详情
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件函数
 */
const getClientById = async (req, res, next) => {
  try {
    const { consultantId, clientId } = req.params;
    
    if (req.user.id !== consultantId && !req.user.isAdmin) {
      return res.status(403).json({ 
        success: false, 
        message: '无权访问此资源' 
      });
    }
    
    const client = await consultantClientService.getClientById(clientId, consultantId);
    
    res.status(200).json({
      success: true,
      data: client
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 创建新客户
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件函数
 */
const createClient = async (req, res, next) => {
  try {
    const { consultantId } = req.params;
    
    if (req.user.id !== consultantId && !req.user.isAdmin) {
      return res.status(403).json({ 
        success: false, 
        message: '无权访问此资源' 
      });
    }
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }
    
    const clientData = req.body;
    const client = await consultantClientService.createClient(clientData, consultantId);
    
    res.status(201).json({
      success: true,
      data: client
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 更新客户信息
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件函数
 */
const updateClient = async (req, res, next) => {
  try {
    const { consultantId, clientId } = req.params;
    
    if (req.user.id !== consultantId && !req.user.isAdmin) {
      return res.status(403).json({ 
        success: false, 
        message: '无权访问此资源' 
      });
    }
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }
    
    const updateData = req.body;
    const client = await consultantClientService.updateClient(clientId, updateData, consultantId);
    
    res.status(200).json({
      success: true,
      data: client
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 删除客户
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件函数
 */
const deleteClient = async (req, res, next) => {
  try {
    const { consultantId, clientId } = req.params;
    
    if (req.user.id !== consultantId && !req.user.isAdmin) {
      return res.status(403).json({ 
        success: false, 
        message: '无权访问此资源' 
      });
    }
    
    await consultantClientService.deleteClient(clientId, consultantId);
    
    res.status(200).json({
      success: true,
      message: '客户已成功删除'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 添加客户标签
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件函数
 */
const addClientTag = async (req, res, next) => {
  try {
    const { consultantId, clientId } = req.params;
    const { tag, color } = req.body;
    
    if (req.user.id !== consultantId && !req.user.isAdmin) {
      return res.status(403).json({ 
        success: false, 
        message: '无权访问此资源' 
      });
    }
    
    if (!tag) {
      return res.status(400).json({ 
        success: false, 
        message: '标签不能为空' 
      });
    }
    
    const clientTag = await consultantClientService.addClientTag(clientId, tag, color, req.user.id);
    
    res.status(201).json({
      success: true,
      data: clientTag
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 移除客户标签
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件函数
 */
const removeClientTag = async (req, res, next) => {
  try {
    const { consultantId, clientId, tag } = req.params;
    
    if (req.user.id !== consultantId && !req.user.isAdmin) {
      return res.status(403).json({ 
        success: false, 
        message: '无权访问此资源' 
      });
    }
    
    await consultantClientService.removeClientTag(clientId, tag, consultantId);
    
    res.status(200).json({
      success: true,
      message: '标签已成功移除'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 添加客户笔记
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件函数
 */
const addClientNote = async (req, res, next) => {
  try {
    const { consultantId, clientId } = req.params;
    
    if (req.user.id !== consultantId && !req.user.isAdmin) {
      return res.status(403).json({ 
        success: false, 
        message: '无权访问此资源' 
      });
    }
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }
    
    const noteData = {
      ...req.body,
      clientId,
      consultantId
    };
    
    const note = await consultantClientService.addClientNote(noteData, consultantId);
    
    res.status(201).json({
      success: true,
      data: note
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 获取客户笔记
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件函数
 */
const getClientNotes = async (req, res, next) => {
  try {
    const { consultantId, clientId } = req.params;
    const { category, isPrivate, page = 1, limit = 20 } = req.query;
    
    if (req.user.id !== consultantId && !req.user.isAdmin) {
      return res.status(403).json({ 
        success: false, 
        message: '无权访问此资源' 
      });
    }
    
    const options = {
      category,
      isPrivate: isPrivate === 'true',
      skip: (page - 1) * limit,
      limit: parseInt(limit)
    };
    
    const notes = await consultantClientService.getClientNotes(clientId, consultantId, options);
    
    res.status(200).json({
      success: true,
      data: notes
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 获取客户活动
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件函数
 */
const getClientActivities = async (req, res, next) => {
  try {
    const { consultantId, clientId } = req.params;
    const { type, isRead, page = 1, limit = 20 } = req.query;
    
    if (req.user.id !== consultantId && !req.user.isAdmin) {
      return res.status(403).json({ 
        success: false, 
        message: '无权访问此资源' 
      });
    }
    
    const options = {
      type,
      isRead: isRead === 'true',
      skip: (page - 1) * limit,
      limit: parseInt(limit)
    };
    
    const activities = await consultantClientService.getClientActivities(clientId, consultantId, options);
    
    res.status(200).json({
      success: true,
      data: activities
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 搜索客户
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件函数
 */
const searchClients = async (req, res, next) => {
  try {
    const { consultantId } = req.params;
    const { q, limit = 10 } = req.query;
    
    if (req.user.id !== consultantId && !req.user.isAdmin) {
      return res.status(403).json({ 
        success: false, 
        message: '无权访问此资源' 
      });
    }
    
    if (!q) {
      return res.status(400).json({ 
        success: false, 
        message: '搜索词不能为空' 
      });
    }
    
    const clients = await consultantClientService.searchClients(consultantId, q, parseInt(limit));
    
    res.status(200).json({
      success: true,
      data: clients
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 获取顾问的所有标签
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件函数
 */
const getConsultantTags = async (req, res, next) => {
  try {
    const { consultantId } = req.params;
    
    if (req.user.id !== consultantId && !req.user.isAdmin) {
      return res.status(403).json({ 
        success: false, 
        message: '无权访问此资源' 
      });
    }
    
    const tags = await consultantClientService.getConsultantTags(consultantId);
    
    res.status(200).json({
      success: true,
      data: tags
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 根据标签查找客户
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件函数
 */
const findClientsByTag = async (req, res, next) => {
  try {
    const { consultantId } = req.params;
    const { tag } = req.query;
    
    if (req.user.id !== consultantId && !req.user.isAdmin) {
      return res.status(403).json({ 
        success: false, 
        message: '无权访问此资源' 
      });
    }
    
    if (!tag) {
      return res.status(400).json({ 
        success: false, 
        message: '标签不能为空' 
      });
    }
    
    const clients = await consultantClientService.findClientsByTag(consultantId, tag);
    
    res.status(200).json({
      success: true,
      data: clients
    });
  } catch (error) {
    next(error);
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
  getClientActivities,
  searchClients,
  getConsultantTags,
  findClientsByTag
};
