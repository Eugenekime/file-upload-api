import type { Request, Response, NextFunction } from 'express';
import type { RequestHandler } from 'express';
import { fileTypeFromFile } from 'file-type';
import { unlink } from 'node:fs/promises';
import { HttpError } from '../utils/HttpError.js';

const maxFileSize = Number(process.env.MAX_FILE_SIZE_BYTES ?? 5242880);

const allowedTypes = (
  process.env.ALLOWED_FILE_TYPES ?? 'image/jpeg,image/png,image/webp'
)
  .split(',')
  .map((type) => type.trim());

const getUploadedFiles = (req: Request) => {
  const files: Express.Multer.File[] = [];

  if (req.file) {
    files.push(req.file);
  }

  if (Array.isArray(req.files)) {
    files.push(...req.files);
  } else if (req.files) {
    files.push(...Object.values(req.files).flat());
  }

  return files;
};

export const validateUploadedFiles: RequestHandler = async (req, res, next) => {
  const files = getUploadedFiles(req);

  if (files.length === 0) {
    return res.status(400).json({
      message: 'No files uploaded',
    });
  }

  try {
    for (const file of files) {
      if (file.size > maxFileSize) {
        throw new HttpError(
          `File ${file.originalname} exceeds the size limit`,
          413
        );
      }

      const detectedType = await fileTypeFromFile(file.path);

      if (!detectedType || !allowedTypes.includes(detectedType.mime)) {
        throw new HttpError(`Invalid file type: ${file.originalname}`, 415);
      }
    }

    next();
  } catch (error) {
    await Promise.all(
      files.map((file) => unlink(file.path).catch(() => undefined))
    );

    next(error);
  }
};
