import pool from '../db.js';

// ============================================
// GET DATABASE CLIENT
// ============================================

export async function getClient() {
  return pool.connect();
}

// ============================================
// GET PLAYER PROFILE
// ============================================

export async function findPlayerProfileByUserId(client, userId) {
  const userResult = await client.query(
    `SELECT
       id,
       first_name,
       last_name,
       email,
       phone,
       role
     FROM users
     WHERE id = $1
       AND role = 'PLAYER'`,
    [userId]
  );

  const user = userResult.rows[0] || null;

  if (!user) {
    return null;
  }

  const profileResult = await client.query(
    `SELECT
       id,
       user_id,
       date_of_birth,
       city,
       preferred_foot,
       height,
       weight,
       nationality,
       current_club,
       has_current_club,
       profile_photo,
       bio,
       positions
     FROM player_profiles
     WHERE user_id = $1`,
    [userId]
  );

  const profile = profileResult.rows[0] || null;

  if (!profile) {
    return null;
  }

  const historyResult = await client.query(
    `SELECT
       id,
       player_id,
       club_or_academy,
       start_date,
       end_date,
       position,
       matches,
       starts,
       goals,
       assists,
       minutes
     FROM player_club_history
     WHERE player_id = $1
     ORDER BY start_date DESC, id DESC`,
    [profile.id]
  );

  const achievementsResult = await client.query(
    `SELECT
       id,
       player_id,
       title,
       description,
       achievement_date
     FROM player_achievements
     WHERE player_id = $1
     ORDER BY achievement_date DESC NULLS LAST, id DESC`,
    [profile.id]
  );

  const videosResult = await client.query(
    `SELECT
       id,
       player_id,
       title,
       description,
       category,
       video_url,
       thumbnail_url,
       duration,
       upload_date,
       visibility
     FROM videos
     WHERE player_id = $1
     ORDER BY upload_date DESC NULLS LAST, id DESC`,
    [profile.id]
  );

  return {
    user,
    profile,
    clubHistory: historyResult.rows,
    achievements: achievementsResult.rows,
    videos: videosResult.rows
  };
}

// ============================================
// UPDATE PLAYER PROFILE
// ============================================

export async function updatePlayerProfile(client, userId, data) {
  const userFields = [];
  const userValues = [];

  if (data.firstName !== undefined) {
    userFields.push(`first_name = $${userValues.length + 1}`);
    userValues.push(String(data.firstName).trim());
  }

  if (data.lastName !== undefined) {
    userFields.push(`last_name = $${userValues.length + 1}`);
    userValues.push(String(data.lastName).trim());
  }

  if (userFields.length > 0) {
    userValues.push(userId);

    await client.query(
      `UPDATE users
       SET ${userFields.join(', ')}
       WHERE id = $${userValues.length}
         AND role = 'PLAYER'`,
      userValues
    );
  }

  const profileFields = [];
  const profileValues = [];

  const profileColumns = {
    profilePhoto: 'profile_photo',
    dateOfBirth: 'date_of_birth',
    city: 'city',
    preferredFoot: 'preferred_foot',
    height: 'height',
    weight: 'weight',
    nationality: 'nationality',
    currentClub: 'current_club',
    hasCurrentClub: 'has_current_club',
    bio: 'bio',
    positions: 'positions'
  };

  for (const [field, column] of Object.entries(profileColumns)) {
    if (data[field] !== undefined) {
      profileFields.push(
        `${column} = $${profileValues.length + 1}`
      );

      profileValues.push(
        data[field] === ''
          ? null
          : data[field]
      );
    }
  }

  if (profileFields.length > 0) {
    profileValues.push(userId);

    await client.query(
      `UPDATE player_profiles
       SET ${profileFields.join(', ')}
       WHERE user_id = $${profileValues.length}`,
      profileValues
    );
  }
}

// ============================================
// DELETE PLAYER ACCOUNT DATA
// ============================================

export async function deletePlayerAccount(client, userId) {
  const profileResult = await client.query(
    `SELECT id
     FROM player_profiles
     WHERE user_id = $1
     FOR UPDATE`,
    [userId]
  );

  const playerProfileId =
    profileResult.rows[0]?.id;

  if (!playerProfileId) {
    return false;
  }

  // Messages can reference trial offers,
  // so delete them before deleting offers.
  await client.query(
    `DELETE FROM messages
     WHERE sender_id = $1
        OR receiver_id = $1
        OR trial_offer_id IN (
          SELECT id
          FROM trial_offers
          WHERE player_id = $2
        )`,
    [userId, playerProfileId]
  );

  // Notifications can reference trial offers.
  await client.query(
    `DELETE FROM notifications
     WHERE user_id = $1
        OR trial_offer_id IN (
          SELECT id
          FROM trial_offers
          WHERE player_id = $2
        )`,
    [userId, playerProfileId]
  );

  await client.query(
    `DELETE FROM scouting_reports
     WHERE player_id = $1`,
    [playerProfileId]
  );

  await client.query(
    `DELETE FROM scout_bookmarks
     WHERE player_id = $1`,
    [playerProfileId]
  );

  await client.query(
    `DELETE FROM videos
     WHERE player_id = $1`,
    [playerProfileId]
  );

  await client.query(
    `DELETE FROM player_club_history
     WHERE player_id = $1`,
    [playerProfileId]
  );

  await client.query(
    `DELETE FROM player_achievements
     WHERE player_id = $1`,
    [playerProfileId]
  );

  await client.query(
    `DELETE FROM trial_offers
     WHERE player_id = $1`,
    [playerProfileId]
  );

  await client.query(
    `DELETE FROM player_profiles
     WHERE id = $1`,
    [playerProfileId]
  );

  const userResult = await client.query(
    `DELETE FROM users
     WHERE id = $1
       AND role = 'PLAYER'`,
    [userId]
  );

  return userResult.rowCount === 1;
}