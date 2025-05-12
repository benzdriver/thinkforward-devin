import React from 'react';
import { rest } from 'msw';
import { server } from '../setup/test-environment';
import { render, screen, fireEvent, waitFor } from '../utils/test-utils';
import AssessmentStart from '../../../frontend/pages/assessment/start';
import AssessmentStep from '../../../frontend/pages/assessment/[step]';
import AssessmentResult from '../../../frontend/pages/assessment/result/[id]';

jest.mock('../../../frontend/lib/store/zustand/useAuthStore', () => ({
  useAuthStore: () => ({
    user: {
      id: '5f9d5f2b9d9d4b2d9c9d5f2b',
      email: 'test@example.com',
      name: 'Test User',
      role: 'client'
    },
    token: 'mock-auth-token',
    isAuthenticated: true
  })
}));

jest.mock('next/router', () => ({
  useRouter: () => ({
    query: { step: '1', id: '5f9d5f2b9d9d4b2d9c9d5f2d' },
    push: jest.fn(),
    replace: jest.fn()
  })
}));

describe('Assessment Integration Test', () => {
  beforeAll(() => {
    const { assessmentHandlers } = require('../mocks/handlers');
    
    server.use(...assessmentHandlers);
  });
  
  it('should render assessment start page and start assessment', async () => {
    const mockRouter = { push: jest.fn() };
    jest.spyOn(require('next/router'), 'useRouter').mockReturnValue(mockRouter);
    
    render(<AssessmentStart />);
    
    expect(screen.getByText(/comprehensive assessment/i)).toBeInTheDocument();
    expect(screen.getByText(/express assessment/i)).toBeInTheDocument();
    
    fireEvent.click(screen.getByText(/comprehensive assessment/i));
    fireEvent.click(screen.getByRole('button', { name: /start assessment/i }));
    
    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/assessment/1?id=5f9d5f2b9d9d4b2d9c9d5f2d');
    });
  });
  
  it('should render assessment question and submit response', async () => {
    const mockRouter = { push: jest.fn(), query: { step: '1', id: '5f9d5f2b9d9d4b2d9c9d5f2d' } };
    jest.spyOn(require('next/router'), 'useRouter').mockReturnValue(mockRouter);
    
    render(<AssessmentStep />);
    
    await waitFor(() => {
      expect(screen.getByText(/question 1/i)).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText(/option 1/i));
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    
    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/assessment/2?id=5f9d5f2b9d9d4b2d9c9d5f2d');
    });
  });
  
  it('should render assessment result page', async () => {
    const mockRouter = { query: { id: '5f9d5f2b9d9d4b2d9c9d5f2d' } };
    jest.spyOn(require('next/router'), 'useRouter').mockReturnValue(mockRouter);
    
    render(<AssessmentResult />);
    
    await waitFor(() => {
      expect(screen.getByText(/assessment result/i)).toBeInTheDocument();
      expect(screen.getByText(/score: 85/i)).toBeInTheDocument();
      expect(screen.getByText(/express entry/i)).toBeInTheDocument();
    });
  });
  
  it('should handle server error during assessment start', async () => {
    server.use(
      rest.post('http://localhost:3001/api/assessment/start', (req, res, ctx) => {
        return res(
          ctx.status(500),
          ctx.json({
            success: false,
            message: 'Internal server error'
          })
        );
      })
    );
    
    render(<AssessmentStart />);
    
    fireEvent.click(screen.getByText(/comprehensive assessment/i));
    fireEvent.click(screen.getByRole('button', { name: /start assessment/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/internal server error/i)).toBeInTheDocument();
    });
  });
});
