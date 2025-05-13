module.exports = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/../../frontend/$1',
    '\\.(css|less|scss|sass)$': '<rootDir>/../frontend-integration/mocks/styleMock.js',
    '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/../frontend-integration/mocks/fileMock.js'
  },
  testEnvironment: 'jest-environment-jsdom',
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest'
  },
  moduleDirectories: ['node_modules', '../../frontend'],
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
};
