# File Upload API

A RESTful file upload API built with **Node.js, Express, TypeScript, and Multer**.

The API supports single and multiple file uploads, server-side file validation, file size restrictions, and local disk storage.

## Features

- Single and multiple file uploads.
- File storage using Multer and local disk storage.
- File size and file count restrictions.
- Server-side file type detection using file signatures.
- MIME type verification against actual file content.
- File extensions generated based on the detected file type.
- Unique filenames using UUID to prevent filename collisions.
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

| Variable              | Description                                |
| --------------------- | ------------------------------------------ |
| `PORT`                | Server port                                |
| `UPLOAD_DIR`          | Directory for uploaded files               |
| `MAX_FILE_SIZE_BYTES` | Maximum file size in bytes (5 MB)          |
| `ALLOWED_FILE_TYPES`  | Comma-separated list of allowed MIME types |

## Running the Server

Start the development server:

```bash
npm run dev
```

The API will be available at:

```text
http://localhost:3000
```

## API Endpoints

### 1. Upload Multiple Files

**POST** `/api/upload/multiple`

Upload up to 5 files in a single request.

**Content-Type:** `multipart/form-data`

**Field name:** `files`

Example:

```bash
curl.exe -X POST \
  -F "files=@photo1.jpg" \
  -F "files=@photo2.png" \
  http://localhost:3000/api/upload/multiple
```

**Success response:** `201 Created`

Example response:

```json
{
  "message": "Files uploaded successfully",
  "files": [
    {
      "originalName": "photo1.jpg",
      "filename": "550e8400-e29b-41d4-a716-446655440000.jpg",
      "mimeType": "image/jpeg",
      "size": 102400
    }
  ]
}
```

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

Example response:

```json
{
  "message": "File uploaded successfully",
  "file": {
    "originalName": "photo.jpg",
    "filename": "550e8400-e29b-41d4-a716-446655440000.jpg",
    "mimeType": "image/jpeg",
    "size": 102400
  }
}
```

### 3. Get Uploaded Files

**GET** `/api/upload/files`

Returns a list of uploaded files, including their filenames, sizes, and upload timestamps.

**Success response:** `200 OK`

### 4. Retrieve a File

**GET** `/api/upload/file/:filename`

Returns a specific uploaded file.

Example:

```text
GET /api/upload/file/550e8400-e29b-41d4-a716-446655440000.jpg
```

**Success response:** `200 OK`

### 5. Delete a File

**DELETE** `/api/upload/file/:filename`

Deletes a specific uploaded file.

**Success response:** `200 OK`

Example response:

```json
{
  "message": "File deleted successfully",
  "filename": "550e8400-e29b-41d4-a716-446655440000.jpg"
}
```

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
- Verifying that the detected MIME type is allowed.
- Comparing the client-provided MIME type with the detected MIME type.
- Generating file extensions based on the detected file type rather than the original filename.
- Removing uploaded files if validation fails.

## Error Handling

The API uses centralized error handling and returns appropriate HTTP status codes.

| Status Code                  | Description                          |
| ---------------------------- | ------------------------------------ |
| `400 Bad Request`            | No file uploaded or invalid filename |
| `404 Not Found`              | Requested file does not exist        |
| `413 Payload Too Large`      | File exceeds the size limit          |
| `415 Unsupported Media Type` | Unsupported or invalid file type     |
| `429 Too Many Requests`      | Upload rate limit exceeded           |
| `500 Internal Server Error`  | Unexpected server error              |

## Testing

The following scenarios should be tested:

| Test Case                           | Expected Result              |
| ----------------------------------- | ---------------------------- |
| Upload a valid JPEG image           | `201 Created`                |
| Upload a valid PNG image            | `201 Created`                |
| Upload a valid WebP image           | `201 Created`                |
| Upload an unsupported file type     | `415 Unsupported Media Type` |
| Upload a PNG file renamed to `.php` | Saved with `.png` extension  |
| Upload a file larger than 5 MB      | `413 Payload Too Large`      |
| Upload more than 5 files            | Request rejected             |
| Upload without a file               | `400 Bad Request`            |
| Retrieve an existing file           | `200 OK`                     |
| Retrieve a nonexistent file         | `404 Not Found`              |
| Delete an existing file             | `200 OK`                     |
| Delete a nonexistent file           | `404 Not Found`              |

## License

This project is available under the MIT License.
