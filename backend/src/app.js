import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import connectDB from '../src/config/db.js';
//import { connectGridFS } from '../src/config/gridfs.js';

// Routes
import authRoutes from './routes/authRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import productRoutes from './routes/productRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import userRoutes from './routes/userRoutes.js';
import checkoutRoutes from './routes/checkoutRoutes.js';
// import fileRoutes from './routes/fileRoutes.js';
import shopRoutes from './routes/shopRoutes.js';
import { updatePassword } from './controllers/userController.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// MongoDB connection
const startServer = async () => {
  try {
    const conn = await connectDB();
    //connectGridFS(conn);

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  } catch (err) {
    console.error('Falha ao iniciar o servidor:', err.message);
  }
};

startServer();

// Rota Raiz
app.get('/', (req, res) => {
  res.json({
    message: 'Bem-vindo à API da BuyBye!',
    endpoints: {
      dashBoard: 'GET /api/dashboard/summary',
      register: 'POST /api/auth/register',
      login: 'POST /api/auth/login',
      products: {
        all: 'GET /api/products',
        byId: 'GET /api/products/:id',
        create: 'POST /api/products',
        update: 'PUT /api/products/:id',
        delete: 'DELETE /api/products/:id'
      },
      reviews: {
        all: 'GET /api/reviews',
        byId: 'GET /api/reviews/:id',
        create: 'POST /api/reviews',
        update: 'PUT /api/reviews/:id',
        delete: 'DELETE /api/reviews/:id'
      },
      cart: {
        getCart: 'GET /api/cart',
        addItem: 'POST /api/cart',
        updateItem: 'PUT /api/cart/:productId',
        removeItem: 'DELETE /api/cart/:productId',
        clearCart: 'DELETE /api/cart'
      },
      wishlist: {
        addToWishlist: 'POST /api/wishlist',
        removeFromWishlist: 'DELETE /api/wishlist',
        getWishlist: 'GET /api/wishlist',
        checkIfInWishlist: 'GET /api/wishlist/:productId'
      },
      categories: {
        all: 'GET /api/categories',
        byId: 'GET /api/categories/:id',
        create: 'POST /api/categories',
        update: 'PUT /api/categories/:id',
        delete: 'DELETE /api/categories/:id'
      },
      users: {
        all: 'GET /api/users',
        byId: 'GET /api/users/:id',
        create: 'POST /api/users',
        update: 'PUT /api/users/:id',
        delete: 'DELETE /api/users/:id',
        removeImage: 'PUT /api/users/:id/image',
        updatePassword: 'PUT /api/users/:id/password'
      },
      checkout: {
        createOrder: 'POST /api/checkout',
        getBillingHistory: 'GET /api/checkout/history'
      },
      files: {
        upload: 'POST /api/files/upload',
        getFile: 'GET /api/files/:filename'
      }
    }
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/products', productRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/users', userRoutes);
app.use('/api/wishlist', wishlistRoutes);
// app.use('/api/files', fileRoutes);
app.use('/api/shop', shopRoutes)
