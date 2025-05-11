import express from 'express';
import { addToWishlist, removeFromWishlist, getWishlist } from '../controllers/wishlistController.js';

const router = express.Router();

// Add a product to the wishlist
router.post('/add', addToWishlist);

// Remove a product from the wishlist
router.post('/remove', removeFromWishlist);

// Get all products in the wishlist
router.get('/:userId', getWishlist);

export default router;