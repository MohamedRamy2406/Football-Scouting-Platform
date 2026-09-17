export function validateAchievement(data) {
  const errors = {};

  if (!data.title || !String(data.title).trim()) {
    errors.title = 'Achievement title is required.';
  } else if (String(data.title).trim().length > 50) {
    errors.title =
      'Achievement title must be 50 characters or less.';
  }

  if (
    data.description !== undefined &&
    data.description !== null &&
    String(data.description).length > 200
  ) {
    errors.description =
      'Achievement description must be 200 characters or less.';
  }

  if (data.achievementDate) {
    const date = new Date(data.achievementDate);

    if (Number.isNaN(date.getTime())) {
      errors.achievementDate =
        'Achievement date must be a valid date.';
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
}