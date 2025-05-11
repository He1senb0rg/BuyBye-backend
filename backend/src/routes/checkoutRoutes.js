import express from 'express';
import { createOrder } from '../controllers/checkoutController.js';

const router = express.Router();

// Route to create an order
router.post('/', createOrder);

export default router;