export type ImageFit = 'cover' | 'contain' | 'fill' | 'inside' | 'outside';

export const imageConfig = {
  formats: ['jpeg', 'png', 'webp', 'avif'] as const,

  defaultQuality: 80,

  maxWidth: 4000,
  maxHeight: 4000,

  thumbnail: {
    width: 150,
    height: 150,
  },

  responsiveSizes: [320, 640, 1024, 1920],

  defaultFit: 'inside' as ImageFit,
};
