import {
  getClient,
  findPlayerProfileByUserId,
  updatePlayerProfile,
  deletePlayerAccount
} from '../repository/playerRepository.js';

import {
  validatePlayerProfile
} from '../validation/playerValidation.js';

const REQUIRED_FIELDS = [
  'firstName',
  'lastName',
  'profilePhoto',
  'dateOfBirth',
  'positions',
  'preferredFoot',
  'height',
  'weight',
  'nationality',
  'currentClub',
  'bio'
];

function isCompleted(value) {

  if (
    value === null ||
    value === undefined
  ) {
    return false;
  }

  if (typeof value === 'string') {
    return value.trim().length > 0;
  }

  return true;
}

function isCurrentClubCompleted(
  hasCurrentClub,
  currentClub
) {

  /*
   * The player explicitly said
   * they do NOT currently belong
   * to a club or academy.
   *
   * That is a valid completed answer.
   */
  if (hasCurrentClub === false) {
    return true;
  }

  /*
   * The player said YES, so a club
   * or academy name is required.
   */
  return isCompleted(currentClub);
}

function calculateProfileCompletion(data) {

  const completedFields =
    REQUIRED_FIELDS.filter(
      (field) => {

        /*
         * Current club has special
         * Yes / No logic.
         */
        if (field === 'currentClub') {

          return isCurrentClubCompleted(
            data.hasCurrentClub,
            data.currentClub
          );

        }

        return isCompleted(
          data[field]
        );

      }
    );

  const percentage = Math.round(
    (
      completedFields.length /
      REQUIRED_FIELDS.length
    ) * 100
  );

  return {
    profileCompletionPercentage:
      percentage,

    profileCompleted:
      percentage === 100,

    completedRequiredFields:
      completedFields.length,

    totalRequiredFields:
      REQUIRED_FIELDS.length
  };
}

function serializeProfile(result) {

  const completion =
    calculateProfileCompletion({

      firstName:
        result.user.first_name,

      lastName:
        result.user.last_name,

      profilePhoto:
        result.profile.profile_photo,

      dateOfBirth:
        result.profile.date_of_birth,

      positions:
        result.profile.positions,

      preferredFoot:
        result.profile.preferred_foot,

      height:
        result.profile.height,

      weight:
        result.profile.weight,

      nationality:
        result.profile.nationality,

      currentClub:
        result.profile.current_club,

      hasCurrentClub:
        result.profile.has_current_club,

      bio:
        result.profile.bio

    });

  return {

    id:
      result.user.id,

    firstName:
      result.user.first_name,

    lastName:
      result.user.last_name,

    email:
      result.user.email,

    phone:
      result.user.phone,

    role:
      result.user.role,

    profile: {

      id:
        result.profile.id,

      dateOfBirth:
        result.profile.date_of_birth,

      city:
        result.profile.city,

      preferredFoot:
        result.profile.preferred_foot,

      height:
        result.profile.height,

      weight:
        result.profile.weight,

      nationality:
        result.profile.nationality,

      currentClub:
        result.profile.current_club,

      hasCurrentClub:
        result.profile.has_current_club,

      profilePhoto:
        result.profile.profile_photo,

      bio:
        result.profile.bio,

      positions:
        result.profile.positions

    },

    clubHistory:
      result.clubHistory,

    achievements:
      result.achievements,

    videos:
      result.videos,

    ...completion
  };
}

// ============================================
// GET PLAYER PROFILE
// ============================================

export async function getPlayerProfile(userId) {

  const client =
    await getClient();

  try {

    const result =
      await findPlayerProfileByUserId(
        client,
        userId
      );

    if (!result) {

      const error =
        new Error(
          'Player profile not found.'
        );

      error.statusCode = 404;

      throw error;
    }

    return serializeProfile(result);

  } finally {

    client.release();

  }
}

// ============================================
// UPDATE PLAYER PROFILE
// ============================================

export async function editPlayerProfile(
  userId,
  data
) {

  const validationErrors =
    validatePlayerProfile(data);

  if (
    Object.keys(validationErrors).length > 0
  ) {

    const error =
      new Error(
        'Invalid player profile data.'
      );

    error.statusCode = 400;
    error.details = validationErrors;

    throw error;
  }

  const client =
    await getClient();

  try {

    await client.query('BEGIN');

    const existing =
      await findPlayerProfileByUserId(
        client,
        userId
      );

    if (!existing) {

      const error =
        new Error(
          'Player profile not found.'
        );

      error.statusCode = 404;

      throw error;
    }

    await updatePlayerProfile(
      client,
      userId,
      data
    );

    await client.query('COMMIT');

    const updated =
      await findPlayerProfileByUserId(
        client,
        userId
      );

    return serializeProfile(updated);

  } catch (error) {

    await client.query('ROLLBACK');

    throw error;

  } finally {

    client.release();

  }
}

// ============================================
// DELETE PLAYER ACCOUNT
// ============================================

export async function removePlayerAccount(
  userId
) {

  const client =
    await getClient();

  try {

    await client.query('BEGIN');

    const deleted =
      await deletePlayerAccount(
        client,
        userId
      );

    if (!deleted) {

      const error =
        new Error(
          'Player account not found.'
        );

      error.statusCode = 404;

      throw error;
    }

    await client.query('COMMIT');

    return {
      success: true
    };

  } catch (error) {

    await client.query('ROLLBACK');

    throw error;

  } finally {

    client.release();

  }
}

export async function updatePlayerPhoto(
  userId,
  photoUrl
) {

  const client =
    await getClient();

  try {

    const existing =
      await findPlayerProfileByUserId(
        client,
        userId
      );

    if (!existing) {

      const error =
        new Error(
          'Player profile not found.'
        );

      error.statusCode = 404;

      throw error;
    }

    await updatePlayerProfile(
      client,
      userId,
      {
        profilePhoto: photoUrl
      }
    );

    const updated =
      await findPlayerProfileByUserId(
        client,
        userId
      );

    return serializeProfile(updated);

  } finally {

    client.release();

  }
}