
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
  // Multer file size error
  // ------------------------------------------

  if (error.code === 'LIMIT_FILE_SIZE') {

    return res.status(413).json({
      message:
        'Video file is too large. Maximum allowed size is 500 MB.'
    });

  }

  // ------------------------------------------
// Multer invalid file type error
// ------------------------------------------

if (
  error.message ===
  'Only MP4, MOV, and WebM videos are allowed.'
) {

  return res.status(400).json({
    message:
      'Only MP4, MOV, and WebM videos are allowed.'
  });

}

  // ------------------------------------------
  // Known application validation error
  // ------------------------------------------

  if (error.validationErrors) {

    return res.status(
      error.statusCode || 400
    ).json({
      message: error.message,
      errors: error.validationErrors
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

