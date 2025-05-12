# Frontend-Backend Integration Tests

This document outlines the integration testing approach for the ThinkForward AI application, focusing on the interaction between frontend components and backend APIs.

## Overview

The integration tests verify that frontend components correctly interact with backend APIs by:
1. Mocking API responses using Mock Service Worker (MSW)
2. Testing component rendering with mocked API data
3. Verifying user interactions trigger correct API calls
4. Handling error scenarios gracefully

## Test Structure

```
tests/
├── frontend-integration/
│   ├── auth/
│   │   └── login.test.js
│   ├── profile/
│   │   └── profile.test.js
│   ├── assessment/
│   │   └── assessment.test.js
│   ├── pathway/
│   │   └── pathway.test.js
│   ├── mocks/
│   │   ├── handlers.js
│   │   ├── styleMock.js
│   │   └── fileMock.js
│   ├── setup/
│   │   └── test-environment.js
│   ├── utils/
│   │   └── test-utils.js
│   └── jest.setup.js
└── package.json
```

## Key Components

### Mock Service Worker (MSW)

MSW intercepts API requests and returns mock responses, allowing tests to run without a real backend. The handlers are defined in `mocks/handlers.js` and organized by module:

- `authHandlers`: Authentication API mocks (login, register, refresh token)
- `profileHandlers`: Profile API mocks (get profile, update profile)
- `assessmentHandlers`: Assessment API mocks (start assessment, get questions, submit responses)
- `pathwayHandlers`: Pathway API mocks (list pathways, get pathway details, check eligibility)

### Test Utilities

The `utils/test-utils.js` file provides a custom render function that wraps components with necessary providers:

- `QueryClientProvider`: For React Query state management
- Additional providers can be added as needed

### Test Setup

The test environment is configured in:

- `setup/test-environment.js`: Sets up MSW server and React Testing Library
- `jest.setup.js`: Configures global mocks for Next.js router, i18n, zustand, and localStorage

## Test Modules

### Authentication Tests

Tests for authentication flows including:
- Login form rendering
- Form validation
- Successful login with valid credentials
- Error handling for invalid credentials
- Server error handling

### Profile Tests

Tests for profile management including:
- Profile data fetching and display
- Profile section navigation
- Profile data updates
- Error handling

### Assessment Tests

Tests for assessment flows including:
- Starting an assessment
- Navigating through assessment questions
- Submitting responses
- Viewing assessment results
- Error handling

### Pathway Tests

Tests for pathway exploration including:
- Listing available pathways
- Filtering pathways
- Viewing pathway details
- Checking eligibility
- Error handling

## Running Tests

To run the frontend integration tests:

```bash
cd tests
npm run test:frontend
```

To run a specific test file:

```bash
cd tests
npm test -- frontend-integration/auth/login.test.js
```

## Best Practices

1. **Isolation**: Each test should be independent and not rely on the state from other tests
2. **Mocking**: Use MSW handlers to mock API responses
3. **User-centric**: Test from the user's perspective, focusing on interactions
4. **Error handling**: Test both success and error scenarios
5. **Cleanup**: Reset handlers after each test to prevent test pollution

## Future Improvements

1. Add more granular tests for each component
2. Implement end-to-end tests with Cypress or Playwright
3. Add visual regression testing
4. Implement performance testing for critical user flows
