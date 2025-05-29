import express from 'express';
import { createOrder, getBillingHistory } from '../controllers/checkoutController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createOrder);
router.get('/history', protect, getBillingHistory);

export default router;