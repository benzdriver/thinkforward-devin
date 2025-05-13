module.exports = {
  rootDir: './',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/../../frontend/$1',
    '\\.(css|less|scss|sass)$': '<rootDir>/../frontend-integration/mocks/styleMock.js',
    '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/../frontend-integration/mocks/fileMock.js',
    '^../../mocks/toggle.tsx$': '<rootDir>/mocks/toggle.tsx',
    '^../../mocks/react-query-wrapper.tsx$': '<rootDir>/mocks/react-query-wrapper.tsx'
  },
  testEnvironment: 'jest-environment-jsdom',
  testEnvironmentOptions: {
    customExportConditions: [''],
  },
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { configFile: '../babel.config.js' }]
  },
  moduleDirectories: ['node_modules', '../../frontend', '../../node_modules', './'],
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],
  resolver: undefined,
  transformIgnorePatterns: [
    '/node_modules/(?!(@testing-library|@babel)/)'
  ]
};
