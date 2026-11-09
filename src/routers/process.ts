import { Router } from 'express';
import {
  resizeController,
  metadataController,
  thumbnailController,
  convertController,
  watermarkController,
  responsiveController,
} from '../controllers/processController.js';
import {
  validateResize,
  validateFormat,
  validateQuality,
  validateFit,
  validateFilename,
} from '../middleware/validation.js';

const router = Router();

router.get('/metadata/:filename', validateFilename, metadataController);

router.post(
  '/resize/:filename',
  validateFilename,
  validateResize,
  validateFit,
  resizeController
);
router.post('/thumbnail/:filename', validateFilename, thumbnailController);
router.post(
  '/convert/:filename',
  validateFilename,
  validateFormat,
  validateQuality,
  convertController
);
router.post('/watermark/:filename', validateFilename, watermarkController);
router.post('/responsive/:filename', validateFilename, responsiveController);

export default router;
