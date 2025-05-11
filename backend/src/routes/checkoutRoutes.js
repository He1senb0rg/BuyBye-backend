import express from 'express';
import { createOrder } from '../controllers/checkoutController.js';
import { getBillingHistory } from '../controllers/checkoutController.js';

const router = express.Router();

// Route to create an order
router.post('/', createOrder);
router.get('/billing-history', auth, getBillingHistory);

export default router;