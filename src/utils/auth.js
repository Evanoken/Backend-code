const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config');

// Generate JWT token
const generateToken = (userId) => {
  const token = jwt.sign({ userId }, SECRET_KEY, { expiresIn: '1h' });
  return token;
};

// Verify JWT token
const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    return decoded.userId;
  } catch (error) {
    return null;
  }
};

module.exports = {
  generateToken,
  verifyToken,
};
