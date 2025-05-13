
echo "Running ThinkForward AI frontend unit tests..."

cd ../frontend

npm test -- --testPathPattern=__tests__

echo "Frontend tests completed!"
