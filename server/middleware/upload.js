
import multer from 'multer';
import fs from 'fs';
import path from 'path';


// ============================================================
// PROFILE PHOTO UPLOAD
// ============================================================

const profileUploadDirectory =
  path.join(
    process.cwd(),
    'public',
    'uploads',
    'profile'
  );


// Make sure profile upload directory exists

fs.mkdirSync(
  profileUploadDirectory,
  {
    recursive: true
  }
);


// Profile photo storage

const profileStorage =
  multer.diskStorage({

    destination: (
      req,
      file,
      cb
    ) => {

      cb(
        null,
        profileUploadDirectory
      );

    },

    filename: (
      req,
      file,
      cb
    ) => {

      const extension =
        file.originalname
          .split('.')
          .pop()
          .toLowerCase();

      cb(
        null,
        `player-${req.session.user.id}-${Date.now()}.${extension}`
      );

    }

  });


// Profile photo filter

const profileFileFilter = (
  req,
  file,
  cb
) => {

  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/webp'
  ];

  if (
    allowedTypes.includes(
      file.mimetype
    )
  ) {

    cb(
      null,
      true
    );

  } else {

    cb(
      new Error(
        'Only JPG, PNG, and WEBP images are allowed.'
      )
    );

  }

};


// Profile photo uploader

export const uploadProfilePhoto =
  multer({

    storage:
      profileStorage,

    fileFilter:
      profileFileFilter,

    limits: {

      fileSize:
        5 * 1024 * 1024

    }

  });


// ============================================================
// PLAYER VIDEO UPLOAD
// ============================================================

const videoUploadDirectory =
  path.join(
    process.cwd(),
    'public',
    'uploads',
    'videos'
  );


// Make sure video upload directory exists

fs.mkdirSync(
  videoUploadDirectory,
  {
    recursive: true
  }
);


// Video storage

const videoStorage =
  multer.diskStorage({

    destination: (
      req,
      file,
      cb
    ) => {

      cb(
        null,
        videoUploadDirectory
      );

    },

    filename: (
      req,
      file,
      cb
    ) => {

      const extension =
        file.originalname
          .split('.')
          .pop()
          .toLowerCase();

      cb(
        null,
        `player-${req.session.user.id}-${Date.now()}.${extension}`
      );

    }

  });


// Video file filter

const videoFileFilter = (
  req,
  file,
  cb
) => {

  const allowedTypes = [
    'video/mp4',
    'video/quicktime',
    'video/webm'
  ];

  if (
    allowedTypes.includes(
      file.mimetype
    )
  ) {

    cb(
      null,
      true
    );

  } else {

    cb(
      new Error(
        'Only MP4, MOV, and WebM videos are allowed.'
      )
    );

  }

};


// Player video uploader

export const uploadPlayerVideo =
  multer({

    storage:
      videoStorage,

    fileFilter:
      videoFileFilter,

    limits: {

      fileSize:
        500 * 1024 * 1024

    }

  });

