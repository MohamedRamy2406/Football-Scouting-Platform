import {
  getPlayerClubHistory,
  createClubHistory,
  updateClubHistory,
  deleteClubHistory
} from '../repository/clubHistoryRepository.js';

import { validateClubHistory } from '../validation/clubHistoryValidation.js';


export async function getClubHistory(playerId) {
  return await getPlayerClubHistory(playerId);
}


export async function addClubHistory(playerId, data) {
  const validation = validateClubHistory(data);

  if (!validation.valid) {
    const error = new Error('Validation failed.');
    error.status = 400;
    error.details = validation.errors;

    throw error;
  }

  return await createClubHistory(playerId, data);
}


export async function editClubHistory(playerId, id, data) {
  const validation = validateClubHistory(data);

  if (!validation.valid) {
    const error = new Error('Validation failed.');
    error.status = 400;
    error.details = validation.errors;

    throw error;
  }

  const updated = await updateClubHistory(id, playerId, data);

  if (!updated) {
    const error = new Error('Club history record not found.');
    error.status = 404;

    throw error;
  }

  return updated;
}


export async function removeClubHistory(playerId, id) {
  const deleted = await deleteClubHistory(id, playerId);

  if (!deleted) {
    const error = new Error('Club history record not found.');
    error.status = 404;

    throw error;
  }

  return deleted;
}