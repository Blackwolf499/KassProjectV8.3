# API Schema Documentation

## OpenAPI 2.0 Specification

```yaml
swagger: '2.0'
info:
  title: Business Operations Dashboard API
  version: '1.0.0'
  description: API for processing and analysing business operations data
basePath: /api/v1
schemes:
  - https
consumes:
  - application/json
produces:
  - application/json

securityDefinitions:
  BearerAuth:
    type: apiKey
    name: Authorization
    in: header
    description: 'Bearer {token}'

paths:
  /files/upload:
    post:
      summary: Upload file for processing
      security:
        - BearerAuth: []
      parameters:
        - in: body
          name: uploadRequest
          required: true
          schema:
            type: object
            required:
              - file
            properties:
              file:
                type: string
                format: binary
                description: Base64 encoded file content
              metadata:
                type: object
                properties:
                  filename:
                    type: string
                  contentType:
                    type: string
                  size:
                    type: integer
      responses:
        200:
          description: File uploaded successfully
          schema:
            type: object
            properties:
              success:
                type: boolean
              fileId:
                type: string
              metadata:
                type: object
                properties:
                  originalName:
                    type: string
                  size:
                    type: integer
                  type:
                    type: string
                  uploadedAt:
                    type: string
                    format: date-time
        400:
          $ref: '#/responses/BadRequest'
        401:
          $ref: '#/responses/Unauthorized'
        413:
          $ref: '#/responses/PayloadTooLarge'

  /files/{fileId}/process:
    post:
      summary: Process uploaded file
      security:
        - BearerAuth: []
      parameters:
        - in: path
          name: fileId
          required: true
          type: string
        - in: body
          name: processingOptions
          required: true
          schema:
            type: object
            properties:
              analysisType:
                type: string
                enum: [basic, detailed, comprehensive]
              extractText:
                type: boolean
              includeMetadata:
                type: boolean
      responses:
        200:
          description: File processed successfully
          schema:
            type: object
            properties:
              success:
                type: boolean
              results:
                type: object
                properties:
                  analysis:
                    type: object
                  metadata:
                    type: object
        404:
          $ref: '#/responses/NotFound'
        422:
          $ref: '#/responses/UnprocessableEntity'

  /files/{fileId}:
    get:
      summary: Retrieve file details
      security:
        - BearerAuth: []
      parameters:
        - in: path
          name: fileId
          required: true
          type: string
      responses:
        200:
          description: File details retrieved successfully
          schema:
            type: object
            properties:
              success:
                type: boolean
              file:
                type: object
                properties:
                  id:
                    type: string
                  name:
                    type: string
                  url:
                    type: string
                  metadata:
                    type: object
        404:
          $ref: '#/responses/NotFound'

responses:
  BadRequest:
    description: Invalid request
    schema:
      $ref: '#/definitions/Error'
  Unauthorized:
    description: Authentication required
    schema:
      $ref: '#/definitions/Error'
  NotFound:
    description: Resource not found
    schema:
      $ref: '#/definitions/Error'
  PayloadTooLarge:
    description: File size exceeds limit
    schema:
      $ref: '#/definitions/Error'
  UnprocessableEntity:
    description: Unable to process file
    schema:
      $ref: '#/definitions/Error'

definitions:
  Error:
    type: object
    properties:
      success:
        type: boolean
        example: false
      error:
        type: object
        properties:
          code:
            type: string
          message:
            type: string
          details:
            type: object
    required:
      - success
      - error

  ProcessingResult:
    type: object
    properties:
      clerks:
        type: array
        items:
          type: object
          properties:
            clerk_id:
              type: string
            clerk_name:
              type: string
            total_sales:
              type: number
            sales_records:
              type: array
              items:
                type: object
                properties:
                  item_code:
                    type: string
                  item_description:
                    type: string
                  quantity_sold:
                    type: number
                  amount:
                    type: number
```

## Example Requests

### File Upload
```json
POST /api/v1/files/upload
Authorization: Bearer <token>
Content-Type: application/json

{
  "file": "base64_encoded_file_content",
  "metadata": {
    "filename": "sales_report.pdf",
    "contentType": "application/pdf",
    "size": 1048576
  }
}
```

### Process File
```json
POST /api/v1/files/{fileId}/process
Authorization: Bearer <token>
Content-Type: application/json

{
  "analysisType": "comprehensive",
  "extractText": true,
  "includeMetadata": true
}
```

## Error Handling

All errors follow a consistent format:
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      "field": "specific_field",
      "reason": "specific_reason",
      "timestamp": "2024-03-28T12:00:00Z"
    }
  }
}
```

## Rate Limiting

Rate limits are enforced per API key:
- 100 requests per minute
- 1000 requests per hour
- 10,000 requests per day

Rate limit headers are included in all responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1648464000
```