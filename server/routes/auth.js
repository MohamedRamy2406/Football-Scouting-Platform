import express from 'express';

import {
  register,
  login,
  getCurrentUser,
  logout,
  changePassword
} from '../controllers/authController.js';

import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.post(
  '/register',
  register
);

router.post(
  '/login',
  login
);

router.get(
  '/me',
  getCurrentUser
);

router.post(
  '/logout',
  logout
);

router.put(
  '/password',
  requireAuth,
  changePassword
);

export default router;