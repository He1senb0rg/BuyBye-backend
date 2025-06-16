import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      auth: {
        username: process.env.MONGO_USER,
        password: process.env.MONGO_PASSWORD
      },
      authSource: 'admin',
      retryWrites: true,
      w: 'majority'
    });

    console.log('🟢 Conectado ao MongoDB com sucesso!');
    return conn;

  } catch (err) {
    console.error('🔴 Erro na conexão com MongoDB:', err.message);
    process.exit(1);
  }
};

export default connectDB;