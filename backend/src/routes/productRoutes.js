import { Router } from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import upload from '../config/gridfsStorage.js';
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getAllProductsWithDiscount
} from '../controllers/productController.js';

const router = Router();

router.post('/', protect, upload.array('files'), createProduct);
router.get('/', getAllProducts);
router.get('/sales', getAllProductsWithDiscount)
router.get('/:id', getProductById);
router.put('/:id', protect, upload.array('files'), updateProduct);
router.delete('/:id', protect, deleteProduct);

export default router;