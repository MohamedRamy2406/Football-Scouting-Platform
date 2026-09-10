// ============================================
// AUTHENTICATION VALIDATION
// ============================================

// --------------------------------------------
// Normalize email
// --------------------------------------------

export function normalizeEmail(email) {
  return email.trim().toLowerCase();
}


// --------------------------------------------
// Validate email
// --------------------------------------------

export function isValidEmail(email) {
  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailRegex.test(email);
}


// --------------------------------------------
// Validate password
// --------------------------------------------

export function isValidPassword(password) {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{9,}$/;

  return passwordRegex.test(password);
}


// --------------------------------------------
// Validate name
// --------------------------------------------

export function isValidName(name) {

  const trimmedName = name.trim();

  if (!trimmedName) {
    return false;
  }

  if (trimmedName.length < 2) {
    return false;
  }

  if (trimmedName.length > 50) {
    return false;
  }

  return true;
}