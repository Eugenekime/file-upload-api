import { Router } from 'express';
import upload from '../config/multer.js';
import {
  validateFilename,
  validateUploadedFiles,
} from '../middleware/validation.js';
import { uploadRateLimiter } from '../middleware/rateLimiter.js';
import {
  deleteUploadedFileController,
  getUploadedFileController,
  getUploadedFilesController,
  uploadFilesController,
  uploadSingleFileController,
} from '../controllers/uploadController.js';

const router = Router();

router.post(
  '/single',
  uploadRateLimiter,
  upload.single('file'),
  validateUploadedFiles,
  uploadSingleFileController
);

router.post(
  '/multiple',
  uploadRateLimiter,
  upload.array('files', 5),
  validateUploadedFiles,
  uploadFilesController
);

router.get('/files', getUploadedFilesController);
router.get('/file/:filename', validateFilename, getUploadedFileController);
router.delete(
  '/file/:filename',
  validateFilename,
  deleteUploadedFileController
);

export default router;
