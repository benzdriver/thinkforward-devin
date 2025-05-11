

echo "Setting up ThinkForward AI test environment..."

echo "Installing test dependencies..."
npm install

echo "Installing backend dependencies..."
npm run install-backend-deps

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

chmod +x setup.sh

echo "Test environment setup complete!"
echo "To run tests, use: npm test"
echo "To run tests with coverage, use: npm run test:coverage"
