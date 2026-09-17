import express from 'express';
import {
  uploadProfilePhoto
} from '../middleware/upload.js';

import {
  getProfile,
  updateProfile,
  deleteAccount,
  uploadProfilePhotoController
} from '../controllers/playerController.js';

import {
  requireRole,
  requirePermission
} from '../middleware/auth.js';

const router =
  express.Router();

// ============================================
// PLAYER PROFILE
// ============================================

router.get(
  '/profile',
  requireRole('PLAYER'),
  requirePermission('EDIT_OWN_PROFILE'),
  getProfile
);

router.put(
  '/profile',
  requireRole('PLAYER'),
  requirePermission('EDIT_OWN_PROFILE'),
  updateProfile
);

router.post(
  '/profile/photo',
  requireRole('PLAYER'),
  requirePermission('EDIT_OWN_PROFILE'),
  uploadProfilePhoto.single('profilePhoto'),
  uploadProfilePhotoController
);

// ============================================
// DELETE PLAYER ACCOUNT
// ============================================

router.delete(
  '/account',
  requireRole('PLAYER'),
  requirePermission('DELETE_OWN_ACCOUNT'),
  deleteAccount
);

export default router;