import { Router } from 'express';
const router = Router();
import { register, login } from '../controllers/authController.js';

// Rota de registro
router.post('/register', register);

// Rota de login
router.post('/login', login);

export default router;