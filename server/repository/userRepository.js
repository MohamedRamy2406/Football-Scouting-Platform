import pool from '../db.js';


// ==============================
// Find User By Email
// ==============================

export async function findUserByEmail(email) {
  const result = await pool.query(
    `
    SELECT
      id,
      first_name,
      last_name,
      email,
      password,
      phone,
      role
    FROM users
    WHERE email = $1
    `,
    [email]
  );

  return result.rows[0] || null;
}


// ==============================
// Find User By ID
// ==============================

export async function findUserById(userId) {
  const result = await pool.query(
    `
    SELECT
      id,
      first_name,
      last_name,
      email,
      password,
      phone,
      role
    FROM users
    WHERE id = $1
    `,
    [userId]
  );

  return result.rows[0] || null;
}


// ==============================
// Update User Password
// ==============================

export async function updateUserPassword(
  userId,
  hashedPassword
) {
  const result = await pool.query(
    `
    UPDATE users
    SET password = $1
    WHERE id = $2
    RETURNING id
    `,
    [
      hashedPassword,
      userId
    ]
  );

  return result.rows[0] || null;
}


// ==============================
// Create User
// ==============================

export async function createUser(
  firstName,
  lastName,
  email,
  hashedPassword,
  phone,
  role
) {
  const result = await pool.query(
    `
    INSERT INTO users (
      first_name,
      last_name,
      email,
      password,
      phone,
      role
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING
      id,
      first_name,
      last_name,
      email,
      role
    `,
    [
      firstName,
      lastName,
      email,
      hashedPassword,
      phone,
      role
    ]
  );

  return result.rows[0];
}


// ==============================
// Create Player Profile
// ==============================

export async function createPlayerProfile(userId) {
  const result = await pool.query(
    `
    INSERT INTO player_profiles (user_id)
    VALUES ($1)
    RETURNING *
    `,
    [userId]
  );

  return result.rows[0];
}


// ==============================
// Create Scout Profile
// ==============================

export async function createScoutProfile(userId) {
  const result = await pool.query(
    `
    INSERT INTO scout_profiles (user_id)
    VALUES ($1)
    RETURNING *
    `,
    [userId]
  );

  
  return result.rows[0];
}