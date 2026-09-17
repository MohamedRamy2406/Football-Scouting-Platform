// ============================================
// PLAYER PROFILE VALIDATION
// ============================================

const ALLOWED_PREFERRED_FEET = [
  'Left',
  'Right',
  'Both'
];

const ALLOWED_POSITIONS = [
  'GK',
  'LB',
  'LWB',
  'RB',
  'RWB',
  'CB',
  'CDM',
  'CM',
  'CAM',
  'LM',
  'RM',
  'RW',
  'LW',
  'ST'
];

export function validatePlayerProfile(data) {

  const errors = {};

  // FIRST NAME
  if (data.firstName !== undefined) {
    const value = String(data.firstName).trim();

    if (!value || value.length < 2 || value.length > 50) {
      errors.firstName =
        'First name must be between 2 and 50 characters.';
    }
  }

  // LAST NAME
  if (data.lastName !== undefined) {
    const value = String(data.lastName).trim();

    if (!value || value.length < 2 || value.length > 50) {
      errors.lastName =
        'Last name must be between 2 and 50 characters.';
    }
  }

  // PROFILE PHOTO
  if (
    data.profilePhoto !== undefined &&
    data.profilePhoto !== null
  ) {
    const value = String(data.profilePhoto).trim();

    if (value.length > 500) {
      errors.profilePhoto =
        'Profile photo path is too long.';
    }
  }

  // DATE OF BIRTH
  if (
    data.dateOfBirth !== undefined &&
    data.dateOfBirth !== null &&
    data.dateOfBirth !== ''
  ) {
    const date = new Date(data.dateOfBirth);

    if (Number.isNaN(date.getTime())) {
      errors.dateOfBirth =
        'Date of birth must be a valid date.';
    }
  }

  // POSITIONS
  if (
    data.positions !== undefined &&
    data.positions !== null
  ) {
    const value = String(data.positions).trim();

    if (!value) {
      errors.positions =
        'At least one position is required.';
    } else {
      const positions = value
        .split(',')
        .map((position) => position.trim())
        .filter(Boolean);

      const invalidPositions = positions.filter(
        (position) => !ALLOWED_POSITIONS.includes(position)
      );

      if (invalidPositions.length > 0) {
        errors.positions =
          'One or more selected positions are invalid.';
      }

      const uniquePositions = [...new Set(positions)];

      if (uniquePositions.length !== positions.length) {
        errors.positions =
          'A position cannot be selected more than once.';
      }

      if (
        positions.includes('GK') &&
        positions.length > 1
      ) {
        errors.positions =
          'Goalkeeper (GK) cannot be combined with other positions.';
      }

      if (positions.length > ALLOWED_POSITIONS.length) {
        errors.positions =
          'Too many positions were selected.';
      }
    }
  }

  // PREFERRED FOOT
  if (
    data.preferredFoot !== undefined &&
    data.preferredFoot !== null &&
    data.preferredFoot !== ''
  ) {
    if (!ALLOWED_PREFERRED_FEET.includes(data.preferredFoot)) {
      errors.preferredFoot =
        'Preferred foot must be Left, Right, or Both.';
    }
  }

  // HEIGHT
  if (
    data.height !== undefined &&
    data.height !== null &&
    data.height !== ''
  ) {
    const height = Number(data.height);

    if (
      !Number.isInteger(height) ||
      height < 145 ||
      height > 210
    ) {
      errors.height =
        'Height must be an integer between 145 and 210 cm.';
    }
  }

  // WEIGHT
  if (
    data.weight !== undefined &&
    data.weight !== null &&
    data.weight !== ''
  ) {
    const weight = Number(data.weight);

    if (
      !Number.isInteger(weight) ||
      weight < 59 ||
      weight > 120
    ) {
      errors.weight =
        'Weight must be an integer between 59 and 120 kg.';
    }
  }

  // NATIONALITY
  if (
    data.nationality !== undefined &&
    data.nationality !== null
  ) {
    const value = String(data.nationality).trim();

    if (value.length > 100) {
      errors.nationality =
        'Nationality must be 100 characters or fewer.';
    }
  }

  // ============================================
  // CURRENT CLUB / ACADEMY
  // ============================================

  /*
   * hasCurrentClub must be a real boolean.
   *
   * true  = player currently belongs to a club/academy
   * false = player does not currently belong to one
   */
  if (data.hasCurrentClub !== undefined) {

    if (typeof data.hasCurrentClub !== 'boolean') {
      errors.hasCurrentClub =
        'Current club selection must be Yes or No.';
    }
  }

  /*
   * Validate the club name itself.
   *
   * The database column is VARCHAR(200),
   * so the backend allows up to 200 characters.
   */
  if (
    data.currentClub !== undefined &&
    data.currentClub !== null
  ) {
    const value = String(data.currentClub).trim();

    if (value.length > 200) {
      errors.currentClub =
        'Current club or academy must be 200 characters or fewer.';
    }
  }

  /*
   * If the player selected YES,
   * a club/academy name is required.
   */
  if (data.hasCurrentClub === true) {

    const value =
      data.currentClub === undefined ||
      data.currentClub === null
        ? ''
        : String(data.currentClub).trim();

    if (!value) {
      errors.currentClub =
        'Current club or academy is required when Yes is selected.';
    }
  }

  /*
   * If the player selected NO,
   * there must not be a club name saved.
   */
  if (data.hasCurrentClub === false) {

    const value =
      data.currentClub === undefined ||
      data.currentClub === null
        ? ''
        : String(data.currentClub).trim();

    if (value) {
      errors.currentClub =
        'Current club or academy must be empty when No is selected.';
    }
  }

  // CITY
  if (
    data.city !== undefined &&
    data.city !== null
  ) {
    const value = String(data.city).trim();

    if (value.length > 100) {
      errors.city =
        'City must be 100 characters or fewer.';
    }
  }

  // BIO
  if (
    data.bio !== undefined &&
    data.bio !== null
  ) {
    const value = String(data.bio).trim();

    if (value.length > 2000) {
      errors.bio =
        'Biography must be 2000 characters or fewer.';
    }
  }

  return errors;
}