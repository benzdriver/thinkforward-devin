import React from 'react';
import { render } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../../../frontend/lib/api';

const AllProviders = ({ children }) => {
  beforeEach(() => {
    queryClient.clear();
  });
  
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

const customRender = (ui, options) => 
  render(ui, { wrapper: AllProviders, ...options });

export * from '@testing-library/react';

export { customRender as render };
