import { rest } from 'msw';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const mockUsers = [
  {
    _id: '5f9d5f2b9d9d4b2d9c9d5f2b',
    name: 'Test User',
    email: 'test@example.com',
    role: 'client',
  }
];

const mockAuthTokens = {
  token: 'mock-auth-token',
  refreshToken: 'mock-refresh-token',
  tokenExpiry: new Date().getTime() + 30 * 60 * 1000,
};

const mockProfiles = [
  {
    _id: '5f9d5f2b9d9d4b2d9c9d5f2c',
    userId: '5f9d5f2b9d9d4b2d9c9d5f2b',
    personalInfo: {
      firstName: 'Test',
      lastName: 'User',
      dateOfBirth: '1990-01-01',
      countryOfOrigin: 'United States',
    },
    educationInfo: {
      highestDegree: 'Bachelor',
      fieldOfStudy: 'Computer Science',
    },
    workExperience: {
      yearsOfExperience: 5,
      currentPosition: 'Software Engineer',
    },
    languageSkills: {
      primaryLanguage: 'English',
      languageProficiency: 'Native',
    },
    immigrationInfo: {
      desiredCountry: 'Canada',
      previousApplications: false,
    },
    completionStatus: {
      personal: true,
      education: true,
      work: true,
      language: true,
      immigration: true,
      isComplete: true,
    },
  },
];

const mockAssessments = [
  {
    _id: '5f9d5f2b9d9d4b2d9c9d5f2d',
    userId: '5f9d5f2b9d9d4b2d9c9d5f2b',
    type: 'comprehensive',
    status: 'in_progress',
    progress: 60,
    currentStep: 3,
    totalSteps: 5,
    responses: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const mockPathways = [
  {
    _id: '5f9d5f2b9d9d4b2d9c9d5f2e',
    name: 'Express Entry',
    code: 'express-entry',
    country: 'Canada',
    category: 'federal',
    description: 'Express Entry pathway for skilled workers',
    eligibilityCriteria: [],
    processingTime: { min: 6, max: 12, unit: 'months' },
    applicationFee: { amount: 1500, currency: 'CAD' },
    requiredDocuments: [],
    steps: [],
    officialLink: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry.html',
  },
];

export const authHandlers = [
  rest.post(`${API_BASE_URL}/auth/login`, (req, res, ctx) => {
    const { email, password } = req.body;
    
    if (email === 'test@example.com' && password === 'password123') {
      return res(
        ctx.status(200),
        ctx.json({
          success: true,
          data: {
            user: mockUsers[0],
            ...mockAuthTokens
          }
        })
      );
    }
    
    return res(
      ctx.status(401),
      ctx.json({
        success: false,
        message: 'Invalid credentials'
      })
    );
  }),
  
  rest.post(`${API_BASE_URL}/auth/register`, (req, res, ctx) => {
    const { name, email, password } = req.body;
    
    if (email === 'existing@example.com') {
      return res(
        ctx.status(400),
        ctx.json({
          success: false,
          message: 'User already exists'
        })
      );
    }
    
    return res(
      ctx.status(201),
      ctx.json({
        success: true,
        data: {
          user: {
            _id: '5f9d5f2b9d9d4b2d9c9d5f2f',
            name,
            email,
            role: 'client'
          },
          ...mockAuthTokens
        }
      })
    );
  }),
  
  rest.post(`${API_BASE_URL}/auth/refresh-token`, (req, res, ctx) => {
    const { refreshToken } = req.body;
    
    if (refreshToken === 'mock-refresh-token') {
      return res(
        ctx.status(200),
        ctx.json({
          success: true,
          data: mockAuthTokens
        })
      );
    }
    
    return res(
      ctx.status(401),
      ctx.json({
        success: false,
        message: 'Invalid refresh token'
      })
    );
  }),
  
  rest.post(`${API_BASE_URL}/auth/logout`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        message: 'Logged out successfully'
      })
    );
  }),
];

export const profileHandlers = [
  rest.get(`${API_BASE_URL}/profile/:userId`, (req, res, ctx) => {
    const { userId } = req.params;
    const profile = mockProfiles.find(p => p.userId === userId);
    
    if (profile) {
      return res(
        ctx.status(200),
        ctx.json({
          success: true,
          data: profile
        })
      );
    }
    
    return res(
      ctx.status(404),
      ctx.json({
        success: false,
        message: 'Profile not found'
      })
    );
  }),
  
  rest.patch(`${API_BASE_URL}/profile/:userId`, (req, res, ctx) => {
    const { userId } = req.params;
    const profile = mockProfiles.find(p => p.userId === userId);
    
    if (profile) {
      const updatedProfile = { ...profile, ...req.body };
      
      return res(
        ctx.status(200),
        ctx.json({
          success: true,
          data: updatedProfile
        })
      );
    }
    
    return res(
      ctx.status(404),
      ctx.json({
        success: false,
        message: 'Profile not found'
      })
    );
  }),
];

export const assessmentHandlers = [
  rest.post(`${API_BASE_URL}/assessment/start`, (req, res, ctx) => {
    const { type } = req.body;
    
    return res(
      ctx.status(201),
      ctx.json({
        success: true,
        data: {
          assessmentId: '5f9d5f2b9d9d4b2d9c9d5f2d',
          type,
          totalSteps: 5
        }
      })
    );
  }),
  
  rest.get(`${API_BASE_URL}/assessment/:id/questions/:step`, (req, res, ctx) => {
    const { id, step } = req.params;
    
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        data: {
          questionId: `question-${step}`,
          type: 'multiple-choice',
          question: `Question ${step}`,
          options: [
            { value: 'option1', label: 'Option 1' },
            { value: 'option2', label: 'Option 2' },
            { value: 'option3', label: 'Option 3' }
          ]
        }
      })
    );
  }),
  
  rest.post(`${API_BASE_URL}/assessment/:id/responses`, (req, res, ctx) => {
    const { questionId, response } = req.body;
    
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        data: {
          currentStep: 4,
          totalSteps: 5,
          progress: 80,
          isComplete: false
        }
      })
    );
  }),
  
  rest.get(`${API_BASE_URL}/assessment/:id/result`, (req, res, ctx) => {
    const { id } = req.params;
    
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        data: {
          assessmentId: id,
          score: 85,
          recommendation: 'Express Entry',
          details: 'Based on your score, you are eligible for Express Entry.'
        }
      })
    );
  }),
];

export const pathwayHandlers = [
  rest.get(`${API_BASE_URL}/pathway`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        data: mockPathways
      })
    );
  }),
  
  rest.get(`${API_BASE_URL}/pathway/id/:id`, (req, res, ctx) => {
    const { id } = req.params;
    const pathway = mockPathways.find(p => p._id === id);
    
    if (pathway) {
      return res(
        ctx.status(200),
        ctx.json({
          success: true,
          data: pathway
        })
      );
    }
    
    return res(
      ctx.status(404),
      ctx.json({
        success: false,
        message: 'Pathway not found'
      })
    );
  }),
  
  rest.post(`${API_BASE_URL}/pathway/eligibility/:id`, (req, res, ctx) => {
    const { id } = req.params;
    
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        data: {
          eligible: true,
          score: 85,
          details: 'You meet the eligibility criteria for this pathway.'
        }
      })
    );
  }),
];

export const handlers = [
  ...authHandlers,
  ...profileHandlers,
  ...assessmentHandlers,
  ...pathwayHandlers,
];
