import sharp from 'sharp';
import path from 'node:path';
import { imageConfig, type ImageFit } from '../config/sharp.js';

export const getImageMetadata = async (filename: string) => {
  const imagePath = path.resolve('uploads', filename);

  const metadata = await sharp(imagePath).metadata();

  return metadata;
};

export const resizeImage = async (
  filename: string,
  width: number,
  height: number,
  fit: ImageFit = imageConfig.defaultFit
) => {
  const imagePath = path.resolve('uploads', filename);

  const outputPath = path.resolve('processed', `resized-${filename}`);

  await sharp(imagePath)
    .resize(width, height, {
      fit,
      withoutEnlargement: true,
    })
    .toFile(outputPath);

  return outputPath;
};

export const createThumbnail = async (filename: string) => {
  const imagePath = path.resolve('uploads', filename);

  const outputPath = path.resolve('processed', `thumbnail-${filename}`);

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
  const imagePath = path.resolve('uploads', filename);

  const outputFilename = `${path.parse(filename).name}.${format}`;

  const outputPath = path.resolve('processed', outputFilename);

  await sharp(imagePath).toFormat(format, { quality }).toFile(outputPath);

  return outputPath;
};

export const addWatermark = async (filename: string) => {
  const imagePath = path.resolve('uploads', filename);

  const outputPath = path.resolve('processed', `watermarked-${filename}`);

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
  const imagePath = path.resolve('uploads', filename);

  const parsedFilename = path.parse(filename);

  const results = await Promise.all(
    imageConfig.responsiveSizes.map(async (width) => {
      const outputFilename = `${parsedFilename.name}-${width}${parsedFilename.ext}`;

      const outputPath = path.resolve('processed', outputFilename);

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
