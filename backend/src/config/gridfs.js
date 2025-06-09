import mongoose from 'mongoose';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const Grid = require('gridfs-stream');

let gfs;

const connectGridFS = (conn) => {
  gfs = Grid(conn.connection.db, mongoose.mongo);
  gfs.collection('uploads');
};

const getGFS = () => gfs;

export { connectGridFS, getGFS };