// config/db.js
import mongoose from 'mongoose';

const connectDB = async () => {
  const USER = process.env.MONGO_USER;
  const PASS = encodeURIComponent(process.env.MONGO_PASS);
  const HOST = 'gossip-cluster.vgxiqjm.mongodb.net';
  const DB   = 'gossips';

  const uri = `mongodb+srv://${USER}:${PASS}@${HOST}/${DB}?retryWrites=true&w=majority&appName=Gossip-cluster`;

  try {
    await mongoose.connect(uri);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('Mongo connect error:', err);
    process.exit(1);
  }
};

export default connectDB;
