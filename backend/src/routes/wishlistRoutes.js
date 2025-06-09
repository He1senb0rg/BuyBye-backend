import express from 'express';
import {
    addToWishlist,
    removeFromWishlist,
    getWishlist
} from '../controllers/wishlistController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Protect all routes
router.use(protect);

router.post('/', addToWishlist);
router.delete('/', removeFromWishlist);
router.get('/', getWishlist);
router.get('/:productId', checkIfInWishlist);

export default router;