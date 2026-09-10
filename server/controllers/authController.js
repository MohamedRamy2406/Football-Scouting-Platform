import {
  registerUser,
  loginUser
} from '../services/authService.js';


// ============================================
// REGISTER
// ============================================

export async function register(req, res) {

  const {
    firstName,
    lastName,
    email,
    password,
    role
  } = req.body;


  // Required fields

  if (
    !firstName ||
    !lastName ||
    !email ||
    !password ||
    !role
  ) {

    return res.status(400).json({
      message: 'All fields are required.'
    });

  }


  // Allowed roles

  if (!['PLAYER', 'SCOUT'].includes(role)) {

    return res.status(400).json({
      message: 'Invalid account type.'
    });

  }


  // Password strength

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{9,}$/;


  if (!passwordRegex.test(password)) {

    return res.status(400).json({
      message:
        'Password must be at least 9 characters long and contain at least one uppercase letter, one lowercase letter, and one number.'
    });

  }


  try {

    const result = await registerUser({
      firstName,
      lastName,
      email,
      password,
      role
    });


    if (!result.success) {

      return res.status(result.status).json({
        message: result.message
      });

    }


    const newUser = result.user;


    // Create session

    req.session.user = {
      id: newUser.id,
      role: newUser.role
    };


    // Explicitly save session

    req.session.save((sessionError) => {

      if (sessionError) {

        console.error(
          'Session save error:',
          sessionError
        );

        return res.status(500).json({
          message: 'Could not create session.'
        });

      }


      return res.status(201).json({

        message:
          'User registered successfully.',

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

    console.error(
      'Registration error:',
      error
    );

    return res.status(500).json({
      message: 'Internal server error.'
    });

  }

}


// ============================================
// LOGIN
// ============================================

export async function login(req, res) {

  const {
    email,
    password
  } = req.body;


  if (!email || !password) {

    return res.status(400).json({
      message:
        'Email and password are required.'
    });

  }


  try {

    const result = await loginUser({
      email,
      password
    });


    if (!result.success) {

      return res.status(result.status).json({
        message: result.message
      });

    }


    const user = result.user;


    // Create session

    req.session.user = {
      id: user.id,
      role: user.role
    };


    // Explicitly save session

    req.session.save((sessionError) => {

      if (sessionError) {

        console.error(
          'Session save error:',
          sessionError
        );

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

    console.error(
      'Login error:',
      error
    );

    return res.status(500).json({
      message: 'Internal server error.'
    });

  }

}