import {
  getClubHistory,
  addClubHistory,
  editClubHistory,
  removeClubHistory
} from '../services/clubHistoryService.js';


// ============================================
// GET CLUB HISTORY
// ============================================

export async function getClubHistoryController(req, res, next) {
  try {
    const playerId = req.session.user.id;

    const history = await getClubHistory(playerId);

    res.status(200).json({
      success: true,
      history
    });

  } catch (error) {
    next(error);
  }
}


// ============================================
// CREATE CLUB HISTORY
// ============================================

export async function createClubHistoryController(req, res, next) {
  try {
    const playerId = req.session.user.id;

    const history = await addClubHistory(
      playerId,
      req.body
    );

    res.status(201).json({
      success: true,
      history
    });

  } catch (error) {
    next(error);
  }
}


// ============================================
// UPDATE CLUB HISTORY
// ============================================

export async function updateClubHistoryController(req, res, next) {
  try {
    const playerId = req.session.user.id;
    const historyId = req.params.id;

    const history = await editClubHistory(
      playerId,
      historyId,
      req.body
    );

    res.status(200).json({
      success: true,
      history
    });

  } catch (error) {
    next(error);
  }
}


// ============================================
// DELETE CLUB HISTORY
// ============================================

export async function deleteClubHistoryController(req, res, next) {
  try {
    const playerId = req.session.user.id;
    const historyId = req.params.id;

    const deleted = await removeClubHistory(
      playerId,
      historyId
    );

    res.status(200).json({
      success: true,
      deleted
    });

  } catch (error) {
    next(error);
  }
}