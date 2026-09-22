// ============================================
// VIDEO VALIDATION
// ============================================

const ALLOWED_CATEGORIES = [
  'MATCH',
  'TRAINING',
  'SOLO_TRAINING',
  'SKILLS',
  'HIGHLIGHTS',
  'OTHER'
];


// ============================================
// VALIDATE VIDEO DATA
// ============================================

export function validateVideoData(data) {

  const errors = {};

  const title =
    typeof data.title === 'string'
      ? data.title.trim()
      : '';

  const description =
    typeof data.description === 'string'
      ? data.description.trim()
      : '';

  const category =
    typeof data.category === 'string'
      ? data.category.trim().toUpperCase()
      : '';


  // ==========================================
  // TITLE
  // ==========================================

  if (!title) {

    errors.title =
      'Video title is required.';

  } else if (title.length > 150) {

    errors.title =
      'Video title must not exceed 150 characters.';

  }


  // ==========================================
  // DESCRIPTION
  // ==========================================

  if (description.length > 2000) {

    errors.description =
      'Video description must not exceed 2000 characters.';

  }


  // ==========================================
  // CATEGORY
  // ==========================================

  if (!category) {

    errors.category =
      'Video category is required.';

  } else if (!ALLOWED_CATEGORIES.includes(category)) {

    errors.category =
      'Invalid video category.';

  }


  return {
    valid:
      Object.keys(errors).length === 0,

    errors,

    data: {
      title,
      description:
        description || null,
      category
    }
  };

}


// ============================================
// EXPORT ALLOWED CATEGORIES
// ============================================

export {
  ALLOWED_CATEGORIES
};