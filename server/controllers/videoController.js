import {
  uploadPlayerVideo,
  getPlayerVideos,
  deletePlayerVideo
} from '../services/videoService.js';


// ============================================
// UPLOAD PLAYER VIDEO
// ============================================

export async function createVideoController(
  req,
  res,
  next
) {

  try {

    const playerId =
      req.session.user.id;


    const video =
      await uploadPlayerVideo(
        playerId,
        req.file,
        {
          title:
            req.body.title,

          description:
            req.body.description,

          category:
            req.body.category
        }
      );


    return res.status(201).json({

      message:
        'Video uploaded successfully.',

      video

    });

  } catch (error) {

    next(error);

  }

}


// ============================================
// GET PLAYER VIDEOS
// ============================================

export async function getPlayerVideosController(
  req,
  res,
  next
) {

  try {

    const playerId =
      req.session.user.id;


    const videos =
      await getPlayerVideos(
        playerId
      );


    return res.status(200).json({

      videos

    });

  } catch (error) {

    next(error);

  }

}


// ============================================
// DELETE PLAYER VIDEO
// ============================================

export async function deletePlayerVideoController(
  req,
  res,
  next
) {

  try {

    const playerId =
      req.session.user.id;


    const videoId =
      Number(
        req.params.id
      );


    if (
      !Number.isInteger(videoId) ||
      videoId <= 0
    ) {

      return res.status(400).json({

        message:
          'Invalid video ID.'

      });

    }


    await deletePlayerVideo(
      playerId,
      videoId
    );


    return res.status(200).json({

      message:
        'Video deleted successfully.'

    });

  } catch (error) {

    next(error);

  }

}