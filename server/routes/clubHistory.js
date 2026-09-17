import express from 'express';

import {
  getClubHistoryController,
  createClubHistoryController,
  updateClubHistoryController,
  deleteClubHistoryController
} from '../controllers/clubHistoryController.js';

import { requireAuth } from '../middleware/auth.js';

const router = express.Router();


// Get current player's club history
router.get(
  '/',
  requireAuth,
  getClubHistoryController
);


// Add club history
router.post(
  '/',
  requireAuth,
  createClubHistoryController
);


// Update club history
router.put(
  '/:id',
  requireAuth,
  updateClubHistoryController
);


// Delete club history
router.delete(
  '/:id',
  requireAuth,
  deleteClubHistoryController
);


export default router;