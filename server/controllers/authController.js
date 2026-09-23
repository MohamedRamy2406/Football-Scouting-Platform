import {
  registerUser,
  loginUser,
  changeUserPassword
} from '../services/authService.js';


// ==============================
// Register
// ==============================

export async function register(req, res, next) {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      role
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !role
    ) {
      return res.status(400).json({
        message: 'All required fields must be provided.'
      });
    }

    if (!['PLAYER', 'SCOUT'].includes(role)) {
      return res.status(400).json({
        message: 'Invalid role.'
      });
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{9,}$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          'Password must be at least 9 characters long and contain at least one uppercase letter, one lowercase letter, and one number.'
      });
    }

    const user = await registerUser({
      firstName,
      lastName,
      email,
      password,
      phone,
      role
    });

    req.session.user = {
      id: user.id,
      role: user.role
    };

    return req.session.save((sessionError) => {
      if (sessionError) {
        return next(sessionError);
      }

      return res.status(201).json({
        message: 'Registration successful.',
        user
      });
    });

  } catch (error) {
    next(error);
  }
}


// ==============================
// Login
// ==============================

export async function login(req, res, next) {
  try {
    const {
      email,
      password
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required.'
      });
    }

    const user = await loginUser(
      email,
      password
    );

    req.session.user = {
      id: user.id,
      role: user.role
    };

    return req.session.save((sessionError) => {
      if (sessionError) {
        return next(sessionError);
      }

      return res.status(200).json({
        message: 'Login successful.',
        user
      });
    });

  } catch (error) {
    next(error);
  }
}


// ==============================
// Get Current User
// ==============================

export async function getCurrentUser(req, res) {
  if (!req.session || !req.session.user) {
    return res.status(200).json({
      authenticated: false,
      user: null
    });
  }

  return res.status(200).json({
    authenticated: true,
    user: req.session.user
  });
}


// ==============================
// Logout
// ==============================

export async function logout(req, res, next) {
  try {
    req.session.destroy((error) => {
      if (error) {
        return next(error);
      }

      res.clearCookie('connect.sid');

      return res.status(200).json({
        message: 'Logout successful.'
      });
    });

  } catch (error) {
    next(error);
  }
}


// ==============================
// Change Password
// ==============================

export async function changePassword(req, res, next) {
  try {
    const userId = req.session.user.id;

    const {
      currentPassword,
      newPassword
    } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message:
          'Current password and new password are required.'
      });
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{9,}$/;

    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        message:
          'New password must be at least 9 characters long and contain at least one uppercase letter, one lowercase letter, and one number.'
      });
    }

    await changeUserPassword(
      userId,
      currentPassword,
      newPassword
    );

    return res.status(200).json({
      message: 'Password changed successfully.'
    });

  } catch (error) {
    next(error);
  }
}