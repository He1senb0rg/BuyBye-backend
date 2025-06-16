import mongoose from 'mongoose';

let gfsBucket;

const connectGridFS = (conn) => {
  gfsBucket = new mongoose.mongo.GridFSBucket(conn.connection.db, {
    bucketName: 'uploads',
  });
};

const getGFSBucket = () => gfsBucket;

const getGFSFilesCollection = () => {
  if (!gfsBucket) throw new Error("GridFSBucket not initialized");
  return gfsBucket.s.db.collection("uploads.files");  // Access the files collection
};

export { connectGridFS, getGFSBucket, getGFSFilesCollection };