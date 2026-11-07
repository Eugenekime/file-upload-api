import type { Request, Response, NextFunction } from 'express';
import { readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { HttpError } from '../utils/HttpError.js';
import { unlink } from 'node:fs/promises';

const uploadDirPath = path.resolve(process.cwd(), 'uploads');

export const uploadFilesController = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const files = req.files as Express.Multer.File[];

    const uploadedFiles = files.map((file) => ({
      originalName: file.originalname,
      filename: file.filename,
      mimeType: file.mimetype,
      size: file.size,
      path: file.path,
    }));

    res.status(201).json({
      message: 'Files uploaded successfully',
      files: uploadedFiles,
    });
  } catch (error) {
    next(error);
  }
};

export const uploadSingleFileController = (req: Request, res: Response) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({
      message: 'No file uploaded',
    });
  }

  res.status(201).json({
    message: 'File uploaded successfully',
    file: {
      originalName: file.originalname,
      filename: file.filename,
      mimeType: file.mimetype,
      size: file.size,
      path: file.path,
    },
  });
};

export const getUploadedFilesController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const filenames = await readdir(uploadDirPath);

    const files = await Promise.all(
      filenames.map(async (filename) => {
        const filePath = path.join(uploadDirPath, filename);
        const fileStats = await stat(filePath);

        return {
          filename,
          size: fileStats.size,
          uploadedAt: fileStats.birthtime,
        };
      })
    );

    res.status(200).json({
      count: files.length,
      files,
    });
  } catch (error) {
    next(error);
  }
};

export const getUploadedFileController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { filename } = req.params;
    if (!filename || typeof filename !== 'string') {
      throw new HttpError(`File name must be string and not be empty`, 400);
    }

    const filePath = path.resolve(uploadDirPath, filename);

    if (path.dirname(filePath) !== uploadDirPath) {
      return res.status(400).json({
        message: 'Invalid filename',
      });
    }

    const fileStats = await stat(filePath);

    if (!fileStats.isFile()) {
      return res.status(404).json({
        message: 'File not found',
      });
    }

    res.sendFile(filePath);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return res.status(404).json({
        message: 'File not found',
      });
    }

    next(error);
  }
};

export const deleteUploadedFileController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { filename } = req.params;

    if (!filename || typeof filename !== 'string') {
      throw new HttpError('Invalid filename', 400);
    }

    if (
      filename !== path.basename(filename) ||
      filename.includes('/') ||
      filename.includes('\\')
    ) {
      throw new HttpError('Invalid filename', 400);
    }

    const filePath = path.resolve(uploadDirPath, filename);
    const fileStats = await stat(filePath);
    if (!fileStats.isFile()) {
      throw new HttpError('File not found', 404);
    }

    await unlink(filePath);

    res.status(200).json({
      message: 'File deleted successfully',
      filename,
    });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return res.status(404).json({
        message: 'File not found',
      });
    }

    next(error);
  }
};
