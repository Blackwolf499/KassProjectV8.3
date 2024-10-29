import express from 'express';
import multer from 'multer';
import path from 'path';
import { promises as fs } from 'fs';
import { createHash } from 'crypto';

const UPLOAD_DIR = path.join(process.cwd(), 'PDF_FILES_UPLOAD');
const router = express.Router();

// Ensure upload directory exists
async function ensureUploadDir() {
  try {
    await fs.access(UPLOAD_DIR);
  } catch {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
  }
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (_req, _file, cb) => {
    await ensureUploadDir();
    cb(null, UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    const fileId = createHash('sha256')
      .update(`${file.originalname}-${Date.now()}`)
      .digest('hex')
      .slice(0, 32);
    
    const safeFileName = `${fileId}-${file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    cb(null, safeFileName);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  }
});

// File upload endpoint
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file provided'
      });
    }

    const fileId = path.basename(req.file.filename).split('-')[0];
    const metadata = {
      fileId,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      uploadDate: new Date().toISOString(),
      path: req.file.path
    };

    // Save metadata
    await fs.writeFile(
      path.join(UPLOAD_DIR, `${fileId}-metadata.json`),
      JSON.stringify(metadata, null, 2)
    );

    return res.status(200).json({
      success: true,
      fileId,
      metadata
    });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    });
  }
});

// Get file metadata
router.get('/files/:fileId/metadata', async (req, res) => {
  try {
    const { fileId } = req.params;
    const metadataPath = path.join(UPLOAD_DIR, `${fileId}-metadata.json`);
    
    const metadata = JSON.parse(await fs.readFile(metadataPath, 'utf-8'));
    res.json({ success: true, metadata });
  } catch (error) {
    res.status(404).json({
      success: false,
      error: 'File not found'
    });
  }
});

// List all files
router.get('/files', async (_req, res) => {
  try {
    await ensureUploadDir();
    const files = await fs.readdir(UPLOAD_DIR);
    
    const metadataFiles = files.filter(f => f.endsWith('-metadata.json'));
    const filesMetadata = await Promise.all(
      metadataFiles.map(async (file) => {
        const content = await fs.readFile(path.join(UPLOAD_DIR, file), 'utf-8');
        return JSON.parse(content);
      })
    );

    res.json({
      success: true,
      files: filesMetadata
    });
  } catch (error) {
    console.error('Error listing files:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to list files'
    });
  }
});

export { router as fileUploadRouter };