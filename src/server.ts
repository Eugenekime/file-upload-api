import 'dotenv/config';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import express from 'express';
import path from 'node:path';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

import uploadRouter from './routers/upload.js';
import processRouter from './routers/process.js';
import { uploadErrorHandler } from './middleware/uploadErrorHandler.js';

const app = express();

const PORT = Number(process.env.PORT ?? 3000);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDirPath = path.resolve(__dirname, '../uploads');
const processedDirPath = path.resolve(__dirname, '../processed');

app.use(helmet());

app.use(
  cors({
    origin: 'http://localhost:5173',
  })
);

app.use(morgan('dev'));

app.use(express.json());

app.use('/processed', express.static(processedDirPath));

app.use('/api/process', processRouter);
app.use('/api/upload', uploadRouter);

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Image Processing API is running',
    timestamp: new Date().toISOString(),
  });
});

app.use(uploadErrorHandler);

const startServer = async () => {
  try {
    await mkdir(uploadDirPath, { recursive: true });
    await mkdir(processedDirPath, { recursive: true });

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
