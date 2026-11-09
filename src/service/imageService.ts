import sharp from 'sharp';
import path from 'node:path';
import { access } from 'node:fs/promises';
import { HttpError } from '../utils/HttpError.js';
import { imageConfig, type ImageFit } from '../config/sharp.js';

const uploadsDir = path.resolve('uploads');
const processedDir = path.resolve('processed');

const getSafeImagePath = (filename: string): string => {
  if (
    !filename ||
    filename !== path.basename(filename) ||
    filename.includes('\0')
  ) {
    throw new HttpError('Invalid filename', 400);
  }

  const imagePath = path.resolve(uploadsDir, filename);
  const relativePath = path.relative(uploadsDir, imagePath);

  if (
    relativePath === '' ||
    relativePath === '..' ||
    relativePath.startsWith(`..${path.sep}`) ||
    path.isAbsolute(relativePath)
  ) {
    throw new HttpError('Invalid file path', 400);
  }

  return imagePath;
};
const ensureImageExists = async (imagePath: string): Promise<void> => {
  try {
    await access(imagePath);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      throw new HttpError('Image not found', 404);
    }

    throw error;
  }
};

const getOutputPath = (filename: string): string => {
  return path.resolve(processedDir, filename);
};

export const getImageMetadata = async (filename: string) => {
  const imagePath = getSafeImagePath(filename);
  await ensureImageExists(imagePath);
  const metadata = await sharp(imagePath).metadata();

  return metadata;
};

export const resizeImage = async (
  filename: string,
  width: number,
  height: number,
  fit: ImageFit = imageConfig.defaultFit
) => {
  const imagePath = getSafeImagePath(filename);

  const outputFilename = `resized-${path.basename(filename)}`;
  const outputPath = getOutputPath(outputFilename);
  await ensureImageExists(imagePath);
  await sharp(imagePath)
    .resize(width, height, {
      fit,
      withoutEnlargement: true,
    })
    .toFile(outputPath);

  return outputPath;
};

export const createThumbnail = async (filename: string) => {
  const imagePath = getSafeImagePath(filename);

  const outputFilename = `thumbnail-${path.basename(filename)}`;
  const outputPath = getOutputPath(outputFilename);
  await ensureImageExists(imagePath);
  await sharp(imagePath)
    .resize(imageConfig.thumbnail.width, imageConfig.thumbnail.height, {
      fit: 'cover',
    })
    .toFile(outputPath);

  return outputPath;
};

export const convertImage = async (
  filename: string,
  format: 'jpeg' | 'png' | 'webp' | 'avif',
  quality = imageConfig.defaultQuality
) => {
  const imagePath = getSafeImagePath(filename);

  const outputFilename = `${path.parse(filename).name}.${format}`;

  const outputPath = getOutputPath(outputFilename);

  await ensureImageExists(imagePath);

  await sharp(imagePath).toFormat(format, { quality }).toFile(outputPath);

  return outputPath;
};

export const addWatermark = async (filename: string) => {
  const imagePath = getSafeImagePath(filename);

  const outputFilename = `watermarked-${path.basename(filename)}`;
  const outputPath = getOutputPath(outputFilename);

  const watermark = Buffer.from(`
    <svg width="300" height="80">
      <text
        x="20"
        y="40"
        font-size="50"
        fill="white"
        opacity="0.8"
      >
        © My Website
      </text>
    </svg>
  `);
  await ensureImageExists(imagePath);
  await sharp(imagePath)
    .composite([
      {
        input: watermark,
        gravity: 'southeast',
      },
    ])
    .toFile(outputPath);

  return outputPath;
};

export const createResponsiveImages = async (filename: string) => {
  const imagePath = getSafeImagePath(filename);

  const parsedFilename = path.parse(filename);

  const results = await Promise.all(
    imageConfig.responsiveSizes.map(async (width) => {
      const outputFilename = `${parsedFilename.name}-${width}${parsedFilename.ext}`;

      const outputPath = getOutputPath(outputFilename);
      await ensureImageExists(imagePath);
      await sharp(imagePath)
        .resize({
          width,
          withoutEnlargement: true,
        })
        .toFile(outputPath);

      return outputPath;
    })
  );

  return results;
};
