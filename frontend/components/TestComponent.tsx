import React from 'react';

const TestComponent: React.FC = () => {
  const containerStyle = {
    padding: '1rem',
    margin: '1rem',
    backgroundColor: 'blue',
    color: 'white',
    borderRadius: '0.5rem',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
  };

  const headingStyle = {
    fontSize: '1.5rem',
    fontWeight: 'bold'
  };

  const paragraphStyle = {
    marginTop: '0.5rem'
  };

  return (
    <div style={containerStyle}>
      <h1 style={headingStyle}>Test Component (Inline Styles)</h1>
      <p style={paragraphStyle}>This is a test component with inline styles instead of Tailwind classes.</p>
    </div>
  );
};

export default TestComponent;
