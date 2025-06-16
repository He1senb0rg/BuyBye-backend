import express from 'express';
import upload from '../config/gridfsStorage.js';
import { getGFSBucket } from '../config/gridfs.js';

const router = express.Router();

// Upload endpoint
router.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  res.status(201).json({ file: req.file });
});

// Get file by filename
router.get('/:filename', async (req, res) => {
  try {
    const gfsBucket = getGFSBucket();

    const files = await gfsBucket.find({ filename: req.params.filename }).toArray();

    if (!files || files.length === 0) {
      return res.status(404).json({ error: 'File not found' });
    }

    const file = files[0];

    res.set('Content-Type', file.contentType || 'application/octet-stream');

    const downloadStream = gfsBucket.openDownloadStreamByName(req.params.filename);

    downloadStream.on('error', () => {
      return res.status(500).json({ error: 'Error streaming file' });
    });

    downloadStream.pipe(res);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete file by filename
router.delete('/:filename', async (req, res) => {
  try {
    const gfsBucket = getGFSBucket();

    const files = await gfsBucket.find({ filename: req.params.filename }).toArray();

    if (!files || files.length === 0) {
      return res.status(404).json({ error: 'File not found' });
    }

    const fileId = files[0]._id;

    await gfsBucket.delete(fileId);

    res.json({ message: 'File deleted successfully' });
  } catch (err) {
    console.error('Error deleting file:', err);
    res.status(500).json({ error: 'Error deleting file' });
  }
});

export default router;