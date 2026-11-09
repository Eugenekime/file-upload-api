import 'dotenv/config';

import express from 'express';
import { mkdir } from 'node:fs/promises';
import { uploadDirPath } from './config/upload.js';

import uploadRouter from './routers/upload.js';
import { uploadErrorHandler } from './middleware/uploadErrorHandler.js';

const app = express();

const PORT = Number(process.env.PORT ?? 3000);

app.use(express.json());

app.use('/api/upload', uploadRouter);

app.use(uploadErrorHandler);

const startServer = async () => {
  try {
    await mkdir(uploadDirPath, { recursive: true });

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
