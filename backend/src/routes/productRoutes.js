import { Router } from 'express';
import { protect } from '../middlewares/authMiddleware.js';
const router = Router();
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  updateProductDiscount,
} from '../controllers/productController.js';


router.post('/', protect, createProduct);
router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.put('/:id', protect, updateProduct);
router.delete('/:id', protect, deleteProduct);
router.put('/:id/discount', protect, updateProductDiscount);

export default router;