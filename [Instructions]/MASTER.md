# Business Operations Dashboard - Master Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Core Architecture](#core-architecture)
3. [API Specification](#api-specification)
4. [Development Standards](#development-standards)
5. [Logging System](#logging-system)
6. [Security Framework](#security-framework)
7. [AI Context](#ai-context)
8. [Change Management](#change-management)

## Project Overview

### Purpose
The Business Operations Dashboard is an API-driven web application designed for processing and analysing business operations data, with a focus on PDF document analysis and data extraction.

### Key Features
- PDF document processing
- AI-powered data extraction
- Real-time analysis
- Historical tracking
- Performance monitoring
- Secure file management

### Core Principles
1. API-First Development
2. Cross-Compatibility
3. Security-Focused
4. Performance-Optimised
5. Junior Developer Friendly

## Core Architecture

### System Components
```
src/
├── api/          # API endpoints and handlers
├── lib/          # Core utilities and services
├── services/     # Business logic
├── types/        # TypeScript definitions
└── errors/       # Error handling system

[Instructions]/   # Project documentation
└── logs/         # Change tracking system
```

### Technology Stack
- Frontend: React with TypeScript
- API: Express.js
- PDF Processing: pdf.js
- AI Integration: OpenAI GPT-4
- Storage: File system with metadata
- Authentication: JWT

### Standards
1. British English throughout codebase
2. Comprehensive documentation
3. Type safety
4. Error handling
5. Performance monitoring

## API Specification

### OpenAPI 2.0 Schema
```yaml
swagger: '2.0'
info:
  title: Business Operations Dashboard API
  version: '1.0.0'
basePath: /api/v1
```

### Core Endpoints
1. File Management
   ```
   POST /api/files/upload
   GET /api/files/{id}
   POST /api/files/{id}/process
   ```

2. Analysis
   ```
   POST /api/analysis/extract
   POST /api/analysis/process
   GET /api/analysis/{id}/results
   ```

3. System
   ```
   GET /api/system/status
   GET /api/system/metrics
   POST /api/system/maintenance
   ```

### Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message",
    "details": {
      "context": "Additional information",
      "timestamp": "ISO-8601 date"
    }
  }
}
```

## Development Standards

### Code Style
1. Use British English
   ```typescript
   // Correct
   function initialiseColour(colour: string)
   
   // Incorrect
   function initializeColor(color: string)
   ```

2. Clear Documentation
   ```typescript
   /**
    * Process a PDF file and extract structured data
    * 
    * @param file - The PDF file to process
    * @param options - Processing options
    * @returns Promise resolving to extracted data
    * @throws {ProcessingError} If file processing fails
    */
   ```

3. Error Handling
   ```typescript
   try {
     await processFile(file);
   } catch (error) {
     if (error instanceof ProcessingError) {
       // Handle processing-specific error
     } else if (error instanceof APIError) {
       // Handle API-related error
     } else {
       // Handle unknown error
     }
   }
   ```

### Testing Requirements
1. Unit Tests
2. Integration Tests
3. End-to-End Tests
4. Performance Tests
5. Security Tests

## Logging System

### Directory Structure
```
logs/
├── CHANGES/     # Chronological changes
├── ROLLBACKS/   # Rollback history
├── API/         # API changes
└── SECURITY/    # Security updates
```

### Log Format
```json
{
  "metadata": {
    "id": "28-001-Dragon",
    "timestamp": "ISO-8601 date",
    "fantasyName": "string",
    "category": "string",
    "author": "string"
  },
  "changes": {
    "files": [{
      "path": "string",
      "diff": "string",
      "checksum": "string"
    }],
    "dependencies": ["string"],
    "rollbackSteps": ["string"]
  },
  "context": {
    "description": "string",
    "motivation": "string",
    "relatedLogs": ["string"]
  }
}
```

### Fantasy Naming Convention
- Dragons: Major system changes
- Phoenix: Recovery and fixes
- Griffon: Security updates
- Unicorn: UI/UX changes
- Basilisk: Database changes
- Hydra: Multi-component changes
- Kraken: API changes
- Chimera: Hybrid changes

## Security Framework

### Authentication
- JWT-based authentication
- Token refresh mechanism
- Rate limiting
- Access control

### File Security
1. Validation
   - Size limits
   - Format verification
   - Content scanning
   - Metadata validation

2. Storage
   - Secure file paths
   - Access control
   - Encryption at rest
   - Regular cleanup

### Error Handling
1. Never expose internal errors
2. Log security events
3. Implement proper recovery
4. Maintain audit trail

## AI Context

### Purpose
This section provides context for future AI interactions with the codebase.

### Key Points for AI
1. No frontend changes without permission
2. Focus on API-driven development
3. Maintain British English throughout
4. Write for junior developers
5. Log all changes comprehensively

### Processing Flow
1. File Upload
   - Validate file
   - Store temporarily
   - Generate metadata
   - Queue for processing

2. Processing
   - Extract text
   - Process with AI
   - Store results
   - Generate analysis

3. Analysis
   - Structure data
   - Generate insights
   - Store results
   - Provide feedback

### Error Handling Strategy
1. Use custom error classes
2. Include context
3. Implement recovery
4. Log comprehensively
5. Provide feedback

## Change Management

### Process
1. Review engineering notes
2. Check existing logs
3. Create feature branch
4. Implement changes
5. Update documentation
6. Create log entry
7. Test thoroughly
8. Submit for review

### Rollback Procedure
1. Identify change by:
   - Fantasy name
   - Log ID
   - Date
2. Review dependencies
3. Execute rollback
4. Verify system state
5. Log rollback

### Version Control
1. Maintain change logs
2. Track dependencies
3. Store file checksums
4. Enable rollbacks
5. Monitor changes

## Rules and Guidelines

### Critical Rules
1. No UI/frontend changes without explicit permission
2. Focus on API-driven development
3. Maintain comprehensive logs
4. Review engineering notes before changes
5. Document all modifications
6. Use British English throughout
7. Write code for junior developers

### Best Practices
1. Clear documentation
2. Comprehensive error handling
3. Performance optimisation
4. Security first
5. Maintainable code

### Performance Standards
1. Optimise file processing
2. Implement caching
3. Monitor memory usage
4. Load balancing
5. Resource monitoring

## Note to Future AI

This documentation serves as your primary reference for understanding and maintaining the Business Operations Dashboard. Key points to remember:

1. System Philosophy
   - API-driven architecture
   - Security-focused design
   - Performance-optimised
   - Junior developer friendly

2. Critical Workflows
   - File processing
   - Data extraction
   - Analysis generation
   - Error handling

3. Documentation Standards
   - British English
   - Clear explanations
   - Code examples
   - Context provision

4. Change Management
   - Comprehensive logging
   - Fantasy-themed tracking
   - Rollback support
   - Dependency tracking

Remember to:
1. Review this documentation before making changes
2. Log all modifications
3. Maintain coding standards
4. Focus on API development
5. Preserve frontend integrity

This system is designed to be:
- Reliable
- Maintainable
- Secure
- Efficient
- Cross-compatible

Your role is to enhance and maintain these qualities while ensuring the system remains accessible to junior developers.