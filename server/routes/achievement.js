import express from 'express';

import {
  getAchievements,
  createAchievementController,
  updateAchievementController,
  deleteAchievementController
} from '../controllers/achievementController.js';

import {
  requireRole,
  requirePermission
} from '../middleware/auth.js';

const router = express.Router();


router.get(
  '/',
  requireRole('PLAYER'),
  requirePermission('EDIT_OWN_PROFILE'),
  getAchievements
);


router.post(
  '/',
  requireRole('PLAYER'),
  requirePermission('EDIT_OWN_PROFILE'),
  createAchievementController
);


router.put(
  '/:id',
  requireRole('PLAYER'),
  requirePermission('EDIT_OWN_PROFILE'),
  updateAchievementController
);


router.delete(
  '/:id',
  requireRole('PLAYER'),
  requirePermission('EDIT_OWN_PROFILE'),
  deleteAchievementController
);


export default router;