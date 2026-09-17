import {
  getPlayerAchievements,
  addAchievement,
  editAchievement,
  removeAchievement
} from '../services/achievementService.js';


export async function getAchievements(
  req,
  res
) {
  try {
    const achievements =
      await getPlayerAchievements(
        req.session.user.id
      );

    return res.json({
      achievements
    });

  } catch (error) {
    console.error(
      'Get achievements error:',
      error
    );

    return res.status(
      error.status || 500
    ).json({
      message:
        error.message ||
        'Could not load achievements.'
    });
  }
}


export async function createAchievementController(
  req,
  res
) {
  try {
    const achievement =
      await addAchievement(
        req.session.user.id,
        req.body
      );

    return res.status(201).json({
      message: 'Achievement added successfully.',
      achievement
    });

  } catch (error) {
    console.error(
      'Create achievement error:',
      error
    );

    return res.status(
      error.status || 500
    ).json({
      message:
        error.message ||
        'Could not add achievement.',
      errors: error.errors
    });
  }
}


export async function updateAchievementController(
  req,
  res
) {
  try {
    const achievement =
      await editAchievement(
        req.session.user.id,
        req.params.id,
        req.body
      );

    return res.json({
      message:
        'Achievement updated successfully.',
      achievement
    });

  } catch (error) {
    console.error(
      'Update achievement error:',
      error
    );

    return res.status(
      error.status || 500
    ).json({
      message:
        error.message ||
        'Could not update achievement.',
      errors: error.errors
    });
  }
}


export async function deleteAchievementController(
  req,
  res
) {
  try {
    await removeAchievement(
      req.session.user.id,
      req.params.id
    );

    return res.json({
      message:
        'Achievement deleted successfully.'
    });

  } catch (error) {
    console.error(
      'Delete achievement error:',
      error
    );

    return res.status(
      error.status || 500
    ).json({
      message:
        error.message ||
        'Could not delete achievement.'
    });
  }
}