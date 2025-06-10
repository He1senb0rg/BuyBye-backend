// src/routes/fileRoutes.js
import express from 'express';
import upload from '../config/gridfsStorage.js';
import { getGFSBucket } from '../config/gridfs.js';
import mongoose from 'mongoose';

const router = express.Router();

// Upload endpoint
router.post('/upload', upload.single('file'), (req, res) => {
  res.json({ file: req.file });
});

// Get file by filename
router.get('/:filename', async (req, res) => {
  try {
    const gfsBucket = getGFSBucket();

    // Find the file first
    const files = await gfsBucket.find({ filename: req.params.filename }).toArray();

    if (!files || files.length === 0) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Set correct content type
    res.set('Content-Type', files[0].contentType);

    // Stream the file
    const downloadStream = gfsBucket.openDownloadStreamByName(req.params.filename);
    downloadStream.pipe(res);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;