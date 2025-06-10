const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');

const storage = new GridFsStorage({
  url: process.env.MONGO_URI,
  options: {
    auth: {
      username: process.env.MONGO_USER,
      password: process.env.MONGO_PASSWORD
    },
    authSource: 'auth_db'
  },
  file: (req, file) => {
    return {
      filename: `${Date.now()}-${file.originalname}`,
      bucketName: 'uploads'
    };
  }
});

const upload = multer({ storage });

module.exports = upload;