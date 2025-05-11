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

## 3. Express Entry Module (Already Implemented)

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

## 5. Pathways Module (Already Implemented)

### Models
- **Pathway Model**
  - Fields: name, code, country, category, description, eligibilityCriteria, processingTime, applicationFee, requiredDocuments, steps, officialLink, isActive, popularity, successRate, translations, metadata
  - Methods: getTranslation, checkEligibility

- **PathwayApplication Model** (Already Implemented)
  - Fields: userId, pathwayId, status, submittedAt, lastUpdatedAt, notes, documents, timeline, feedback, metadata
  - Methods: updateStatus, submit, addDocument, updateDocumentStatus, addFeedback
  - Relationships: Belongs to User, Belongs to Pathway

- **Consultant Model** (Already Implemented)
  - Fields: name, email, phone, profileImage, specialization, countries, experience, languages, credentials, rating, reviews, availability, fees, bio, website, socialMedia, location, isVerified, isActive, metadata
  - Methods: addReview, updateAvailability, findBySpecialization, findByLanguage, findByLocation
  - Relationships: Has many ConsultantMatches

- **ConsultantMatch Model** (Already Implemented)
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

## 7. Database Schema

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
- ConsultantMatches

## 8. Implementation Priority

1. Authentication Module (Core functionality)
2. Profile Module (User data management)
3. Express Entry Module (Already implemented)
4. Assessment Module (User evaluation)
5. Pathways Module (Immigration options)
6. Utilities and Middleware (Support components)

## 9. Technical Requirements

- Node.js with Express framework
- MongoDB database with Mongoose ODM
- JWT for authentication
- Internationalization support (i18n)
- Error handling and validation
- API documentation
- Axios for external API requests
