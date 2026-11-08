import type { Request, Response, NextFunction } from 'express';
import type { RequestHandler } from 'express';
import { fileTypeFromFile } from 'file-type';
import { unlink } from 'node:fs/promises';
import { HttpError } from '../utils/HttpError.js';
import { imageConfig } from '../config/sharp.js';

const maxFileSize = Number(process.env.MAX_FILE_SIZE_BYTES ?? 5242880);

const allowedTypes = (
  process.env.ALLOWED_FILE_TYPES ?? 'image/jpeg,image/png,image/webp'
)
  .split(',')
  .map((type) => type.trim());

const allowedFits = ['cover', 'contain', 'fill', 'inside', 'outside'];

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

export const validateResize = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { width, height } = req.body;

  if (
    !Number.isInteger(width) ||
    !Number.isInteger(height) ||
    width <= 0 ||
    height <= 0
  ) {
    return res.status(400).json({
      message: 'Width and height must be positive integers',
    });
  }

  if (width > imageConfig.maxWidth || height > imageConfig.maxHeight) {
    return res.status(400).json({
      message: 'Maximum width and height are 4000',
    });
  }

  next();
};

export const validateFormat = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { format } = req.body;

  if (!imageConfig.formats.includes(format)) {
    return res.status(400).json({
      message: 'Unsupported image format',
    });
  }

  next();
};

export const validateQuality = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { quality } = req.body;

  if (!Number.isInteger(quality) || quality < 1 || quality > 100) {
    return res.status(400).json({
      message: 'Quality must be an integer between 1 and 100',
    });
  }

  next();
};

export const validateFit = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { fit } = req.body;

  if (fit !== undefined && !allowedFits.includes(fit)) {
    return res.status(400).json({
      message: 'Unsupported resize fit option',
    });
  }

  next();
};
