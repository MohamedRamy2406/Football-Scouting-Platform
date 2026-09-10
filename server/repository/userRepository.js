import pool from '../db.js';


// ============================================
// FIND USER BY EMAIL
// ============================================

export async function findUserByEmail(client, email) {

  const result = await client.query(
    `SELECT id, first_name, last_name, email, password, role
     FROM users
     WHERE email = $1`,
    [email]
  );

  return result.rows[0] || null;
}


// ============================================
// CREATE USER
// ============================================

export async function createUser(
  client,
  {
    firstName,
    lastName,
    email,
    password,
    role
  }
) {

  const result = await client.query(
    `INSERT INTO users
      (first_name, last_name, email, password, role)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, first_name, last_name, email, role`,
    [
      firstName,
      lastName,
      email,
      password,
      role
    ]
  );

  return result.rows[0];
}


// ============================================
// CREATE PLAYER PROFILE
// ============================================

export async function createPlayerProfile(client, userId) {

  await client.query(
    `INSERT INTO player_profiles (user_id)
     VALUES ($1)`,
    [userId]
  );
}


// ============================================
// CREATE SCOUT PROFILE
// ============================================

export async function createScoutProfile(client, userId) {

  await client.query(
    `INSERT INTO scout_profiles (user_id)
     VALUES ($1)`,
    [userId]
  );
}


// ============================================
// GET DATABASE CLIENT
// ============================================

export async function getClient() {

  return pool.connect();
}