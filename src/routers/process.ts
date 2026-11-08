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
} from '../middleware/validation.js';

const router = Router();

router.get('/metadata/:filename', metadataController);

router.post('/resize/:filename', validateResize, validateFit, resizeController);
router.post('/thumbnail/:filename', thumbnailController);
router.post(
  '/convert/:filename',
  validateFormat,
  validateQuality,
  convertController
);
router.post('/watermark/:filename', watermarkController);
router.post('/responsive/:filename', responsiveController);

export default router;
