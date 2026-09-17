import {
  getClient
} from '../repository/playerRepository.js';

import {
  getAchievementsByPlayerId,
  createAchievement,
  updateAchievement,
  deleteAchievement
} from '../repository/achievementRepository.js';

import {
  validateAchievement
} from '../validation/achievementValidation.js';

import {
  findPlayerProfileByUserId
} from '../repository/playerRepository.js';


async function getPlayerId(client, userId) {
  const result = await findPlayerProfileByUserId(
    client,
    userId
  );

  if (!result) {
    throw new Error('Player profile not found.');
  }

  return result.profile.id;
}


export async function getPlayerAchievements(userId) {
  const client = await getClient();

  try {
    const playerId = await getPlayerId(
      client,
      userId
    );

    return await getAchievementsByPlayerId(
      client,
      playerId
    );
  } finally {
    client.release();
  }
}


export async function addAchievement(
  userId,
  data
) {
  const validation = validateAchievement(data);

  if (!validation.valid) {
    const error = new Error(
      'Invalid achievement data.'
    );

    error.status = 400;
    error.errors = validation.errors;

    throw error;
  }

  const client = await getClient();

  try {
    const playerId = await getPlayerId(
      client,
      userId
    );

    return await createAchievement(
      client,
      playerId,
      {
        title: String(data.title).trim(),
        description: data.description
          ? String(data.description).trim()
          : null,
        achievementDate:
          data.achievementDate || null
      }
    );
  } finally {
    client.release();
  }
}


export async function editAchievement(
  userId,
  achievementId,
  data
) {
  const validation = validateAchievement(data);

  if (!validation.valid) {
    const error = new Error(
      'Invalid achievement data.'
    );

    error.status = 400;
    error.errors = validation.errors;

    throw error;
  }

  const client = await getClient();

  try {
    const playerId = await getPlayerId(
      client,
      userId
    );

    const achievement =
      await updateAchievement(
        client,
        playerId,
        achievementId,
        {
          title: String(data.title).trim(),
          description: data.description
            ? String(data.description).trim()
            : null,
          achievementDate:
            data.achievementDate || null
        }
      );

    if (!achievement) {
      const error = new Error(
        'Achievement not found.'
      );

      error.status = 404;

      throw error;
    }

    return achievement;
  } finally {
    client.release();
  }
}


export async function removeAchievement(
  userId,
  achievementId
) {
  const client = await getClient();

  try {
    const playerId = await getPlayerId(
      client,
      userId
    );

    const deleted =
      await deleteAchievement(
        client,
        playerId,
        achievementId
      );

    if (!deleted) {
      const error = new Error(
        'Achievement not found.'
      );

      error.status = 404;

      throw error;
    }

    return true;
  } finally {
    client.release();
  }
}