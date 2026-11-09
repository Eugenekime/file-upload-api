import type { Request, Response, NextFunction } from 'express';
import type { RequestHandler } from 'express';
import { fileTypeFromFile } from 'file-type';
import { HttpError } from '../utils/HttpError.js';
import { randomUUID } from 'node:crypto';
import { rename, unlink } from 'node:fs/promises';
import path from 'node:path';

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
const mimeExtensions: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
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
      if (file.mimetype !== detectedType.mime) {
        throw new HttpError(
          `MIME type does not match file content: ${file.originalname}`,
          415
        );
      }
      const extension = mimeExtensions[detectedType.mime];

      if (!extension) {
        throw new HttpError('Unsupported file extension', 415);
      }

      const filename = `${randomUUID()}.${extension}`;
      const newPath = path.join(file.destination, filename);

      await rename(file.path, newPath);

      file.filename = filename;
      file.path = newPath;
    }

    next();
  } catch (error) {
    await Promise.all(
      files.map((file) => unlink(file.path).catch(() => undefined))
    );

    next(error);
  }
};
