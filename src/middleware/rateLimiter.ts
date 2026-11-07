import { rateLimit } from 'express-rate-limit';

export const uploadRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  message: {
    message: 'Too many upload requests. Please try again later.',
  },
  standardHeaders: 'draft-8',
  legacyHeaders: false,
});
