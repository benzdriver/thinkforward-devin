
echo "Setting up ThinkForward AI frontend unit test environment..."

mkdir -p test-results/frontend-unit

echo "Installing frontend test dependencies..."
npm install --no-save @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom @babel/preset-typescript

echo "Frontend unit test environment setup complete!"
echo "To run frontend unit tests, use: npm run test:frontend-unit"
echo "To run a specific frontend unit test file, use: npm test -- frontend-unit/components/ui/button.test.tsx"
