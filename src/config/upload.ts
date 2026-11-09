import path from 'node:path';

export const uploadDirPath = path.resolve(
  process.cwd(),
  process.env.UPLOAD_DIR ?? 'uploads'
);
