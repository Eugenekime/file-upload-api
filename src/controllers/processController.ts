import type { Request, Response, NextFunction } from 'express';
import { HttpError } from '../utils/HttpError.js';
import path from 'path';
import {
  resizeImage,
  getImageMetadata,
  createThumbnail,
  convertImage,
  addWatermark,
  createResponsiveImages,
} from '../service/imageService.js';

const getProcessedImageUrl = (outputPath: string) => {
  return `/processed/${path.basename(outputPath)}`;
};

export const resizeController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { filename } = req.params;
    const { width, height, fit } = req.body;
    if (!filename || typeof filename !== 'string') {
      throw new HttpError(`File name must be string and not be empty`, 400);
    }
    const outputPath = await resizeImage(filename, width, height, fit);

    res.status(200).json({
      message: 'Image resized successfully',
      filename: path.basename(outputPath),
      url: getProcessedImageUrl(outputPath),
    });
  } catch (error) {
    next(error);
  }
};

export const metadataController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { filename } = req.params;
    if (!filename || typeof filename !== 'string') {
      throw new HttpError(`File name must be string and not be empty`, 400);
    }
    const metadata = await getImageMetadata(filename);

    res.status(200).json({
      message: 'Metadata retrieved successfully',
      metadata,
    });
  } catch (error) {
    next(error);
  }
};

export const thumbnailController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { filename } = req.params;
    if (!filename || typeof filename !== 'string') {
      throw new HttpError(`File name must be string and not be empty`, 400);
    }
    const outputPath = await createThumbnail(filename);

    res.status(200).json({
      message: 'Thumbnail created successfully',
      filename: path.basename(outputPath),
      url: getProcessedImageUrl(outputPath),
    });
  } catch (error) {
    next(error);
  }
};

export const convertController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { filename } = req.params;
    const { format, quality } = req.body;
    if (!filename || typeof filename !== 'string') {
      throw new HttpError(`File name must be string and not be empty`, 400);
    }
    const outputPath = await convertImage(filename, format, quality);

    res.status(200).json({
      message: 'Image converted successfully',
      filename: path.basename(outputPath),
      url: getProcessedImageUrl(outputPath),
    });
  } catch (error) {
    next(error);
  }
};

export const watermarkController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { filename } = req.params;
    if (!filename || typeof filename !== 'string') {
      throw new HttpError(`File name must be string and not be empty`, 400);
    }
    const outputPath = await addWatermark(filename);

    res.status(200).json({
      message: 'Watermark added successfully',
      filename: path.basename(outputPath),
      url: getProcessedImageUrl(outputPath),
    });
  } catch (error) {
    next(error);
  }
};

export const responsiveController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { filename } = req.params;
    if (!filename || typeof filename !== 'string') {
      throw new HttpError(`File name must be string and not be empty`, 400);
    }
    const outputPaths = await createResponsiveImages(filename);

    res.status(200).json({
      message: 'Responsive images created successfully',
      images: outputPaths.map((outputPath) => ({
        filename: path.basename(outputPath),
        url: `/processed/${path.basename(outputPath)}`,
      })),
    });
  } catch (error) {
    next(error);
  }
};
