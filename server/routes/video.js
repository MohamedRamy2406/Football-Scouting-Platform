import express from 'express';

import {
  createVideoController,
  getPlayerVideosController,
  deletePlayerVideoController
} from '../controllers/videoController.js';

import {
  requireAuth,
  requireRole,
  requirePermission
} from '../middleware/auth.js';

import {
  uploadPlayerVideo
} from '../middleware/upload.js';


const router =
  express.Router();


// ============================================
// GET PLAYER VIDEOS
// ============================================

router.get(
  '/',
  requireAuth,
  requireRole('PLAYER'),
  getPlayerVideosController
);


// ============================================
// UPLOAD PLAYER VIDEO
// ============================================

router.post(
  '/',
  requireAuth,
  requireRole('PLAYER'),
  requirePermission('UPLOAD_VIDEO'),
  uploadPlayerVideo.single('video'),
  createVideoController
);


// ============================================
// DELETE PLAYER VIDEO
// ============================================

router.delete(
  '/:id',
  requireAuth,
  requireRole('PLAYER'),
  requirePermission('UPLOAD_VIDEO'),
  deletePlayerVideoController
);


export default router;