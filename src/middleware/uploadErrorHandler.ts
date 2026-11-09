import multer from 'multer';
import type { Request, Response, NextFunction } from 'express';
import { HttpError } from '../utils/HttpError.js';

export const uploadErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({
        message: 'File is too large. Maximum size is 5 MB.',
      });
    }

    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        message: 'Too many files.',
      });
    }

    return res.status(400).json({
      message: err.message,
    });
  }

  if (err instanceof HttpError) {
    return res.status(err.statusCode).json({
      message: err.message,
    });
  }

  if (
    err instanceof SyntaxError &&
    'type' in err &&
    err.type === 'entity.parse.failed'
  ) {
    return res.status(400).json({
      message: 'Invalid JSON format',
    });
  }

  console.error(err);

  return res.status(500).json({
    message: 'Internal server error',
  });
};
