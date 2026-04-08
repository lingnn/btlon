const jwt = require('jsonwebtoken');

const ROLES = {
  CANDIDATE: 'candidate',
  CONTENT_ADMIN: 'content_admin',
  SYSTEM_ADMIN: 'system_admin',
};

const protect = (req, res, next) => {
  let token = req.headers.authorization;
  if (token && token.startsWith('Bearer')) {
    token = token.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && [ROLES.SYSTEM_ADMIN, ROLES.CONTENT_ADMIN].includes(req.user.role)) {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Admin only.' });
  }
};

const requireRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    if (allowedRoles.includes(req.user.role)) {
      return next();
    }

    return res.status(403).json({ message: 'Access denied. Insufficient permission.' });
  };
};

module.exports = { protect, adminOnly, requireRoles, ROLES };