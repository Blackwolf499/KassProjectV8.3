import { fileUploadRouter } from './server';
import express from 'express';
import { promises as fs } from 'fs';
import path from 'path';

const UPLOAD_DIR = path.join(process.cwd(), 'PDF_FILES_UPLOAD');

// Create upload directory if it doesn't exist
async function ensureUploadDir() {
  try {
    await fs.access(UPLOAD_DIR);
  } catch {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
  }
}

// Initialize API router
const apiRouter = express.Router();
apiRouter.use('/files', fileUploadRouter);

// Ensure upload directory exists on startup
ensureUploadDir().catch(console.error);

export { apiRouter };