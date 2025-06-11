import { Router } from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import upload from '../config/gridfsStorage.js'; // GridFS multer storage

import {
  createShop,
  getAllShops,
  getShopById,
  updateShop,
  deleteShop,
  updateShopBanner
} from '../controllers/shopController.js';

const router = Router();

router.post('/', protect, createShop);
router.get('/', getAllShops);
router.get('/:id', getShopById);
router.put('/:id', protect, updateShop);
router.delete('/:id', protect, deleteShop);
router.put('/:id/banner', protect, upload.single('file'), updateShopBanner);

export default router;