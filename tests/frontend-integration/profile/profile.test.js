import React from 'react';
import { rest } from 'msw';
import { server } from '../setup/test-environment';
import { render, screen, fireEvent, waitFor } from '../utils/test-utils';
import ProfilePage from '../../../frontend/pages/profile';

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

describe('Profile Integration Test', () => {
  beforeAll(() => {
    const { profileHandlers } = require('../mocks/handlers');
    
    server.use(...profileHandlers);
  });
  
  it('should fetch and display user profile data', async () => {
    render(<ProfilePage />);
    
    await waitFor(() => {
      expect(screen.getByText(/Test User/i)).toBeInTheDocument();
      expect(screen.getByText(/test@example.com/i)).toBeInTheDocument();
    });
    
    expect(screen.getByText(/personal information/i)).toBeInTheDocument();
    expect(screen.getByText(/education/i)).toBeInTheDocument();
    expect(screen.getByText(/work experience/i)).toBeInTheDocument();
  });
  
  it('should handle profile update successfully', async () => {
    render(<ProfilePage />);
    
    await waitFor(() => {
      expect(screen.getByText(/personal information/i)).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText(/edit personal information/i));
    
    fireEvent.change(screen.getByLabelText(/first name/i), {
      target: { value: 'Updated' }
    });
    
    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/profile updated successfully/i)).toBeInTheDocument();
    });
  });
  
  
  it('should handle server error during profile fetch', async () => {
    server.use(
      rest.get('http://localhost:3001/api/profile/:userId', (req, res, ctx) => {
        return res(
          ctx.status(500),
          ctx.json({
            success: false,
            message: 'Internal server error'
          })
        );
      })
    );
    
    render(<ProfilePage />);
    
    await waitFor(() => {
      expect(screen.getByText(/error loading profile/i)).toBeInTheDocument();
    });
  });
});
