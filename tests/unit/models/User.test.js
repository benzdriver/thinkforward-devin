const User = require('../../../backend/models/User');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

describe('User Model', () => {
  test('should create a new user', async () => {
    const userData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123'
    };
    
    const user = await User.create(userData);
    
    expect(user).toHaveProperty('_id');
    expect(user.name).toBe(userData.name);
    expect(user.email).toBe(userData.email);
    expect(user.password).not.toBe(userData.password);
  });
  
  test('should hash password before saving', async () => {
    const userData = {
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: 'securepass'
    };
    
    const user = await User.create(userData);
    
    const isMatch = await bcrypt.compare(userData.password, user.password);
    expect(isMatch).toBe(true);
  });
  
  test('should correctly compare passwords', async () => {
    const userData = {
      name: 'Bob Johnson',
      email: 'bob@example.com',
      password: 'mypassword'
    };
    
    const user = await User.create(userData);
    
    const correctPassword = await user.comparePassword(userData.password);
    expect(correctPassword).toBe(true);
    
    const wrongPassword = await user.comparePassword('wrongpassword');
    expect(wrongPassword).toBe(false);
  });
  
  test('should generate valid auth token', () => {
    const user = new User({
      _id: new mongoose.Types.ObjectId(),
      name: 'Test User',
      email: 'test@example.com',
      role: 'user'
    });
    
    const token = user.generateAuthToken();
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'thinkforward-secret-key');
    expect(decoded.userId.toString()).toBe(user._id.toString());
    expect(decoded.email).toBe(user.email);
    expect(decoded.role).toBe(user.role);
  });
  
  test('should generate and store refresh token', async () => {
    const user = new User({
      name: 'Refresh User',
      email: 'refresh@example.com',
      password: 'refreshpass'
    });
    
    await user.save();
    const refreshToken = user.generateRefreshToken();
    
    expect(user.refreshToken).toBe(refreshToken);
    
    const decoded = jwt.verify(
      refreshToken, 
      process.env.JWT_REFRESH_SECRET || 'thinkforward-refresh-secret-key'
    );
    expect(decoded.userId.toString()).toBe(user._id.toString());
  });
});
