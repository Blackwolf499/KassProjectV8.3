import express from 'express';
import cors from 'cors';
import { fileUploadRouter } from './files/server';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Mount routes
app.use('/api', fileUploadRouter);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('API Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error',
    details: err.details || {}
  });
});

export { app };