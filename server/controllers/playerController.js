import {
  getPlayerProfile,
  editPlayerProfile,
  removePlayerAccount,
  updatePlayerPhoto
} from '../services/playerService.js';

// ============================================
// GET CURRENT PLAYER PROFILE
// GET /api/player/profile
// ============================================

export async function getProfile(
  req,
  res,
  next
) {

  try {

    const userId =
      req.session.user.id;

    const profile =
      await getPlayerProfile(userId);

    return res.status(200).json({
      profile
    });

  } catch (error) {

    return next(error);

  }
}

// ============================================
// UPDATE CURRENT PLAYER PROFILE
// PUT /api/player/profile
// ============================================

export async function updateProfile(
  req,
  res,
  next
) {

  try {

    const userId =
      req.session.user.id;

    const profile =
      await editPlayerProfile(
        userId,
        req.body
      );

    return res.status(200).json({

      message:
        'Player profile updated successfully.',

      profile

    });

  } catch (error) {

    if (error.details) {

      return res.status(
        error.statusCode || 400
      ).json({

        message:
          error.message,

        errors:
          error.details

      });
    }

    return next(error);
  }
}

// ============================================
// DELETE CURRENT PLAYER ACCOUNT
// DELETE /api/player/account
// ============================================

export async function deleteAccount(
  req,
  res,
  next
) {

  try {

    const userId =
      req.session.user.id;

    await removePlayerAccount(userId);

    req.session.destroy(
      (sessionError) => {

        if (sessionError) {

          console.error(
            'Account deletion session error:',
            sessionError
          );

          return res.status(500).json({

            message:
              'Account was deleted, but the session could not be cleared.'

          });
        }

        res.clearCookie(
          'connect.sid'
        );

        return res.status(200).json({

          message:
            'Player account deleted successfully.'

        });

      }
    );

  } catch (error) {

    return next(error);

  }
}
export async function uploadProfilePhotoController(
  req,
  res,
  next
) {

  try {

    if (!req.file) {

      return res.status(400).json({
        message: 'Please select a profile photo.'
      });

    }

    const userId =
      req.session.user.id;

    const photoUrl =
      `/uploads/profile/${req.file.filename}`;

    const profile =
      await updatePlayerPhoto(
        userId,
        photoUrl
      );

    return res.status(200).json({
      message: 'Profile photo updated successfully.',
      profile
    });

  } catch (error) {

    return next(error);

  }
}