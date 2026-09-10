import bcrypt from 'bcrypt';

import {
  findUserByEmail,
  createUser,
  createPlayerProfile,
  createScoutProfile,
  getClient
} from '../repositories/userRepository.js';


// ============================================
// NORMALIZE EMAIL
// ============================================

function normalizeEmail(email) {

  return email.trim().toLowerCase();

}


// ============================================
// REGISTER USER
// ============================================

export async function registerUser({
  firstName,
  lastName,
  email,
  password,
  role
}) {

  const client = await getClient();

  try {

    await client.query('BEGIN');


    // Normalize input

    const normalizedFirstName = firstName.trim();
    const normalizedLastName = lastName.trim();
    const normalizedEmail = normalizeEmail(email);


    // Check whether email already exists

    const existingUser = await findUserByEmail(
      client,
      normalizedEmail
    );


    if (existingUser) {

      await client.query('ROLLBACK');

      return {
        success: false,
        status: 400,
        message: 'Email already registered.'
      };

    }


    // Hash password

    const hashedPassword = await bcrypt.hash(
      password,
      12
    );


    // Create user

    const newUser = await createUser(
      client,
      {
        firstName: normalizedFirstName,
        lastName: normalizedLastName,
        email: normalizedEmail,
        password: hashedPassword,
        role
      }
    );


    // Create correct profile

    if (role === 'PLAYER') {

      await createPlayerProfile(
        client,
        newUser.id
      );

    }


    if (role === 'SCOUT') {

      await createScoutProfile(
        client,
        newUser.id
      );

    }


    // Commit transaction

    await client.query('COMMIT');


    return {
      success: true,
      user: newUser
    };


  } catch (error) {

    await client.query('ROLLBACK');

    throw error;

  } finally {

    client.release();

  }

}


// ============================================
// LOGIN USER
// ============================================

export async function loginUser({
  email,
  password
}) {

  const client = await getClient();

  try {

    const normalizedEmail =
      normalizeEmail(email);


    const user = await findUserByEmail(
      client,
      normalizedEmail
    );


    if (!user) {

      return {
        success: false,
        status: 401,
        message: 'Invalid email or password.'
      };

    }


    const passwordMatches =
      await bcrypt.compare(
        password,
        user.password
      );


    if (!passwordMatches) {

      return {
        success: false,
        status: 401,
        message: 'Invalid email or password.'
      };

    }


    return {
      success: true,
      user
    };


  } finally {

    client.release();

  }

}