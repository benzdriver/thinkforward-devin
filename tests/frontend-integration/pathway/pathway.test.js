import React from 'react';
import { rest } from 'msw';
import { server } from '../setup/test-environment';
import { render, screen, fireEvent, waitFor } from '../utils/test-utils';
import PathwayList from '../../../frontend/pages/pathway';
import PathwayDetail from '../../../frontend/pages/pathway/[id]';

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
    query: { id: '5f9d5f2b9d9d4b2d9c9d5f2e' },
    push: jest.fn()
  })
}));

describe('Pathway Integration Test', () => {
  beforeAll(() => {
    const { pathwayHandlers } = require('../mocks/handlers');
    
    server.use(...pathwayHandlers);
  });
  
  it('should render pathway list and filter options', async () => {
    render(<PathwayList />);
    
    await waitFor(() => {
      expect(screen.getByText(/express entry/i)).toBeInTheDocument();
    });
    
    expect(screen.getByText(/filter by country/i)).toBeInTheDocument();
    expect(screen.getByText(/filter by category/i)).toBeInTheDocument();
  });
  
  it('should navigate to pathway detail page', async () => {
    const mockRouter = { push: jest.fn() };
    jest.spyOn(require('next/router'), 'useRouter').mockReturnValue(mockRouter);
    
    render(<PathwayList />);
    
    await waitFor(() => {
      expect(screen.getByText(/express entry/i)).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText(/express entry/i));
    
    expect(mockRouter.push).toHaveBeenCalledWith('/pathway/5f9d5f2b9d9d4b2d9c9d5f2e');
  });
  
  it('should render pathway detail page', async () => {
    render(<PathwayDetail />);
    
    await waitFor(() => {
      expect(screen.getByText(/express entry/i)).toBeInTheDocument();
      expect(screen.getByText(/express entry pathway for skilled workers/i)).toBeInTheDocument();
    });
    
    expect(screen.getByText(/eligibility criteria/i)).toBeInTheDocument();
    expect(screen.getByText(/processing time/i)).toBeInTheDocument();
    expect(screen.getByText(/application fee/i)).toBeInTheDocument();
  });
  
  it('should check eligibility for pathway', async () => {
    render(<PathwayDetail />);
    
    await waitFor(() => {
      expect(screen.getByText(/express entry/i)).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByRole('button', { name: /check eligibility/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/you meet the eligibility criteria/i)).toBeInTheDocument();
      expect(screen.getByText(/score: 85/i)).toBeInTheDocument();
    });
  });
  
  it('should handle server error during pathway fetch', async () => {
    server.use(
      rest.get('http://localhost:3001/api/pathway', (req, res, ctx) => {
        return res(
          ctx.status(500),
          ctx.json({
            success: false,
            message: 'Internal server error'
          })
        );
      })
    );
    
    render(<PathwayList />);
    
    await waitFor(() => {
      expect(screen.getByText(/error loading pathways/i)).toBeInTheDocument();
    });
  });
});
