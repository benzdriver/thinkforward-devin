/**
 * ThinkForward AI 后端应用入口
 */

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { errorHandler } = require('./middleware/errorMiddleware');
const { localeMiddleware } = require('./middleware/localeMiddleware');

const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const expressEntryRoutes = require('./routes/canada/expressEntryRoutes');
const assessmentRoutes = require('./routes/assessment/assessmentRoutes');
const pathwayRoutes = require('./routes/pathway/pathwayRoutes');
const formRoutes = require('./routes/forms/formRoutes');
const consultantRoutes = require('./routes/consultant/consultantRoutes');
const bookingRoutes = require('./routes/consultant/bookingRoutes');
const profileSettingsRoutes = require('./routes/settings/profileSettingsRoutes');
const adminSettingsRoutes = require('./routes/admin/adminSettingsRoutes');
const consultantDashboardRoutes = require('./routes/consultant/consultantDashboardRoutes');
const consultantClientRoutes = require('./routes/consultant/client/consultantClientRoutes');
const consultantCaseRoutes = require('./routes/consultant/case/consultantCaseRoutes');

const app = express();

require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/thinkforward', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
})
.then(() => console.log('MongoDB连接成功'))
.catch(err => console.error('MongoDB连接失败:', err));

app.use(helmet()); // 安全HTTP头
app.use(compression()); // 响应压缩
app.use(cors()); // 跨域资源共享
app.use(express.json()); // 解析JSON请求体
app.use(express.urlencoded({ extended: true })); // 解析URL编码的请求体
app.use(morgan('dev')); // 请求日志
app.use(localeMiddleware); // 本地化中间件

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100, // 每个IP在windowMs内最多100个请求
  standardHeaders: true,
  legacyHeaders: false,
  message: '请求过于频繁，请稍后再试'
});
app.use('/api/', apiLimiter);

app.use('/api/auth', authRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/express-entry', expressEntryRoutes);
app.use('/api/assessment', assessmentRoutes);
app.use('/api/pathways', pathwayRoutes);
app.use('/api/forms', formRoutes);
app.use('/api/consultants', consultantRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/profile-settings', profileSettingsRoutes);
app.use('/api/admin/settings', adminSettingsRoutes);
app.use('/api/consultant-dashboard', consultantDashboardRoutes);
app.use('/api/consultant-clients', consultantClientRoutes);
app.use('/api/consultant-cases', consultantCaseRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', version: process.env.APP_VERSION || '1.0.0' });
});

app.get('/api-docs', (req, res) => {
  res.redirect('/api-docs/index.html');
});

app.use(errorHandler);

app.use((req, res) => {
  res.status(404).json({ message: '请求的资源不存在' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
});

module.exports = app;
