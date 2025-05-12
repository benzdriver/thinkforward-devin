
echo "Setting up ThinkForward AI frontend test environment..."

mkdir -p test-results/frontend

echo "Installing frontend test dependencies..."
npm install --no-save @testing-library/react @testing-library/jest-dom @testing-library/user-event msw jsdom next-router-mock

echo "Setting up Mock Service Worker..."
npx msw init public/ --save

echo "Frontend test environment setup complete!"
echo "To run frontend integration tests, use: npm run test:frontend"
echo "To run a specific frontend test file, use: npm test -- frontend-integration/auth/login.test.js"
