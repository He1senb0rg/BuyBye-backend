import mongoose from 'mongoose';

let gfsBucket;

const connectGridFS = (conn) => {
  gfsBucket = new mongoose.mongo.GridFSBucket(conn.connection.db, {
    bucketName: 'uploads',
  });
};

const getGFSBucket = () => gfsBucket;

export { connectGridFS, getGFSBucket };
