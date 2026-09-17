import multer from 'multer';
import fs from 'fs';
import path from 'path';

const uploadDirectory =
  path.join(
    process.cwd(),
    'public',
    'uploads',
    'profile'
  );


// ============================================
// MAKE SURE UPLOAD DIRECTORY EXISTS
// ============================================

fs.mkdirSync(
  uploadDirectory,
  {
    recursive: true
  }
);


// ============================================
// STORAGE
// ============================================

const storage =
  multer.diskStorage({

    destination: (
      req,
      file,
      cb
    ) => {

      cb(
        null,
        uploadDirectory
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


// ============================================
// FILE FILTER
// ============================================

const fileFilter = (
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


// ============================================
// MULTER
// ============================================

export const uploadProfilePhoto =
  multer({

    storage,

    fileFilter,

    limits: {
      fileSize:
        5 * 1024 * 1024
    }

  });