import bcrypt from 'bcrypt';

import {
  findUserByEmail,
  findUserById,
  createUser,
  createPlayerProfile,
  createScoutProfile,
  updateUserPassword
} from '../repository/userRepository.js';


// ==============================
// Normalize Email
// ==============================

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}


// ==============================
// Register User
// ==============================

export async function registerUser({
  firstName,
  lastName,
  email,
  password,
  phone,
  role
}) {
  const normalizedEmail = normalizeEmail(email);

  const existingUser = await findUserByEmail(
    normalizedEmail
  );

  if (existingUser) {
    const error = new Error(
      'Email already exists.'
    );

    error.statusCode = 409;

    throw error;
  }

  const hashedPassword = await bcrypt.hash(
    password,
    12
  );

  const user = await createUser(
    firstName,
    lastName,
    normalizedEmail,
    hashedPassword,
    phone,
    role
  );

  if (role === 'PLAYER') {
    await createPlayerProfile(user.id);
  }

  if (role === 'SCOUT') {
    await createScoutProfile(user.id);
  }

  return user;
}


// ==============================
// Login User
// ==============================

export async function loginUser(
  email,
  password
) {
  const normalizedEmail = normalizeEmail(email);

  const user = await findUserByEmail(
    normalizedEmail
  );

  if (!user) {
    const error = new Error(
      'Invalid email or password.'
    );

    error.statusCode = 401;

    throw error;
  }

  const passwordMatches = await bcrypt.compare(
    password,
    user.password
  );

  if (!passwordMatches) {
    const error = new Error(
      'Invalid email or password.'
    );

    error.statusCode = 401;

    throw error;
  }

  return {
    id: user.id,
    firstName: user.first_name,
    lastName: user.last_name,
    email: user.email,
    role: user.role
  };
}


// ==============================
// Change User Password
// ==============================

export async function changeUserPassword(
  userId,
  currentPassword,
  newPassword
) {
  const user = await findUserById(userId);

  if (!user) {
    const error = new Error(
      'User not found.'
    );

    error.statusCode = 404;

    throw error;
  }

  const currentPasswordMatches =
    await bcrypt.compare(
      currentPassword,
      user.password
    );

  if (!currentPasswordMatches) {
    const error = new Error(
      'Current password is incorrect.'
    );

    error.statusCode = 401;

    throw error;
  }

  const newPasswordMatchesCurrent =
    await bcrypt.compare(
      newPassword,
      user.password
    );

  if (newPasswordMatchesCurrent) {
    const error = new Error(
      'New password must be different from your current password.'
    );

    error.statusCode = 400;

    throw error;
  }

  const hashedNewPassword =
    await bcrypt.hash(
      newPassword,
      12
    );

  await updateUserPassword(
    userId,
    hashedNewPassword
  );

  return true;
}