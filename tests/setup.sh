
echo "Setting up ThinkForward AI test environment..."

echo "Installing test dependencies..."
npm install

echo "Installing backend dependencies..."
npm run install-backend-deps

echo "Installing frontend testing dependencies..."
npm run install-frontend-deps

mkdir -p frontend-integration/mocks
mkdir -p frontend-integration/setup
mkdir -p frontend-integration/utils
mkdir -p frontend-integration/auth
mkdir -p frontend-integration/profile
mkdir -p frontend-integration/assessment
mkdir -p frontend-integration/pathway

if [ ! -f .env.test ]; then
  echo "Creating .env.test file..."
  cat > .env.test << EOL
JWT_SECRET=thinkforward-test-secret-key
JWT_REFRESH_SECRET=thinkforward-test-refresh-secret-key
MONGODB_URI=mongodb://localhost:27017/thinkforward-test
NODE_ENV=test
PORT=5001
EOL
  echo ".env.test file created."
else
  echo ".env.test file already exists."
fi

echo "Setting up Mock Service Worker..."
npx msw init ../frontend/public/ --save

echo "Test environment setup complete!"
echo "To run backend tests, use: npm test"
echo "To run frontend tests, use: npm run test:frontend"
echo "To run tests with coverage, use: npm run test:coverage"
