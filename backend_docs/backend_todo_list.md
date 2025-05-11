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

### 待实现模块

9. ⬜ Profile Data Structure Alignment (新增)
   - ⬜ 更新 Profile Model 以匹配前端数据结构
     - ⬜ 添加 passportNumber 字段到 personalInfo
     - ⬜ 添加 email 字段到 personalInfo
     - ⬜ 修改 educationInfo 从数组改为对象结构
     - ⬜ 修改 workExperience 从数组改为对象结构
     - ⬜ 修改 languageSkills 从数组改为对象结构
     - ⬜ 更新 immigrationInfo 字段以匹配前端结构
   - ⬜ 更新 profileController 以处理新的数据结构
   - ⬜ 更新 profileService 以支持新的数据结构
   - ⬜ 更新 profileRoutes 中的验证规则

## 11. Technical Requirements

- Node.js with Express framework
- MongoDB database with Mongoose ODM
- JWT for authentication
- Internationalization support (i18n)
- Error handling and validation
- API documentation
- Axios for external API requests
