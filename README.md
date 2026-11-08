# Image Upload and Processing API

A RESTful API built with **Node.js, TypeScript, Express, Multer, and Sharp** for uploading, processing, transforming, and optimizing images.

The API supports single and multiple image uploads, resizing, thumbnails, responsive image generation, metadata extraction, format conversion, and watermarking.

## Features

- **Image Upload**
  - Upload a single image.
  - Upload multiple images.
  - Validate file types and file sizes.
  - List, retrieve, and delete uploaded images.

- **Image Processing**
  - Resize images with configurable width, height, and fit options.
  - Generate thumbnails.
  - Extract image metadata.
  - Convert images to JPEG, PNG, WebP, and AVIF.
  - Add watermarks.
  - Generate responsive image sizes.

- **Security and Middleware**
  - Helmet for HTTP security headers.
  - CORS configuration.
  - Morgan for HTTP request logging.
  - Upload rate limiting.
  - Input validation.
  - Centralized error handling.

- **Static File Serving**
  - Processed images are accessible through a static URL.

> **Note:** Image caching is not implemented in this project.

## Technologies

- Node.js
- TypeScript
- Express.js
- Multer
- Sharp
- Helmet
- CORS
- Morgan
- Axios
- FormData

## Project Structure

```text
file-upload-api/
├── src/
│   ├── app.ts
│   ├── config/
│   │   ├── multer.ts
│   │   └── sharp.ts
│   ├── controllers/
│   │   ├── uploadController.ts
│   │   └── processController.ts
│   ├── middleware/
│   │   ├── validation.ts
│   │   ├── uploadErrorHandler.ts
│   │   └── rateLimiter.ts
│   ├── service/
│   │   └── imageService.ts
│   ├── routers/
│   │   ├── upload.ts
│   │   └── process.ts
│   └── utils/
│       └── HttpError.ts
├── uploads/
├── processed/
├── cache/
├── test-api.js
├── test-image.jpg
├── package.json
└── tsconfig.json
```

## Installation

Clone the repository:

```bash
git clone <your-repository-url>
cd file-upload-api
```

Install dependencies:

```bash
npm install
```

Create a `.env` file in the project root:

```env
PORT=3000
MAX_FILE_SIZE_BYTES=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp
```

Make sure the `uploads/` and `processed/` directories exist.

## Running the Server

Start the development server:

```bash
npm run dev
```

Build the TypeScript project:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

The API will be available at:

```text
http://localhost:3000
```

## API Endpoints

### Health Check

| Method | Endpoint  | Description      |
| ------ | --------- | ---------------- |
| GET    | `/health` | Check API status |

### Upload Endpoints

| Method | Endpoint                     | Description                |
| ------ | ---------------------------- | -------------------------- |
| POST   | `/api/upload/single`         | Upload a single image      |
| POST   | `/api/upload/multiple`       | Upload multiple images     |
| GET    | `/api/upload/files`          | Get all uploaded images    |
| GET    | `/api/upload/file/:filename` | Retrieve an uploaded image |
| DELETE | `/api/upload/file/:filename` | Delete an uploaded image   |

#### Single Image Upload

```http
POST /api/upload/single
Content-Type: multipart/form-data
```

Form field:

```text
file: image.jpg
```

#### Multiple Image Upload

```http
POST /api/upload/multiple
Content-Type: multipart/form-data
```

Form field:

```text
files: image1.jpg
files: image2.jpg
```

Maximum number of files: 5.

### Image Processing Endpoints

| Method | Endpoint                            | Description                |
| ------ | ----------------------------------- | -------------------------- |
| GET    | `/api/process/metadata/:filename`   | Get image metadata         |
| POST   | `/api/process/resize/:filename`     | Resize an image            |
| POST   | `/api/process/thumbnail/:filename`  | Generate a thumbnail       |
| POST   | `/api/process/convert/:filename`    | Convert image format       |
| POST   | `/api/process/watermark/:filename`  | Add a watermark            |
| POST   | `/api/process/responsive/:filename` | Generate responsive images |

### Processing Examples

#### 1. Resize Image

```http
POST /api/process/resize/example.jpg
Content-Type: application/json
```

```json
{
  "width": 800,
  "height": 600,
  "fit": "inside"
}
```

Available fit options:

- `cover`
- `contain`
- `fill`
- `inside`
- `outside`

#### 2. Convert Image

```http
POST /api/process/convert/example.jpg
Content-Type: application/json
```

```json
{
  "format": "webp",
  "quality": 85
}
```

Supported formats:

- JPEG
- PNG
- WebP
- AVIF

Quality range: 1–100.

#### 3. Generate Thumbnail

```http
POST /api/process/thumbnail/example.jpg
```

Creates a thumbnail using the configured dimensions (150 × 150 pixels).

#### 4. Add Watermark

```http
POST /api/process/watermark/example.jpg
```

Adds a watermark to the image.

#### 5. Generate Responsive Images

```http
POST /api/process/responsive/example.jpg
```

Generates multiple image sizes using the configured responsive widths:

- 320px
- 640px
- 1024px
- 1920px

#### 6. Get Image Metadata

```http
GET /api/process/metadata/example.jpg
```

Returns information such as image width, height, format, and file size.

## Accessing Processed Images

Processed images are served statically:

```text
http://localhost:3000/processed/<filename>
```

For example:

```text
http://localhost:3000/processed/resized-example.jpg
```

## Testing

The project includes a test script that exercises the main API functionality.

Place a test image named `test-image.jpg` in the project root.

Start the development server:

```bash
npm run dev
```

In another terminal, run:

```bash
node test-api.js
```

The script tests:

- Single image upload.
- Metadata extraction.
- Image resizing.
- Thumbnail generation.
- Format conversion.
- Watermarking.
- Responsive image generation.

## Error Handling

The API uses centralized error handling to return consistent JSON error responses.

Common HTTP status codes:

| Status Code | Description            |
| ----------- | ---------------------- |
| 400         | Bad Request            |
| 404         | Resource Not Found     |
| 413         | Payload Too Large      |
| 415         | Unsupported Media Type |
| 429         | Too Many Requests      |
| 500         | Internal Server Error  |

## License

This project was created for educational purposes as part of a backend development learning project.
