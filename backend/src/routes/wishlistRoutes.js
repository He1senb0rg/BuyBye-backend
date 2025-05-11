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

// Add a product to the wishlist
router.post('/add', addToWishlist);

// Remove a product from the wishlist
router.delete('/remove', removeFromWishlist);

// Get all products in the wishlist
router.get('/', getWishlist); // No need for :userId here

export default router;