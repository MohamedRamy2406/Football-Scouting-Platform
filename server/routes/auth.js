import express from 'express';
import bcrypt from 'bcrypt';
import pool from '../db.js';

const router = express.Router();


// ============================================
// REGISTER
// POST /api/auth/register
// ============================================

router.post('/register', async (req, res) => {

  const {
    firstName,
    lastName,
    email,
    password,
    role
  } = req.body;


  // 1. Check required fields
  if (!firstName || !lastName || !email || !password || !role) {
    return res.status(400).json({
      message: 'All fields are required.'
    });
  }


  // 2. Only PLAYER and SCOUT can register
  if (!['PLAYER', 'SCOUT'].includes(role)) {
    return res.status(400).json({
      message: 'Invalid account type.'
    });
  }


  // 3. Password strength
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{9,}$/;

  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message:
        'Password must be at least 9 characters long and contain at least one uppercase letter, one lowercase letter, and one number.'
    });
  }


  let client;

  try {

    client = await pool.connect();

    await client.query('BEGIN');


    // Normalize email
    const normalizedEmail = email.trim().toLowerCase();


    // 4. Check if email exists
    const existingUser = await client.query(
      'SELECT id FROM users WHERE email = $1',
      [normalizedEmail]
    );

    if (existingUser.rows.length > 0) {

      await client.query('ROLLBACK');

      return res.status(400).json({
        message: 'Email already registered.'
      });

    }


    // 5. Hash password
    const hashedPassword = await bcrypt.hash(password, 12);


    // 6. Create user
    const userResult = await client.query(
      `INSERT INTO users
      (first_name, last_name, email, password, role)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, first_name, last_name, email, role`,
      [
        firstName.trim(),
        lastName.trim(),
        normalizedEmail,
        hashedPassword,
        role
      ]
    );


    const newUser = userResult.rows[0];


    // 7. Create correct profile

    if (role === 'PLAYER') {

      await client.query(
        `INSERT INTO player_profiles (user_id)
         VALUES ($1)`,
        [newUser.id]
      );

    }


    if (role === 'SCOUT') {

      await client.query(
        `INSERT INTO scout_profiles (user_id)
         VALUES ($1)`,
        [newUser.id]
      );

    }


    // 8. Commit database transaction
    await client.query('COMMIT');


    // 9. Create session
    req.session.user = {
      id: newUser.id,
      role: newUser.role
    };


    // IMPORTANT:
    // Explicitly save session before sending response
    req.session.save((sessionError) => {

      if (sessionError) {

        console.error('Session save error:', sessionError);

        return res.status(500).json({
          message: 'Could not create session.'
        });

      }


      // 10. Return user

      return res.status(201).json({

        message: 'User registered successfully.',

        user: {
          id: newUser.id,
          firstName: newUser.first_name,
          lastName: newUser.last_name,
          email: newUser.email,
          role: newUser.role
        }

      });

    });

  } catch (error) {

    if (client) {
      await client.query('ROLLBACK');
    }

    console.error('Registration Error:', error);

    res.status(500).json({
      message: 'Internal server error.'
    });

  } finally {

    if (client) {
      client.release();
    }

  }

});

// ============================================
// LOGIN
// POST /api/auth/login
// ============================================

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // 1. Check required fields
  if (!email || !password) {
    return res.status(400).json({
      message: 'Email and password are required.'
    });
  }

  try {
    // 2. Find user
    const result = await pool.query(
      `SELECT id, first_name, last_name, email, password, role
       FROM USERS
       WHERE email = $1`,
      [email]
    );

    // 3. User doesn't exist
    if (result.rows.length === 0) {
      return res.status(401).json({
        message: 'Invalid email or password.'
      });
    }

    const user = result.rows[0];

    // 4. Compare password with bcrypt hash
    const passwordMatches = await bcrypt.compare(
      password,
      user.password
    );

    // 5. Incorrect password
    if (!passwordMatches) {
      return res.status(401).json({
        message: 'Invalid email or password.'
      });
    }

    // 6. Create session
    req.session.user = {
      id: user.id,
      role: user.role
    };

    // 7. Explicitly save session
    req.session.save((sessionError) => {
      if (sessionError) {
        console.error('Session save error:', sessionError);
        return res.status(500).json({
          message: 'Could not create session.'
        });
      }

      return res.status(200).json({
        message: 'Login successful.',
        user: {
          id: user.id,
          firstName: user.first_name,
          lastName: user.last_name,
          email: user.email,
          role: user.role
        }
      });
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
});
// ============================================
// CHECK CURRENT SESSION
// GET /api/auth/me
// ============================================

router.get('/me', (req, res) => {

  // No active session
  if (!req.session || !req.session.user) {
    return res.status(401).json({
      authenticated: false,
      user: null
    });
  }

  // Active session
  return res.status(200).json({
    authenticated: true,
    user: req.session.user
  });

});

export default router;