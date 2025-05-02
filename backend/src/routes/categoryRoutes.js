import { Router } from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js';
const router = Router();

router.post('/', protect, createCategory);
router.get('/', getAllCategories);
router.get('/:id', getCategoryById);
router.put('/:id', protect, updateCategory);
router.delete('/:id', protect, deleteCategory);

export default router;