import { Router } from 'express';
import { protect } from '../middlewares/authMiddleware.js';
const router = Router();
import {
  createReview,
  getAllReviews,
  getReviewById,
  getAllProductReviews,
  getAllUserReviews,
  getUserReviewForProduct,
  updateReview,
  deleteReview,
  getProductRating
} from '../controllers/reviewController.js';


router.post('/', protect, createReview);
router.get('/', getAllReviews);
router.get('/:id', getReviewById);
router.get('/product/:id', getAllProductReviews);
router.get('/user/:id', getAllUserReviews);
router.get('/user/:userId/product/:productId', getUserReviewForProduct);
router.put('/:id', updateReview);
router.delete('/:id', deleteReview);
router.get('/product/:id/rating', getProductRating);

export default router;