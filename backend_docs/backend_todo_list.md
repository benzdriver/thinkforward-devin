# ThinkForward AI Backend To-Do List

Based on analysis of the frontend code and structure, this document outlines the backend components needed to support the ThinkForward AI immigration platform.

## 1. Authentication Module

### Models
- **User Model**
  - Fields: name, email, password (hashed), role, createdAt, updatedAt
  - Methods: comparePassword, generateAuthToken, generateRefreshToken

### Controllers
- **authController**
  - login: Authenticate users and generate tokens
  - register: Create new user accounts
  - logout: Invalidate tokens
  - resetPassword: Send password reset emails
  - changePassword: Update user passwords
  - refreshToken: Generate new tokens using refresh token
  - validateToken: Verify token validity

### Services
- **authService**
  - authenticateUser: Verify credentials
  - createUser: Register new users
  - generateTokens: Create JWT tokens
  - verifyToken: Validate token authenticity
  - hashPassword: Securely hash passwords
  - sendPasswordResetEmail: Email password reset links

### Routes
- POST /api/auth/login
- POST /api/auth/register
- POST /api/auth/logout
- POST /api/auth/reset-password
- POST /api/auth/change-password
- POST /api/auth/refresh-token
- GET /api/auth/validate-token

## 2. Profile Module

### Models
- **Profile Model**
  - Fields: userId, personalInfo, educationInfo, workExperience, languageSkills, immigrationInfo, createdAt, updatedAt
  - Relationships: Belongs to User

### Controllers
- **profileController**
  - getProfile: Retrieve user profile
  - updateProfile: Update entire profile
  - updatePersonalInfo: Update personal information section
  - updateEducationInfo: Update education information section
  - updateWorkExperience: Update work experience section
  - updateLanguageSkills: Update language skills section
  - updateImmigrationInfo: Update immigration information section

### Services
- **profileService**
  - fetchProfile: Get profile by userId
  - saveProfile: Create or update profile
  - updateProfileSection: Update specific profile sections

### Routes
- GET /api/profile/:userId
- PATCH /api/profile/:userId
- PATCH /api/profile/:userId/personal-info
- PATCH /api/profile/:userId/education-info
- PATCH /api/profile/:userId/work-experience
- PATCH /api/profile/:userId/language-skills
- PATCH /api/profile/:userId/immigration-info

## 3. Express Entry Module

### Models
- **ExpressEntryProfile Model**
  - Fields: userId, age, maritalStatus, languageProficiency, education, workExperience, adaptabilityFactors, etc.

### Controllers
- **expressEntryController**
  - calculatePoints: Calculate CRS points
  - checkEligibility: Check program eligibility
  - getLatestDraws: Fetch recent Express Entry draws
  - saveProfile: Create or update Express Entry profile
  - getProfile: Retrieve Express Entry profile
  - getQuickEstimate: Calculate quick CRS estimate

### Services
- **expressEntryService**
  - calculateCRSPoints: Calculate comprehensive ranking system points
  - checkProgramEligibility: Verify eligibility for Express Entry programs
  - fetchLatestDraws: Get recent Express Entry draws
  - saveUserProfile: Store Express Entry profile
  - fetchUserProfile: Retrieve Express Entry profile
  - calculateQuickEstimate: Generate quick CRS score estimate

### Routes
- POST /api/canada/express-entry/calculate-score
- POST /api/canada/express-entry/check-eligibility
- GET /api/canada/express-entry/latest-draws
- POST /api/canada/express-entry/profile
- GET /api/canada/express-entry/profile
- POST /api/canada/express-entry/quick-estimate

## 4. Assessment Module

### Models
- **Assessment Model**
  - Fields: userId, type (comprehensive, express, targeted), status, startedAt, completedAt, results
  - Relationships: Belongs to User, Has many AssessmentResponses

- **AssessmentQuestion Model**
  - Fields: questionText, type, options, category, assessmentType, order
  - Relationships: Has many AssessmentResponses

- **AssessmentResponse Model**
  - Fields: assessmentId, questionId, response, score
  - Relationships: Belongs to Assessment, Belongs to AssessmentQuestion

- **AssessmentResult Model**
  - Fields: assessmentId, scores, recommendations, pathways
  - Relationships: Belongs to Assessment

### Controllers
- **assessmentController**
  - getAssessmentTypes: List available assessment types
  - startAssessment: Initialize new assessment
  - getQuestion: Fetch assessment question
  - submitResponse: Save user response
  - getProgress: Check assessment completion status
  - getResult: Generate assessment results
  - listUserAssessments: Get user's assessment history

### Services
- **assessmentService**
  - createAssessment: Initialize assessment session
  - fetchQuestions: Get questions by assessment type
  - processResponse: Save and score responses
  - calculateProgress: Track assessment completion
  - generateResults: Analyze responses and create results
  - recommendPathways: Suggest immigration pathways based on results

### Routes
- GET /api/assessment/types
- POST /api/assessment/start
- GET /api/assessment/:id/questions/:step
- POST /api/assessment/:id/responses
- GET /api/assessment/:id/progress
- GET /api/assessment/:id/result
- GET /api/assessment/user/:userId

## 5. Pathways Module

### Models
- **Pathway Model**
  - Fields: name, code, country, category, description, eligibilityCriteria, processingTime, applicationFee, requiredDocuments, steps, officialLink, isActive, popularity, successRate, translations, metadata
  - Methods: getTranslation, checkEligibility

- **PathwayApplication Model**
  - Fields: userId, pathwayId, status, submittedAt, lastUpdatedAt, notes, documents, timeline, feedback, metadata
  - Methods: updateStatus, submit, addDocument, updateDocumentStatus, addFeedback
  - Relationships: Belongs to User, Belongs to Pathway

- **Consultant Model**
  - Fields: name, email, phone, profileImage, specialization, countries, experience, languages, credentials, rating, reviews, availability, fees, bio, website, socialMedia, location, isVerified, isActive, metadata
  - Methods: addReview, updateAvailability, findBySpecialization, findByLanguage, findByLocation
  - Relationships: Has many ConsultantMatches

- **ConsultantMatch Model**
  - Fields: userId, consultantId, pathwayId, status, matchScore, requestDetails, consultantResponse, appointment, communication, feedback, createdAt, updatedAt, metadata
  - Methods: updateStatus, addConsultantResponse, scheduleAppointment, addMessage, addUserFeedback, addConsultantFeedback, findByUser, findByConsultant, findByPathway
  - Relationships: Belongs to User, Belongs to Consultant, Belongs to Pathway

### Controllers
- **pathwayController**
  - getAllPathways: Get all immigration pathways
  - getPathwayById: Fetch pathway by ID
  - getPathwayByCode: Fetch pathway by code
  - checkEligibility: Check user eligibility for pathway
  - getRecommendedPathways: Get personalized pathway recommendations
  - getPathwayCategories: Get pathway categories
  - getPathwayCountries: Get countries with pathways
  - createPathway: Create new pathway (admin only)
  - updatePathway: Update pathway (admin only)
  - deletePathway: Delete pathway (admin only)

### Services
- **pathwayService**
  - getAllPathways: Get pathways with filtering
  - getPathwayById: Retrieve pathway by ID
  - getPathwayByCode: Retrieve pathway by code
  - checkEligibility: Check user eligibility for pathway
  - getRecommendedPathways: Get personalized pathway recommendations
  - getPathwayCategories: Get pathway categories
  - getPathwayCountries: Get countries with pathways
  - createPathway: Create new pathway (admin only)
  - updatePathway: Update pathway (admin only)
  - deletePathway: Delete pathway (admin only)

### Routes
- GET /api/pathway - Get all pathways
- GET /api/pathway/categories - Get pathway categories
- GET /api/pathway/countries - Get pathway countries
- GET /api/pathway/id/:id - Get pathway by ID
- GET /api/pathway/code/:code - Get pathway by code
- POST /api/pathway/eligibility/:id - Check pathway eligibility
- POST /api/pathway/recommendations - Get recommended pathways
- POST /api/pathway - Create new pathway (admin only)
- PUT /api/pathway/:id - Update pathway (admin only)
- DELETE /api/pathway/:id - Delete pathway (admin only)

## 6. Utilities and Middleware

### Utilities
- **errorHandler**
  - translateError: Localize error messages
  - formatValidationErrors: Format validation error responses

- **localization**
  - translateMessage: Translate messages based on locale

- **apiClient**
  - fetchExternalData: Get data from external immigration APIs

### Middleware
- **authMiddleware**
  - verifyToken: Authenticate API requests
  - checkRole: Verify user permissions

- **localeMiddleware**
  - setLocale: Set response language based on request

- **errorMiddleware**
  - handleErrors: Global error handling

## 7. Form Generation Module

### Models
- **Form Model**
  - Fields: userId, formType, formData, status, validationResults, generatedDate, lastUpdated, downloadUrl, version
  - Methods: getValidationErrors, getValidationWarnings, hasValidationErrors, addValidationResult, clearValidationResults

- **FormType Model**
  - Fields: id, name, description, category, country, templateId, isActive, metadata
  - Methods: findActiveFormTypes, findByCategory, findByCountry

- **FormTemplate Model**
  - Fields: id, name, structure, version, validationRules, pdfTemplate, fieldMappings, isActive, metadata
  - Methods: getStructure, getValidationRules, getFieldMappings, findByTemplateId, findLatestVersion

### Controllers
- **formController**
  - getFormTypes: List available form types
  - getUserForms: Get user's forms
  - getForm: Get specific form
  - generateForm: Create new form
  - updateForm: Update entire form
  - updateFormField: Update specific form field
  - getFormDownload: Get form download link

### Services
- **formService**
  - getFormTypes: Get form types with filtering
  - getUserForms: Get forms by userId
  - getFormById: Get form by ID
  - generateForm: Create new form
  - updateForm: Update form data
  - updateFormField: Update specific form field
  - getFormDownloadUrl: Generate form download URL

- **formValidationService**
  - validateForm: Validate form data against rules
  - validateField: Validate specific field
  - getValidationRules: Get validation rules for form type

- **pdfGenerationService**
  - generatePdf: Generate PDF from form data
  - savePdfAndGetUrl: Save PDF and return URL

- **dataMappingService**
  - mapUserDataToForm: Map user profile data to form fields
  - getNestedValue: Get value from nested object
  - setNestedValue: Set value in nested object
  - applyTransform: Apply transformation to field value

### Routes
- GET /api/forms/types - Get form types
- GET /api/forms/:userId - Get user's forms
- GET /api/forms/:userId/:formId - Get specific form
- POST /api/forms/:userId/generate - Generate new form
- PUT /api/forms/:userId/:formId - Update form
- PATCH /api/forms/:userId/:formId/field - Update form field
- GET /api/forms/:userId/:formId/download - Get form download

## 8. Consultant Matching Module

### Models
- **Consultant Model** (扩展现有模型)
  - 新增字段: avatar, title, company, specialties, languages, experience, rating, successRate, price, availability, bio, education, certifications, reviewCount, reviews
  - 新增方法: getAvailability, getReviews, updateAvailability, addReview

- **ConsultantReview Model**
  - Fields: consultantId, userId, userName, rating, comment, date, isVerified, isActive
  - Methods: verifyReview, findByConsultant, findByUser

- **ConsultantAvailability Model**
  - Fields: consultantId, date, slots, isRecurring, recurringPattern, createdAt, updatedAt
  - Methods: findAvailableSlots, addSlot, removeSlot, updateSlot

- **MatchResult Model**
  - Fields: userId, consultantId, score, matchReasons, createdAt
  - Methods: findByUser, findByConsultant

- **Booking Model**
  - Fields: userId, consultantId, date, startTime, endTime, type, status, topic, questions, notes, paymentStatus, paymentAmount, paymentCurrency, meetingLink, createdAt, updatedAt
  - Methods: updateStatus, cancel, reschedule, addMeetingLink, findByUser, findByConsultant

### Controllers
- **consultantController**
  - getConsultants: Get consultants with filtering
  - getConsultant: Get consultant by ID
  - getConsultantAvailability: Get consultant availability
  - getConsultantReviews: Get consultant reviews
  - matchConsultants: Match consultants to user
  - updateConsultant: Update consultant (admin only)
  - addConsultantReview: Add review for consultant

- **bookingController**
  - getUserBookings: Get user's bookings
  - getBooking: Get booking by ID
  - createBooking: Create new booking
  - updateBooking: Update booking
  - cancelBooking: Cancel booking
  - getBookingStatus: Check booking status

### Services
- **consultantService**
  - getConsultants: Get consultants with filtering
  - getConsultantById: Get consultant by ID
  - getConsultantAvailability: Get consultant availability
  - getConsultantReviews: Get consultant reviews
  - updateConsultant: Update consultant information
  - addConsultantReview: Add review for consultant

- **consultantMatchingService**
  - matchConsultantsToUser: Match consultants based on user profile
  - calculateMatchScore: Calculate match score
  - generateMatchReasons: Generate match reasons
  - saveMatchResults: Save match results

- **bookingService**
  - getUserBookings: Get bookings by userId
  - getBookingById: Get booking by ID
  - createBooking: Create new booking
  - updateBooking: Update booking details
  - cancelBooking: Cancel booking
  - checkAvailability: Check slot availability
  - sendBookingNotifications: Send booking notifications

### Routes
- GET /api/consultants - Get consultants with filtering
- GET /api/consultants/:consultantId - Get consultant by ID
- GET /api/consultants/:consultantId/availability - Get consultant availability
- GET /api/consultants/:consultantId/reviews - Get consultant reviews
- POST /api/consultants/match - Match consultants to user
- POST /api/consultants/:consultantId/reviews - Add review for consultant
- GET /api/bookings - Get user's bookings
- GET /api/bookings/:bookingId - Get booking by ID
- POST /api/bookings - Create new booking
- PUT /api/bookings/:bookingId - Update booking
- POST /api/bookings/:bookingId/cancel - Cancel booking

## 9. Database Schema

### Collections/Tables
- Users
- Profiles
- ExpressEntryProfiles
- Assessments
- AssessmentQuestions
- AssessmentResponses
- AssessmentResults
- Pathways
- PathwayApplications
- Consultants
- ConsultantReviews
- ConsultantAvailability
- MatchResults
- Bookings
- Forms
- FormTypes
- FormTemplates

## 10. Implementation Status

### 已完成模块

1. ✅ Authentication Module (Core functionality)
2. ✅ Profile Module (User data management)
3. ✅ Express Entry Module
4. ✅ Assessment Module (User evaluation)
5. ✅ Pathways Module (Immigration options)
   - ✅ Pathway Model
   - ✅ PathwayApplication Model
   - ✅ Consultant Model (基础版本)
   - ✅ ConsultantMatch Model
6. ✅ Utilities and Middleware (Support components)
   - ✅ Error Handler
   - ✅ Localization
   - ✅ API Client
   - ✅ Auth Middleware
   - ✅ Locale Middleware
   - ✅ Error Middleware
7. ✅ Form Generation Module
   - ✅ Form Model
   - ✅ FormType Model
   - ✅ FormTemplate Model
   - ✅ Form Service
   - ✅ Form Validation Service
   - ✅ PDF Generation Service
   - ✅ Data Mapping Service
   - ✅ Form Controller
   - ✅ Form Routes
8. ✅ Consultant Matching Module
   - ✅ Consultant Model (扩展)
   - ✅ ConsultantReview Model
   - ✅ ConsultantAvailability Model
   - ✅ MatchResult Model
   - ✅ Booking Model
   - ✅ Consultant Service
   - ✅ Consultant Matching Service
   - ✅ Booking Service
   - ✅ Consultant Controller
   - ✅ Booking Controller
   - ✅ Consultant Routes
   - ✅ Booking Routes
9. ✅ Profile Data Structure Alignment (新增)
   - ✅ 更新 Profile Model 以匹配前端数据结构
     - ✅ 添加 passportNumber 字段到 personalInfo
     - ✅ 添加 email 字段到 personalInfo
     - ✅ 修改 educationInfo 从数组改为对象结构
     - ✅ 修改 workExperience 从数组改为对象结构
     - ✅ 修改 languageSkills 从数组改为对象结构
     - ✅ 更新 immigrationInfo 字段以匹配前端结构
   - ✅ 更新 profileController 以处理新的数据结构
   - ✅ 更新 profileService 以支持新的数据结构
   - ✅ 更新 profileRoutes 中的验证规则
10. ✅ Profile Settings Module (新增)
    - ✅ Models
      - ✅ AccountSettings Model
        - 字段: userId, email, emailVerified, phone, phoneVerified, language, timezone, dateFormat, timeFormat, currency, twoFactorEnabled, twoFactorMethod, updatedAt
      - ✅ NotificationSettings Model
        - 字段: userId, email (marketing, updates, security, reminders), push (messages, taskUpdates, appointments, documentUpdates), sms (security, appointments, importantUpdates), updatedAt
      - ✅ PrivacySettings Model
        - 字段: userId, profileVisibility, activityVisibility, documentVisibility, shareDataWithPartners, allowPersonalizedRecommendations, allowAnonymousDataCollection, allowSearchEngineIndexing, cookies, dataSharing, updatedAt
      - ✅ SecuritySettings Model
        - 字段: userId, twoFactorEnabled, twoFactorMethod, loginAlertsEnabled, activeSessions, lastPasswordChange, updatedAt
    - ✅ Controllers
      - ✅ profileSettingsController
        - getAllSettings: 获取所有设置
        - initializeSettings: 初始化用户设置
        - getAccountSettings: 获取账户设置
        - updateAccountSettings: 更新账户设置
        - getNotificationSettings: 获取通知设置
        - updateNotificationSettings: 更新通知设置
        - getPrivacySettings: 获取隐私设置
        - updatePrivacySettings: 更新隐私设置
        - getSecuritySettings: 获取安全设置
        - updateSecuritySettings: 更新安全设置
        - addSession: 添加会话
        - removeSession: 移除会话
        - removeAllOtherSessions: 移除所有其他会话
        - updatePasswordChangeTime: 更新密码更改时间
    - ✅ Services
      - ✅ profileSettingsService
        - getAllSettings: 获取所有设置
        - initializeSettings: 初始化用户设置
        - getAccountSettings: 获取账户设置
        - updateAccountSettings: 更新账户设置
        - getNotificationSettings: 获取通知设置
        - updateNotificationSettings: 更新通知设置
        - getPrivacySettings: 获取隐私设置
        - updatePrivacySettings: 更新隐私设置
        - getSecuritySettings: 获取安全设置
        - updateSecuritySettings: 更新安全设置
        - addSession: 添加会话
        - removeSession: 移除会话
        - removeAllOtherSessions: 移除所有其他会话
        - updatePasswordChangeTime: 更新密码更改时间
    - ✅ Routes
      - GET /api/profile-settings/:userId - 获取用户的所有设置
      - POST /api/profile-settings/:userId/initialize - 初始化用户设置
      - GET /api/profile-settings/:userId/account - 获取账户设置
      - PUT /api/profile-settings/:userId/account - 更新账户设置
      - GET /api/profile-settings/:userId/notifications - 获取通知设置
      - PUT /api/profile-settings/:userId/notifications - 更新通知设置
      - GET /api/profile-settings/:userId/privacy - 获取隐私设置
      - PUT /api/profile-settings/:userId/privacy - 更新隐私设置
      - GET /api/profile-settings/:userId/security - 获取安全设置
      - PUT /api/profile-settings/:userId/security - 更新安全设置
      - POST /api/profile-settings/:userId/sessions - 添加会话
      - DELETE /api/profile-settings/:userId/sessions/:sessionId - 移除会话
      - DELETE /api/profile-settings/:userId/sessions - 移除所有其他会话
      - POST /api/profile-settings/:userId/password-change - 更新密码更改时间

### 待实现模块

## 14. 顾问案例管理模块 (新增)
   - ⬜ Models
     - ⬜ Case Model
       - 字段: id, title, clientId, consultantId, type, description, status, priority, progress, dueDate, createdAt, updatedAt
     - ⬜ CaseTask Model
       - 字段: id, caseId, title, description, assigneeId, status, priority, dueDate, completedAt, createdAt, updatedAt
     - ⬜ CaseNote Model
       - 字段: id, caseId, authorId, content, isPrivate, createdAt, updatedAt
     - ⬜ CaseDocument Model
       - 字段: id, caseId, name, type, size, url, uploadedBy, category, status, notes, createdAt, updatedAt
     - ⬜ CaseTimeline Model
       - 字段: id, caseId, type, description, userId, metadata, timestamp
   - ⬜ Controllers
     - ⬜ adminSettingsController
       - getSystemSettings: 获取系统设置
       - updateSystemSettings: 更新系统设置
       - resetSystemSettings: 重置系统设置为默认值
       - getSettingsHistory: 获取设置历史记录
       - exportSettings: 导出系统设置
       - importSettings: 导入系统设置
       - testEmailConfig: 测试邮件配置
       - clearSystemCache: 清除系统缓存
   - ⬜ Services
     - ⬜ adminSettingsService
       - getSystemSettings: 获取系统设置
       - updateSystemSettings: 更新系统设置
       - resetSystemSettings: 重置系统设置为默认值
       - getSettingsHistory: 获取设置历史记录
       - exportSettings: 导出系统设置
       - importSettings: 导入系统设置
       - testEmailConfig: 测试邮件配置
       - clearSystemCache: 清除系统缓存
   - ⬜ Routes
     - GET /api/admin/settings - 获取系统设置
     - PATCH /api/admin/settings - 更新系统设置
     - POST /api/admin/settings/reset - 重置系统设置为默认值
     - GET /api/admin/settings/history - 获取设置历史记录
     - GET /api/admin/settings/export - 导出系统设置
     - POST /api/admin/settings/import - 导入系统设置
     - POST /api/admin/settings/test-email - 测试邮件配置
     - POST /api/admin/settings/clear-cache - 清除系统缓存

## 12. Consultant Dashboard Module (新增)
   - ✅ Models
     - ✅ ConsultantTask Model
       - 字段: id, consultantId, title, dueDate, priority, status, relatedId, relatedType, createdAt, updatedAt
     - ✅ ConsultantActivity Model
       - 字段: consultantId, type, timestamp, description, relatedId, relatedType, isRead, createdAt
   - ✅ Controllers
     - ✅ consultantDashboardController
       - getConsultantDashboard: 获取顾问仪表盘数据
       - updateConsultantStatus: 更新顾问状态
       - getConsultantAppointments: 获取顾问预约列表
       - getConsultantTasks: 获取顾问任务列表
       - updateTaskStatus: 更新任务状态
       - getConsultantActivities: 获取顾问活动列表
       - confirmAppointment: 确认预约
       - cancelAppointment: 取消预约
   - ✅ Services
     - ✅ consultantDashboardService
       - getConsultantDashboard: 获取顾问仪表盘数据
       - updateConsultantStatus: 更新顾问状态
       - getConsultantAppointments: 获取顾问预约列表
       - getConsultantTasks: 获取顾问任务列表
       - updateTaskStatus: 更新任务状态
       - getConsultantActivities: 获取顾问活动列表
       - confirmAppointment: 确认预约
       - cancelAppointment: 取消预约
   - ✅ Routes
     - GET /api/consultant-dashboard/:consultantId/dashboard - 获取顾问仪表盘数据
     - PATCH /api/consultant-dashboard/:consultantId/status - 更新顾问状态
     - GET /api/consultant-dashboard/:consultantId/appointments - 获取顾问预约列表
     - GET /api/consultant-dashboard/:consultantId/tasks - 获取顾问任务列表
     - PATCH /api/consultant-dashboard/tasks/:taskId/status - 更新任务状态
     - GET /api/consultant-dashboard/:consultantId/activities - 获取顾问活动列表
     - PATCH /api/consultant-dashboard/appointments/:appointmentId/confirm - 确认预约
     - PATCH /api/consultant-dashboard/appointments/:appointmentId/cancel - 取消预约

## 12. 顾问客户管理模块 (新增)
   - ✅ Models
     - ✅ Client Model
       - 字段: id, userId, firstName, lastName, displayName, email, phone, avatar, status, assignedConsultantId, lastContactDate, source, address, notes, metadata, createdAt, updatedAt
     - ✅ ClientTag Model
       - 字段: id, clientId, tag, color, createdBy, createdAt, updatedAt
     - ✅ ClientNote Model
       - 字段: id, clientId, consultantId, content, isPrivate, category, pinned, createdAt, updatedAt
     - ✅ ClientActivity Model
       - 字段: id, clientId, consultantId, type, description, metadata, relatedId, relatedType, isRead, createdAt
   - ✅ Controllers
     - ✅ consultantClientController
       - getClients: 获取客户列表
       - getClientStats: 获取客户统计数据
       - getClientById: 获取单个客户详情
       - createClient: 创建新客户
       - updateClient: 更新客户信息
       - deleteClient: 删除客户
       - addClientTag: 添加客户标签
       - removeClientTag: 移除客户标签
       - addClientNote: 添加客户笔记
       - getClientNotes: 获取客户笔记
       - getClientActivities: 获取客户活动
       - searchClients: 搜索客户
       - getConsultantTags: 获取顾问的所有标签
       - findClientsByTag: 根据标签查找客户
   - ✅ Services
     - ✅ consultantClientService
       - getClients: 获取客户列表
       - getClientStats: 获取客户统计数据
       - getClientById: 获取单个客户详情
       - createClient: 创建新客户
       - updateClient: 更新客户信息
       - deleteClient: 删除客户
       - addClientTag: 添加客户标签
       - removeClientTag: 移除客户标签
       - addClientNote: 添加客户笔记
       - getClientNotes: 获取客户笔记
       - addClientActivity: 记录客户活动
       - getClientActivities: 获取客户活动
       - searchClients: 搜索客户
       - getConsultantTags: 获取顾问的所有标签
       - findClientsByTag: 根据标签查找客户
   - ✅ Routes
     - GET /api/consultant/:consultantId/clients - 获取客户列表
     - GET /api/consultant/:consultantId/clients/stats - 获取客户统计数据
     - GET /api/consultant/:consultantId/clients/:clientId - 获取单个客户详情
     - POST /api/consultant/:consultantId/clients - 创建新客户
     - PATCH /api/consultant/:consultantId/clients/:clientId - 更新客户信息
     - DELETE /api/consultant/:consultantId/clients/:clientId - 删除客户
     - POST /api/consultant/:consultantId/clients/:clientId/tags - 添加客户标签
     - DELETE /api/consultant/:consultantId/clients/:clientId/tags/:tag - 移除客户标签
     - POST /api/consultant/:consultantId/clients/:clientId/notes - 添加客户笔记
     - GET /api/consultant/:consultantId/clients/:clientId/notes - 获取客户笔记
     - GET /api/consultant/:consultantId/clients/:clientId/activities - 获取客户活动
     - GET /api/consultant/:consultantId/clients/search - 搜索客户
     - GET /api/consultant/:consultantId/tags - 获取顾问的所有标签
     - GET /api/consultant/:consultantId/clients/by-tag - 根据标签查找客户

## 13. 顾问案例管理模块 (新增)
   - ⬜ Models
     - ⬜ Case Model
       - 字段: id, title, clientId, consultantId, type, description, status, priority, progress, dueDate, createdAt, updatedAt
     - ⬜ CaseTask Model
       - 字段: id, caseId, title, description, assigneeId, status, priority, dueDate, completedAt, createdAt, updatedAt
     - ⬜ CaseNote Model
       - 字段: id, caseId, authorId, content, isPrivate, createdAt, updatedAt
     - ⬜ CaseDocument Model
       - 字段: id, caseId, name, type, size, url, uploadedBy, category, status, notes, createdAt, updatedAt
     - ⬜ CaseTimeline Model
       - 字段: id, caseId, type, description, userId, metadata, timestamp
   - ⬜ Controllers
     - ⬜ consultantCaseController
       - getCases: 获取案例列表
       - getCaseStats: 获取案例统计数据
       - getCaseTypes: 获取案例类型
       - createCase: 创建新案例
       - getCaseById: 获取案例详情
       - updateCase: 更新案例
       - getCaseTasks: 获取案例任务
       - createCaseTask: 创建案例任务
       - updateCaseTask: 更新案例任务
       - getCaseNotes: 获取案例笔记
       - createCaseNote: 添加案例笔记
       - getCaseDocuments: 获取案例文档
       - uploadCaseDocument: 上传案例文档
       - getCaseTimeline: 获取案例时间线
   - ⬜ Services
     - ⬜ consultantCaseService
       - getCases: 获取案例列表
       - getCaseStats: 获取案例统计数据
       - getCaseTypes: 获取案例类型
       - createCase: 创建新案例
       - getCaseById: 获取案例详情
       - updateCase: 更新案例
       - getCaseTasks: 获取案例任务
       - createCaseTask: 创建案例任务
       - updateCaseTask: 更新案例任务
       - getCaseNotes: 获取案例笔记
       - createCaseNote: 添加案例笔记
       - getCaseDocuments: 获取案例文档
       - uploadCaseDocument: 上传案例文档
       - getCaseTimeline: 获取案例时间线
   - ⬜ Routes
     - GET /api/consultant/:consultantId/cases - 获取案例列表
     - GET /api/consultant/:consultantId/cases/stats - 获取案例统计数据
     - GET /api/consultant/:consultantId/cases/types - 获取案例类型
     - POST /api/consultant/:consultantId/cases - 创建新案例
     - GET /api/consultant/:consultantId/cases/:caseId - 获取案例详情
     - PATCH /api/consultant/:consultantId/cases/:caseId - 更新案例
     - GET /api/consultant/:consultantId/cases/:caseId/tasks - 获取案例任务
     - POST /api/consultant/:consultantId/cases/:caseId/tasks - 创建案例任务
     - PATCH /api/consultant/:consultantId/cases/:caseId/tasks/:taskId - 更新案例任务
     - GET /api/consultant/:consultantId/cases/:caseId/notes - 获取案例笔记
     - POST /api/consultant/:consultantId/cases/:caseId/notes - 添加案例笔记
     - GET /api/consultant/:consultantId/cases/:caseId/documents - 获取案例文档
     - POST /api/consultant/:consultantId/cases/:caseId/documents - 上传案例文档
     - GET /api/consultant/:consultantId/cases/:caseId/timeline - 获取案例时间线

## 14. 顾问日程管理模块 (新增)
   - ⬜ Models
     - ⬜ ScheduleEvent Model
       - 字段: id, consultantId, title, description, startTime, endTime, type, status, clientId, location, isOnline, meetingLink, notes, color, createdAt, updatedAt
     - ⬜ EventRecurrence Model
       - 字段: id, eventId, pattern, intervalValue, endDate, daysOfWeek, dayOfMonth, monthOfYear, count, createdAt, updatedAt
     - ⬜ EventReminder Model
       - 字段: id, eventId, timeBefore, type, sent, createdAt, updatedAt
     - ⬜ ConsultantWorkingHours Model
       - 字段: id, consultantId, weekday, isWorking, timezone, createdAt, updatedAt
     - ⬜ WorkingHourSlot Model
       - 字段: id, workingHourId, startTime, endTime, createdAt, updatedAt
     - ⬜ WorkingHourException Model
       - 字段: id, consultantId, exceptionDate, isWorking, note, createdAt, updatedAt
     - ⬜ ExceptionSlot Model
       - 字段: id, exceptionId, startTime, endTime, createdAt, updatedAt
     - ⬜ AppointmentRequest Model
       - 字段: id, consultantId, clientId, purpose, notes, status, createdAt, updatedAt
     - ⬜ ProposedAppointmentTime Model
       - 字段: id, requestId, startTime, endTime, isSelected, createdAt, updatedAt
   - ⬜ Controllers
     - ⬜ scheduleController
       - getEvents: 获取日程事件列表
       - createEvent: 创建新事件
       - getEventById: 获取单个事件详情
       - updateEvent: 更新事件
       - deleteEvent: 删除事件
       - getWorkingHours: 获取工作时间设置
       - updateWorkingHours: 更新工作时间设置
       - getAppointmentRequests: 获取预约请求列表
       - acceptAppointmentRequest: 接受预约请求
       - rejectAppointmentRequest: 拒绝预约请求
       - rescheduleAppointmentRequest: 重新安排预约
       - getScheduleStats: 获取日程统计数据
   - ⬜ Services
     - ⬜ scheduleService
       - getEvents: 获取日程事件列表
       - createEvent: 创建新事件
       - getEventById: 获取单个事件详情
       - updateEvent: 更新事件
       - deleteEvent: 删除事件
       - getWorkingHours: 获取工作时间设置
       - updateWorkingHours: 更新工作时间设置
       - getAppointmentRequests: 获取预约请求列表
       - acceptAppointmentRequest: 接受预约请求
       - rejectAppointmentRequest: 拒绝预约请求
       - rescheduleAppointmentRequest: 重新安排预约
       - getScheduleStats: 获取日程统计数据
   - ⬜ Routes
     - GET /api/consultant/:consultantId/schedule/events - 获取日程事件列表
     - POST /api/consultant/:consultantId/schedule/events - 创建新事件
     - GET /api/consultant/:consultantId/schedule/events/:eventId - 获取单个事件详情
     - PATCH /api/consultant/:consultantId/schedule/events/:eventId - 更新事件
     - DELETE /api/consultant/:consultantId/schedule/events/:eventId - 删除事件
     - GET /api/consultant/:consultantId/schedule/working-hours - 获取工作时间设置
     - PATCH /api/consultant/:consultantId/schedule/working-hours - 更新工作时间设置
     - GET /api/consultant/:consultantId/schedule/appointment-requests - 获取预约请求列表
     - POST /api/consultant/:consultantId/schedule/appointment-requests/:requestId/accept - 接受预约请求
     - POST /api/consultant/:consultantId/schedule/appointment-requests/:requestId/reject - 拒绝预约请求
     - POST /api/consultant/:consultantId/schedule/appointment-requests/:requestId/reschedule - 重新安排预约
     - GET /api/consultant/:consultantId/schedule/stats - 获取日程统计数据
     - GET /api/consultant/:consultantId/schedule/available-slots - 获取可用时间段
     - POST /api/consultant/:consultantId/schedule/block-time - 阻塞时间段
     - POST /api/consultant/:consultantId/schedule/events/:eventId/reminders - 添加事件提醒
     - DELETE /api/consultant/:consultantId/schedule/events/:eventId/reminders/:reminderId - 删除事件提醒

## 15. Technical Requirements

- Node.js with Express framework
- MongoDB database with Mongoose ODM
- JWT for authentication
- Internationalization support (i18n)
- Error handling and validation
- API documentation
- Axios for external API requests

## 16. API Standards

根据前端API集成需求，所有后端API端点应遵循以下标准：

### RESTful API设计
- 使用适当的HTTP方法（GET, POST, PUT, PATCH, DELETE）
- 使用资源导向的URL路径
- 使用嵌套资源表示关系
- 支持过滤、排序和分页

### 请求和响应格式
- 使用JSON格式进行数据交换
- 请求体使用camelCase命名约定
- 响应体使用一致的结构

### HTTP状态码
- 200: 成功的GET, PUT, PATCH请求
- 201: 成功的POST请求（创建资源）
- 204: 成功的DELETE请求
- 400: 错误的请求（客户端错误）
- 401: 未授权（缺少或无效的认证）
- 403: 禁止访问（权限不足）
- 404: 资源未找到
- 422: 验证错误
- 500: 服务器内部错误

### 标准错误响应格式
```json
{
  "message": "操作失败的描述信息",
  "code": "ERROR_CODE",
  "details": {
    "field1": "字段1的错误信息",
    "field2": "字段2的错误信息"
  }
}
```

### 分页响应格式
```json
{
  "items": [...],
  "total": 100,
  "page": 1,
  "limit": 10,
  "totalPages": 10
}
```

### 缓存控制
- 使用适当的缓存控制头（Cache-Control, ETag）
- 支持条件请求（If-Modified-Since, If-None-Match）
- 实现缓存策略以提高性能

### 请求重试和错误处理
- 对特定错误（503, 504）支持自动重试
- 提供详细的错误信息以便前端显示
- 实现幂等性以支持安全重试
