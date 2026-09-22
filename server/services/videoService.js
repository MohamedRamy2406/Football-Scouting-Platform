import fs from 'fs/promises';
import path from 'path';
import { execFile } from 'child_process';
import { promisify } from 'util';

import ffprobeStatic from 'ffprobe-static';

import {
  validateVideoData
} from '../validation/videoValidation.js';

import {
  createVideo,
  findVideosByPlayerId,
  findVideoByIdAndPlayerId,
  deleteVideoByIdAndPlayerId
} from '../repository/videoRepository.js';


const execFileAsync =
  promisify(execFile);


// ============================================
// CONSTANTS
// ============================================

const MAX_VIDEO_DURATION_SECONDS = 300;


// ============================================
// GET VIDEO DURATION
// ============================================

async function getVideoDuration(filePath) {

  try {

    const {
      stdout
    } = await execFileAsync(
      ffprobeStatic.path,
      [
        '-v',
        'error',

        '-show_entries',
        'format=duration',

        '-of',
        'default=noprint_wrappers=1:nokey=1',

        filePath
      ]
    );


    const duration =
      Number(
        stdout.trim()
      );


    if (
      !Number.isFinite(duration) ||
      duration < 0
    ) {

      throw new Error(
        'Unable to determine video duration.'
      );

    }


    return duration;

  } catch (error) {

    console.error(
      'FFprobe error:',
      error
    );

    throw new Error(
      'Unable to read the uploaded video.'
    );

  }

}


// ============================================
// DELETE PHYSICAL VIDEO FILE
// ============================================

async function deleteVideoFile(
  filePath
) {

  if (!filePath) {
    return;
  }


  try {

    await fs.unlink(
      filePath
    );

  } catch (error) {

    // File may already have been removed.
    if (error.code !== 'ENOENT') {

      console.error(
        'Unable to delete video file:',
        error
      );

    }

  }

}


// ============================================
// UPLOAD VIDEO
// ============================================

export async function uploadPlayerVideo(
  playerId,
  file,
  videoData
) {

  // ------------------------------------------
  // Make sure a file was uploaded
  // ------------------------------------------

  if (!file) {

    throw new Error(
      'Video file is required.'
    );

  }


  // ------------------------------------------
  // Validate title / description / category
  // ------------------------------------------

  const validation =
    validateVideoData(
      videoData
    );


  if (!validation.valid) {

    const error =
      new Error(
        'Video information is invalid.'
      );

    error.statusCode = 400;

    error.validationErrors =
      validation.errors;

    // Delete uploaded file because the
    // metadata is invalid.

    await deleteVideoFile(
      file.path
    );

    throw error;

  }


  // ------------------------------------------
  // Determine actual video duration
  // ------------------------------------------

  let durationInSeconds;

  try {

    durationInSeconds =
      await getVideoDuration(
        file.path
      );

  } catch (error) {

    await deleteVideoFile(
      file.path
    );

    throw error;

  }


  // ------------------------------------------
  // 5-MINUTE LIMIT
  // ------------------------------------------

  if (
    durationInSeconds >
    MAX_VIDEO_DURATION_SECONDS
  ) {

    await deleteVideoFile(
      file.path
    );


    const error =
      new Error(
        'Video duration cannot exceed 5 minutes.'
      );

    error.statusCode = 400;

    error.code =
      'VIDEO_TOO_LONG';

    throw error;

  }


  // ------------------------------------------
  // Store whole seconds in database
  // ------------------------------------------

  const duration =
    Math.round(
      durationInSeconds
    );


  // ------------------------------------------
  // Build public video URL
  // ------------------------------------------

  const videoUrl =
    `/uploads/videos/${file.filename}`;


  // ------------------------------------------
  // Save database record
  // ------------------------------------------

  try {

    const video =
      await createVideo(
        playerId,
        {
          ...validation.data,
          videoUrl,
          duration
        }
      );


    return video;

  } catch (error) {

    // Database insertion failed.
    // Do not leave an orphan video file.

    await deleteVideoFile(
      file.path
    );

    throw error;

  }

}


// ============================================
// GET PLAYER VIDEOS
// ============================================

export async function getPlayerVideos(
  playerId
) {

  return await findVideosByPlayerId(
    playerId
  );

}


// ============================================
// DELETE PLAYER VIDEO
// ============================================

export async function deletePlayerVideo(
  playerId,
  videoId
) {

  const video =
    await findVideoByIdAndPlayerId(
      videoId,
      playerId
    );


  if (!video) {

    const error =
      new Error(
        'Video not found.'
      );

    error.statusCode = 404;

    throw error;

  }


  const deletedVideo =
    await deleteVideoByIdAndPlayerId(
      videoId,
      playerId
    );


  if (!deletedVideo) {

    const error =
      new Error(
        'Video could not be deleted.'
      );

    error.statusCode = 404;

    throw error;

  }


  // ------------------------------------------
  // Convert public URL back to physical path
  // ------------------------------------------

  const relativeVideoPath =
    deletedVideo.video_url
      .replace(/^\/+/, '');


  const physicalVideoPath =
    path.join(
      process.cwd(),
      'public',
      relativeVideoPath
    );


  await deleteVideoFile(
    physicalVideoPath
  );


  return deletedVideo;

}