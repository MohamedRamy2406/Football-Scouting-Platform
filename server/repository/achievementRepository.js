export async function getAchievementsByPlayerId(client, playerId) {
  const result = await client.query(
    `SELECT
       id,
       player_id,
       title,
       description,
       achievement_date
     FROM player_achievements
     WHERE player_id = $1
     ORDER BY achievement_date DESC NULLS LAST, id DESC`,
    [playerId]
  );

  return result.rows;
}


export async function createAchievement(
  client,
  playerId,
  data
) {
  const result = await client.query(
    `INSERT INTO player_achievements (
       player_id,
       title,
       description,
       achievement_date
     )
     VALUES ($1, $2, $3, $4)
     RETURNING
       id,
       player_id,
       title,
       description,
       achievement_date`,
    [
      playerId,
      data.title,
      data.description || null,
      data.achievementDate || null
    ]
  );

  return result.rows[0];
}


export async function updateAchievement(
  client,
  playerId,
  achievementId,
  data
) {
  const result = await client.query(
    `UPDATE player_achievements
     SET
       title = $1,
       description = $2,
       achievement_date = $3
     WHERE id = $4
       AND player_id = $5
     RETURNING
       id,
       player_id,
       title,
       description,
       achievement_date`,
    [
      data.title,
      data.description || null,
      data.achievementDate || null,
      achievementId,
      playerId
    ]
  );

  return result.rows[0] || null;
}


export async function deleteAchievement(
  client,
  playerId,
  achievementId
) {
  const result = await client.query(
    `DELETE FROM player_achievements
     WHERE id = $1
       AND player_id = $2`,
    [
      achievementId,
      playerId
    ]
  );

  return result.rowCount === 1;
}