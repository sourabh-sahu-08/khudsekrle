const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    console.log("DEBUG: No token found in authorization header");
    return res.status(401).json({ success: false, message: 'Not authorized - No token provided' });
  }

  try {
    // Verify token
    console.log("DEBUG: Verifying token with length:", token.length);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user still exists
    req.user = await User.findById(decoded.id);
    
    if (!req.user) {
      console.log("DEBUG: Token valid but user not found in database for ID:", decoded.id);
      return res.status(401).json({ success: false, message: 'Not authorized - User no longer exists' });
    }

    console.log("DEBUG: Authentication successful for user:", req.user.email);
    next();
  } catch (err) {
    console.error("DEBUG: JWT VERIFICATION ERROR:", err.message);
    return res.status(401).json({ success: false, message: 'Not authorized - Invalid or expired token' });
  }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`,
      });
    }
    next();
  };
};
