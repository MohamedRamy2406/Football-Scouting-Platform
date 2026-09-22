import pool from '../db.js';


// ============================================
// CREATE VIDEO
// ============================================

export async function createVideo(
  playerId,
  videoData
) {

  const {
    title,
    description,
    category,
    videoUrl,
    duration
  } = videoData;


  const result =
    await pool.query(
      `
        INSERT INTO videos (
          player_id,
          title,
          description,
          category,
          video_url,
          duration
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING
          id,
          player_id,
          title,
          description,
          category,
          video_url,
          duration,
          upload_date
      `,
      [
        playerId,
        title,
        description,
        category,
        videoUrl,
        duration
      ]
    );


  return result.rows[0];

}


// ============================================
// GET ALL VIDEOS FOR A PLAYER
// ============================================

export async function findVideosByPlayerId(
  playerId
) {

  const result =
    await pool.query(
      `
        SELECT
          id,
          player_id,
          title,
          description,
          category,
          video_url,
          duration,
          upload_date
        FROM videos
        WHERE player_id = $1
        ORDER BY upload_date DESC, id DESC
      `,
      [playerId]
    );


  return result.rows;

}


// ============================================
// GET ONE VIDEO BELONGING TO A PLAYER
// ============================================

export async function findVideoByIdAndPlayerId(
  videoId,
  playerId
) {

  const result =
    await pool.query(
      `
        SELECT
          id,
          player_id,
          title,
          description,
          category,
          video_url,
          duration,
          upload_date
        FROM videos
        WHERE id = $1
          AND player_id = $2
        LIMIT 1
      `,
      [
        videoId,
        playerId
      ]
    );


  return result.rows[0] || null;

}


// ============================================
// DELETE VIDEO
// ============================================

export async function deleteVideoByIdAndPlayerId(
  videoId,
  playerId
) {

  const result =
    await pool.query(
      `
        DELETE FROM videos
        WHERE id = $1
          AND player_id = $2
        RETURNING
          id,
          player_id,
          video_url
      `,
      [
        videoId,
        playerId
      ]
    );


  return result.rows[0] || null;

}