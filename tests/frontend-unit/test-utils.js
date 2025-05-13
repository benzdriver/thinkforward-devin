import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Create a custom render function that doesn't use act directly
const render = (ui, options = {}) => {
  const Wrapper = ({ children }) => {
    return <React.StrictMode>{children}</React.StrictMode>;
  };

  const result = rtlRender(ui, { wrapper: Wrapper, ...options });
  
  return {
    user: userEvent.setup(),
    ...result
  };
};

export * from '@testing-library/react';

export { render };
