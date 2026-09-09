import { hasPermission } from '../permissions.js';


// ============================================
// REQUIRE AUTHENTICATION
// ============================================

export function requireAuth(req, res, next) {

  if (!req.session || !req.session.user) {
    return res.status(401).json({
      message: 'Authentication required.'
    });
  }

  next();
}


// ============================================
// REQUIRE ROLE
// ============================================

export function requireRole(...allowedRoles) {

  return (req, res, next) => {

    if (!req.session || !req.session.user) {
      return res.status(401).json({
        message: 'Authentication required.'
      });
    }

    const userRole = req.session.user.role;

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        message: 'You do not have permission to perform this action.'
      });
    }

    next();
  };
}


// ============================================
// REQUIRE PERMISSION
// ============================================

export function requirePermission(permission) {

  return (req, res, next) => {

    // User must be logged in
    if (!req.session || !req.session.user) {
      return res.status(401).json({
        message: 'Authentication required.'
      });
    }

    const userRole = req.session.user.role;

    // Check permission
    if (!hasPermission(userRole, permission)) {
      return res.status(403).json({
        message: 'You do not have permission to perform this action.'
      });
    }

    next();
  };
}
