import pool from '../db.js';

export async function getPlayerClubHistory(playerId) {
  const result = await pool.query(
    `
    SELECT
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
    ORDER BY start_date DESC NULLS LAST, id DESC
    `,
    [playerId]
  );

  return result.rows;
}


export async function createClubHistory(playerId, data) {
  const result = await pool.query(
    `
    INSERT INTO player_club_history (
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
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING
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
    `,
    [
      playerId,
      data.club_or_academy,
      data.start_date || null,
      data.end_date || null,
      data.position || null,
      data.matches ?? 0,
      data.starts ?? 0,
      data.goals ?? 0,
      data.assists ?? 0,
      data.minutes ?? 0
    ]
  );

  return result.rows[0];
}


export async function updateClubHistory(id, playerId, data) {
  const result = await pool.query(
    `
    UPDATE player_club_history
    SET
      club_or_academy = $1,
      start_date = $2,
      end_date = $3,
      position = $4,
      matches = $5,
      starts = $6,
      goals = $7,
      assists = $8,
      minutes = $9
    WHERE id = $10
      AND player_id = $11
    RETURNING
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
    `,
    [
      data.club_or_academy,
      data.start_date || null,
      data.end_date || null,
      data.position || null,
      data.matches ?? 0,
      data.starts ?? 0,
      data.goals ?? 0,
      data.assists ?? 0,
      data.minutes ?? 0,
      id,
      playerId
    ]
  );

  return result.rows[0] || null;
}


export async function deleteClubHistory(id, playerId) {
  const result = await pool.query(
    `
    DELETE FROM player_club_history
    WHERE id = $1
      AND player_id = $2
    RETURNING id
    `,
    [id, playerId]
  );

  return result.rows[0] || null;
}