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

router.post('/add', addToWishlist);
router.delete('/remove', removeFromWishlist);
router.get('/:userId', getWishlist);

export default router;