# File Upload API

A RESTful file upload API built with **Node.js, Express, TypeScript, and Multer**.

The API supports single and multiple file uploads, server-side file validation, file size restrictions, and local disk storage.

## Features

- Single and multiple file uploads.
- File storage using Multer and local disk storage.
- File size and file count restrictions.
- Server-side file type validation using file signatures.
- MIME type and file extension consistency checks.
- Unique filenames to prevent filename collisions.
- Automatic creation of the uploads directory.
- Rate limiting to prevent excessive upload requests.
- Centralized error handling.
- Automatic cleanup of files when validation fails.
- File retrieval and deletion endpoints.

## Technologies

- Node.js
- Express
- TypeScript
- Multer
- file-type
- express-rate-limit
- dotenv

## Installation

Clone the repository:

```bash
git clone YOUR_REPOSITORY_URL
cd file-upload-api
```

Install dependencies:

```bash
npm install
```

## Environment Variables

Create a `.env` file in the project root:

```env
PORT=3000
UPLOAD_DIR=uploads
MAX_FILE_SIZE_BYTES=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp
```

| Variable              | Description                       |
| --------------------- | --------------------------------- |
| `PORT`                | Server port                       |
| `UPLOAD_DIR`          | Directory for uploaded files      |
| `MAX_FILE_SIZE_BYTES` | Maximum file size in bytes (5 MB) |
| `ALLOWED_FILE_TYPES`  | Allowed MIME types                |

## Running the Server

Start the development server:

```bash
npm run dev
```

The API will be available at:

`http://localhost:3000`

## API Endpoints

### 1. Upload Multiple Files

**POST** `/api/upload`

Upload up to 5 files in a single request.

**Content-Type:** `multipart/form-data`

**Field name:** `files`

Example:

```bash
curl.exe -X POST \
  -F "files=@photo1.jpg" \
  -F "files=@photo2.png" \
  http://localhost:3000/api/upload
```

**Success response:** `201 Created`

### 2. Upload a Single File

**POST** `/api/upload/single`

Upload one file.

**Content-Type:** `multipart/form-data`

**Field name:** `file`

Example:

```bash
curl.exe -X POST \
  -F "file=@photo.jpg" \
  http://localhost:3000/api/upload/single
```

**Success response:** `201 Created`

### 3. Get Uploaded Files

**GET** `/api/upload/files`

Returns information about uploaded files.

### 4. Retrieve a File

**GET** `/api/upload/file/:filename`

Returns a specific uploaded file.

Example:

```text
GET /api/upload/file/photo-unique-id.jpg
```

### 5. Delete a File

**DELETE** `/api/upload/file/:filename`

Deletes a specific uploaded file.

## Upload Validation

The API applies the following restrictions:

| Rule                      | Limit           |
| ------------------------- | --------------- |
| Maximum file size         | 5 MB per file   |
| Maximum files per request | 5               |
| Allowed formats           | JPEG, PNG, WebP |
| Storage                   | Local disk      |

File validation includes:

- Checking the actual file signature using `file-type`.
- Ver
