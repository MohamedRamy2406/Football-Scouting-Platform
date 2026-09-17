export function validateClubHistory(data) {
  const errors = {};

  // ============================================
  // CLUB / ACADEMY
  // ============================================

  if (
    !data.club_or_academy ||
    typeof data.club_or_academy !== 'string' ||
    data.club_or_academy.trim().length === 0
  ) {
    errors.club_or_academy =
      'Club or academy is required.';
  } else if (
    data.club_or_academy.trim().length > 200
  ) {
    errors.club_or_academy =
      'Club or academy must be 200 characters or less.';
  }


  // ============================================
  // POSITION
  // ============================================

  if (
    !data.position ||
    typeof data.position !== 'string' ||
    data.position.trim().length === 0
  ) {
    errors.position =
      'Position is required.';
  } else if (
    data.position.trim().length > 100
  ) {
    errors.position =
      'Position must be 100 characters or less.';
  }


  // ============================================
  // START DATE
  // ============================================

  if (!data.start_date) {
    errors.start_date =
      'Start date is required.';
  } else if (!isValidDate(data.start_date)) {
    errors.start_date =
      'Invalid start date.';
  }


  // ============================================
  // END DATE
  // ============================================

  if (
    data.end_date &&
    !isValidDate(data.end_date)
  ) {
    errors.end_date =
      'Invalid end date.';
  }


  // ============================================
  // DATE ORDER
  // ============================================

  if (
    data.start_date &&
    data.end_date &&
    isValidDate(data.start_date) &&
    isValidDate(data.end_date) &&
    new Date(data.end_date) <
      new Date(data.start_date)
  ) {
    errors.end_date =
      'End date cannot be before start date.';
  }


  // ============================================
  // STATISTICS
  // ============================================

  validateNumber(
    data.matches,
    'matches',
    errors
  );

  validateNumber(
    data.starts,
    'starts',
    errors
  );

  validateNumber(
    data.goals,
    'goals',
    errors
  );

  validateNumber(
    data.assists,
    'assists',
    errors
  );

  validateNumber(
    data.minutes,
    'minutes',
    errors
  );


  // ============================================
  // STARTS CANNOT EXCEED MATCHES
  // ============================================

  if (
    data.matches !== undefined &&
    data.matches !== null &&
    data.starts !== undefined &&
    data.starts !== null &&
    data.matches !== '' &&
    data.starts !== '' &&
    Number(data.starts) >
      Number(data.matches)
  ) {
    errors.starts =
      'Starts cannot be greater than matches.';
  }


  // ============================================
  // RESULT
  // ============================================

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
}


// ============================================
// NUMBER VALIDATION
// ============================================

function validateNumber(
  value,
  field,
  errors
) {
  if (
    value === undefined ||
    value === null ||
    value === ''
  ) {
    return;
  }

  const number = Number(value);

  if (
    !Number.isInteger(number) ||
    number < 0
  ) {
    errors[field] =
      `${field} must be a non-negative integer.`;
  }
}


// ============================================
// DATE VALIDATION
// ============================================

function isValidDate(value) {
  const date = new Date(value);

  return !Number.isNaN(
    date.getTime()
  );
}