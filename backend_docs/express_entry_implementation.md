# Express Entry Backend Implementation

This document outlines the backend implementation for the Express Entry module of the ThinkForward AI immigration platform.

## Overview

The Express Entry backend provides API endpoints for calculating Comprehensive Ranking System (CRS) points, checking eligibility for Express Entry programs, fetching the latest Express Entry draws, and managing user profiles. The implementation follows a modular architecture with clear separation of concerns.

## Directory Structure

```
backend/
├── models/
│   └── canada/
│       └── ExpressEntryProfile.js
├── controllers/
│   └── canada/
│       └── expressEntryController.js
├── services/
│   └── canada/
│       └── expressEntryService.js
├── routes/
│   └── canada/
│       └── expressEntryRoutes.js
├── utils/
│   ├── pointsCalculator.js
│   ├── errorHandler.js
│   └── canadaApiClient.js
├── middleware/
│   ├── authMiddleware.js
│   └── localeMiddleware.js
└── app.js
```

## Components

### Models

#### ExpressEntryProfile

The `ExpressEntryProfile` model defines the schema for storing Express Entry profiles in MongoDB. It includes:

- User information (age, marital status)
- Language proficiency (English and French)
- Education history
- Work experience
- Adaptability factors
- Provincial nomination details
- Job offer details

The model includes pre-save hooks for generating a unique profile ID and calculating Canadian Language Benchmark (CLB) equivalents for language test scores.

### Controllers

#### expressEntryController

The Express Entry controller handles HTTP requests and uses the Express Entry service to process them. It includes methods for:

- Calculating CRS points
- Checking eligibility for Express Entry programs
- Fetching the latest Express Entry draws
- Creating and updating user profiles
- Getting quick CRS estimates

The controller includes validation using express-validator and error handling using the error handler utility.

### Services

#### expressEntryService

The Express Entry service implements the business logic for the Express Entry module. It includes methods for:

- Calculating CRS points based on core human capital, spouse factors, and additional points
- Checking eligibility for Federal Skilled Worker Program, Canadian Experience Class, and Federal Skilled Trades Program
- Fetching the latest Express Entry draws
- Managing user profiles
- Getting quick CRS estimates

### Routes

#### expressEntryRoutes

The Express Entry routes define the API endpoints for the Express Entry module. The routes include:

- POST /api/canada/express-entry/calculate-score
- POST /api/canada/express-entry/check-eligibility
- GET /api/canada/express-entry/latest-draws
- POST /api/canada/express-entry/profile
- GET /api/canada/express-entry/profile
- POST /api/canada/express-entry/quick-estimate

The routes include validation using express-validator and authentication using the auth middleware.

### Utils

#### pointsCalculator

The points calculator utility provides functions for calculating CRS points based on various factors, including:

- Age
- Education
- Language proficiency
- Work experience
- Adaptability factors
- Provincial nomination
- Job offer

#### errorHandler

The error handler utility provides functions for translating error messages based on locale. It includes translations for validation errors, duplicate key errors, and general error messages.

#### canadaApiClient

The Canada API client utility provides functions for fetching data from Canadian immigration APIs, including:

- Latest Express Entry draws
- NOC codes and descriptions
- Canadian provinces and territories

### Middleware

#### authMiddleware

The auth middleware verifies JWT tokens and authenticates users. It extracts the token from the Authorization header, verifies it using the JWT secret, and adds the user information to the request object.

#### localeMiddleware

The locale middleware sets the locale based on the Accept-Language header. It extracts the primary language from the header, checks if it's supported, and sets the locale on the request object.

### App

The main Express application sets up the Express server, connects to MongoDB, and configures middleware and routes. It includes:

- Security headers using helmet
- CORS support
- Logging using morgan
- JSON and URL-encoded body parsing
- API routes
- Error handling middleware

## API Endpoints

### Calculate CRS Points

```
POST /api/canada/express-entry/calculate-score
```

Calculates CRS points based on the provided profile.

**Request Body:**
```json
{
  "age": 30,
  "maritalStatus": "single",
  "languageProficiency": [
    {
      "language": "english",
      "test": "IELTS",
      "speaking": 7.5,
      "listening": 8.0,
      "reading": 7.0,
      "writing": 7.0
    }
  ],
  "education": [
    {
      "level": "bachelors",
      "field": "Computer Science",
      "institution": "University of Toronto",
      "country": "Canada",
      "completionDate": "2020-05-15"
    }
  ],
  "workExperience": [
    {
      "occupation": {
        "noc": "21234",
        "title": "Software Engineer"
      },
      "employer": "Tech Company",
      "country": "Canada",
      "isCanadianExperience": true,
      "startDate": "2020-06-01",
      "endDate": "2023-06-01",
      "hoursPerWeek": 40
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "score": 470,
  "breakdown": {
    "coreHumanCapital": 350,
    "spouseFactors": 0,
    "skillTransferability": 50,
    "additionalPoints": 70
  }
}
```

### Check Eligibility

```
POST /api/canada/express-entry/check-eligibility
```

Checks eligibility for Express Entry programs.

**Request Body:**
```json
{
  "age": 30,
  "maritalStatus": "single",
  "languageProficiency": [
    {
      "language": "english",
      "test": "IELTS",
      "speaking": 7.5,
      "listening": 8.0,
      "reading": 7.0,
      "writing": 7.0
    }
  ],
  "education": [
    {
      "level": "bachelors",
      "field": "Computer Science",
      "institution": "University of Toronto",
      "country": "Canada",
      "completionDate": "2020-05-15"
    }
  ],
  "workExperience": [
    {
      "occupation": {
        "noc": "21234",
        "title": "Software Engineer"
      },
      "employer": "Tech Company",
      "country": "Canada",
      "isCanadianExperience": true,
      "startDate": "2020-06-01",
      "endDate": "2023-06-01",
      "hoursPerWeek": 40
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "isEligible": true,
  "programs": [
    "Federal Skilled Worker Program",
    "Canadian Experience Class"
  ],
  "reasons": {
    "fswp": {
      "isEligible": true,
      "points": 75,
      "minimumRequired": 67
    },
    "cec": {
      "isEligible": true,
      "canadianExperience": 3,
      "minimumRequired": 1
    },
    "fstp": {
      "isEligible": false,
      "reason": "Not a skilled trade occupation"
    }
  }
}
```

### Get Latest Draws

```
GET /api/canada/express-entry/latest-draws
```

Fetches the latest Express Entry draws.

**Response:**
```json
{
  "success": true,
  "draws": [
    {
      "drawNumber": 265,
      "drawDate": "2025-05-08T12:00:00Z",
      "program": "All programs",
      "invitationsIssued": 3,
      "lowestScore": 491,
      "tieBreakDate": "2025-04-15T12:00:00Z"
    },
    {
      "drawNumber": 264,
      "drawDate": "2025-04-24T12:00:00Z",
      "program": "Provincial Nominee Program",
      "invitationsIssued": 1,
      "lowestScore": 783,
      "tieBreakDate": "2025-04-10T12:00:00Z"
    }
  ]
}
```

### Create or Update Profile

```
POST /api/canada/express-entry/profile
```

Creates or updates an Express Entry profile.

**Request Body:**
```json
{
  "age": 30,
  "maritalStatus": "single",
  "languageProficiency": [
    {
      "language": "english",
      "test": "IELTS",
      "speaking": 7.5,
      "listening": 8.0,
      "reading": 7.0,
      "writing": 7.0
    }
  ],
  "education": [
    {
      "level": "bachelors",
      "field": "Computer Science",
      "institution": "University of Toronto",
      "country": "Canada",
      "completionDate": "2020-05-15"
    }
  ],
  "workExperience": [
    {
      "occupation": {
        "noc": "21234",
        "title": "Software Engineer"
      },
      "employer": "Tech Company",
      "country": "Canada",
      "isCanadianExperience": true,
      "startDate": "2020-06-01",
      "endDate": "2023-06-01",
      "hoursPerWeek": 40
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "profile": {
    "_id": "60a1b2c3d4e5f6g7h8i9j0k",
    "userId": "12345",
    "profileId": "EE-25-1234567",
    "age": 30,
    "maritalStatus": "single",
    "languageProficiency": [
      {
        "language": "english",
        "test": "IELTS",
        "speaking": 7.5,
        "listening": 8.0,
        "reading": 7.0,
        "writing": 7.0,
        "clbEquivalent": {
          "speaking": 9,
          "listening": 10,
          "reading": 8,
          "writing": 8
        }
      }
    ],
    "education": [
      {
        "level": "bachelors",
        "field": "Computer Science",
        "institution": "University of Toronto",
        "country": "Canada",
        "completionDate": "2020-05-15"
      }
    ],
    "workExperience": [
      {
        "occupation": {
          "noc": "21234",
          "title": "Software Engineer"
        },
        "employer": "Tech Company",
        "country": "Canada",
        "isCanadianExperience": true,
        "startDate": "2020-06-01",
        "endDate": "2023-06-01",
        "hoursPerWeek": 40
      }
    ],
    "status": "draft",
    "createdAt": "2025-05-10T16:43:52.000Z",
    "updatedAt": "2025-05-10T16:43:52.000Z"
  }
}
```

### Get Profile

```
GET /api/canada/express-entry/profile
```

Fetches the user's Express Entry profile.

**Response:**
```json
{
  "success": true,
  "profile": {
    "_id": "60a1b2c3d4e5f6g7h8i9j0k",
    "userId": "12345",
    "profileId": "EE-25-1234567",
    "age": 30,
    "maritalStatus": "single",
    "languageProficiency": [
      {
        "language": "english",
        "test": "IELTS",
        "speaking": 7.5,
        "listening": 8.0,
        "reading": 7.0,
        "writing": 7.0,
        "clbEquivalent": {
          "speaking": 9,
          "listening": 10,
          "reading": 8,
          "writing": 8
        }
      }
    ],
    "education": [
      {
        "level": "bachelors",
        "field": "Computer Science",
        "institution": "University of Toronto",
        "country": "Canada",
        "completionDate": "2020-05-15"
      }
    ],
    "workExperience": [
      {
        "occupation": {
          "noc": "21234",
          "title": "Software Engineer"
        },
        "employer": "Tech Company",
        "country": "Canada",
        "isCanadianExperience": true,
        "startDate": "2020-06-01",
        "endDate": "2023-06-01",
        "hoursPerWeek": 40
      }
    ],
    "status": "draft",
    "createdAt": "2025-05-10T16:43:52.000Z",
    "updatedAt": "2025-05-10T16:43:52.000Z"
  }
}
```

### Get Quick Estimate

```
POST /api/canada/express-entry/quick-estimate
```

Gets a quick estimate of CRS points based on basic information.

**Request Body:**
```json
{
  "age": "30-34",
  "education": "bachelors",
  "languageProficiency": "clb9",
  "canadianWorkExperience": "1-2"
}
```

**Response:**
```json
{
  "success": true,
  "score": 450
}
```

## Conclusion

The Express Entry backend implementation provides a comprehensive set of API endpoints for calculating CRS points, checking eligibility, fetching the latest draws, and managing user profiles. The implementation follows a modular architecture with clear separation of concerns, making it easy to maintain and extend.
