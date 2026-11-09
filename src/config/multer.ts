import multer from 'multer';
import path from 'path';
import type { Request } from 'express';
import { randomUUID } from 'node:crypto';
import { HttpError } from '../utils/HttpError.js';
import { uploadDirPath } from './upload.js';

const maxFileSize = Number(process.env.MAX_FILE_SIZE_BYTES ?? 5242880);

const allowedTypes = (
  process.env.ALLOWED_FILE_TYPES ?? 'image/jpeg,image/png,image/webp'
).split(',');

const storage = multer.diskStorage({
  destination: (req: Request, file, cb) => {
    cb(null, uploadDirPath);
  },
  filename: (req: Request, file, cb) => {
    const uniqueSuffix = randomUUID();
    const extension = path.extname(file.originalname);

    cb(null, `${file.fieldname}-${uniqueSuffix}${extension}`);
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new HttpError('Unsupported file type', 415));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: maxFileSize,
    files: 5,
  },
});

export default upload;
