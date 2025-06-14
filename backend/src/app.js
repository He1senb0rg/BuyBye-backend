import dotenv from 'dotenv';
dotenv.config();
import express, { json } from 'express';
import { connect } from 'mongoose';
import morgan from 'morgan';
import cors from 'cors';

import authRoutes from './routes/authRoutes.js';

const app = express();

// Middleware
app.use(cors());
app.use(json());
app.use(morgan('dev'));


// Conexão com o MongoDB
connect(process.env.MONGO_URI, {
  auth: {
    username: process.env.MONGO_USER,
    password: process.env.MONGO_PASSWORD
  },
  authSource: "auth_db",
  retryWrites: true,
  w: "majority"
})
.then(() => console.log('Conectado ao MongoDB com sucesso!'))
.catch(err => {
  console.error('Erro na conexão com MongoDB:', err.message);
  console.error('Stack trace:', err.stack);
});

  
// Rota raiz
app.get('/', (req, res) => {
  res.json({
    message: 'Bem-vindo à API de autenticação',
    endpoints: {
      register: 'POST /api/auth/register',
      login: 'POST /api/auth/login'
    }
  });
});


// Rotas da API
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});