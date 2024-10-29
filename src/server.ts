import express from 'express';
import cors from 'cors';
import { initializeFileSystem, saveFileToServer, getServerFiles, deleteServerFile } from './files';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Initialize file system on server start
initializeFileSystem().catch(console.error);

// File upload endpoint
app.post('/api/files', async (req, res) => {
  try {
    const file = req.body;
    const serverFile = await saveFileToServer(file);
    res.json(serverFile);
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

// Get all files endpoint
app.get('/api/files', async (req, res) => {
  try {
    const files = await getServerFiles();
    res.json(files);
  } catch (error) {
    console.error('Get files error:', error);
    res.status(500).json({ error: 'Failed to get files' });
  }
});

// Delete file endpoint
app.delete('/api/files/:id', async (req, res) => {
  try {
    await deleteServerFile(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});