// ============================================
// GLOBAL ERROR HANDLER
// ============================================

export function errorHandler(error, req, res, next) {

  console.error('Server Error:', error);

  // ------------------------------------------
  // PostgreSQL UNIQUE constraint violation
  // ------------------------------------------

  if (error.code === '23505') {

    return res.status(400).json({
      message: 'Email already registered.'
    });

  }


  // ------------------------------------------
  // Known application error
  // ------------------------------------------

  if (error.statusCode) {

    return res.status(error.statusCode).json({
      message: error.message
    });

  }


  // ------------------------------------------
  // Unknown error
  // ------------------------------------------

  return res.status(500).json({
    message: 'Internal server error.'
  });

}