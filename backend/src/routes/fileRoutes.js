// const express = require('express');
// const { getGFS } = require('../config/gridfs');
// const upload = require('../config/gridfsStorage');
// const router = express.Router();

// // Upload file
// router.post('/upload', upload.single('file'), (req, res) => {
//   res.json({ file: req.file });
// });

// // Get file by filename
// router.get('/:filename', async (req, res) => {
//   try {
//     const gfs = getGFS();
//     if (!gfs) {
//       return res.status(500).json({ message: 'GridFS not initialized' });
//     }

//     const file = await gfs.files.findOne({ filename: req.params.filename });

//     if (!file || file.length === 0) {
//       return res.status(404).json({ message: 'No file exists' });
//     }

//     const readstream = gfs.createReadStream(file.filename);
//     res.set('Content-Type', file.contentType);
//     readstream.pipe(res);
//   } catch (err) {
//     res.status(500).json({ message: 'Error retrieving file', error: err.message });
//   }
// });

// module.exports = router;