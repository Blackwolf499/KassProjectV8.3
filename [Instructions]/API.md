# API Documentation

## Overview
The Business Operations Dashboard API is designed to be:
- RESTful
- Secure
- Efficient
- Well-documented
- Cross-compatible

## Endpoints

### File Upload
```
POST /api/files/upload
Content-Type: multipart/form-data

Response:
{
  "success": boolean,
  "fileId": string,
  "metadata": {
    "originalName": string,
    "size": number,
    "type": string,
    "uploadedAt": string
  }
}
```

### File Retrieval
```
GET /api/files/:fileId
Response:
{
  "success": boolean,
  "file": {
    "id": string,
    "name": string,
    "url": string,
    "metadata": object
  }
}
```

### File Processing
```
POST /api/files/:fileId/process
Response:
{
  "success": boolean,
  "results": {
    "analysis": object,
    "metadata": object
  }
}
```

## Error Handling
All errors follow the format:
```json
{
  "success": false,
  "error": {
    "code": string,
    "message": string,
    "details": object
  }
}
```

## Authentication
- Bearer token required for all endpoints
- Token format: `Authorization: Bearer <token>`
- Tokens expire after 24 hours

## Rate Limiting
- 100 requests per minute per IP
- 1000 requests per hour per API key

## File Limitations
- Maximum file size: 50MB
- Supported formats: PDF only
- Maximum concurrent uploads: 5