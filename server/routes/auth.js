import express from 'express';

import {
  register,
  login
} from '../controllers/authController.js';

const router = express.Router();


// ============================================
// REGISTER
// POST /api/auth/register
// ============================================

router.post(
  '/register',
  register
);


// ============================================
// LOGIN
// POST /api/auth/login
// ============================================

router.post(
  '/login',
  login
);


// ============================================
// CHECK CURRENT SESSION
// GET /api/auth/me
// ============================================

router.get('/me', (req, res) => {

  if (!req.session || !req.session.user) {
    return res.status(401).json({
      authenticated: false,
      user: null
    });
  }

  return res.status(200).json({
    authenticated: true,
    user: req.session.user
  });

});


// ============================================
// LOGOUT
// POST /api/auth/logout
// ============================================

router.post('/logout', (req, res) => {

  if (!req.session) {
    return res.status(200).json({
      message: 'Logged out successfully.'
    });
  }

  req.session.destroy((error) => {

    if (error) {
      console.error('Logout error:', error);

      return res.status(500).json({
        message: 'Could not log out.'
      });
    }

    res.clearCookie('connect.sid');

    return res.status(200).json({
      message: 'Logged out successfully.'
    });

  });

});


export default router;