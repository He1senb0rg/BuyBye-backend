import express from 'express';
import { createOrder, getBillingHistory,getOrders } from '../controllers/checkoutController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createOrder);
router.get('/history', protect, getBillingHistory)
router.get('/orders', protect, getOrders);

export default router;