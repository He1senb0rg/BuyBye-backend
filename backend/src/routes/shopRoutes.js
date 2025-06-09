import { Router } from 'express';
import { protect } from '../middlewares/authMiddleware.js';
const router = Router();
import {
    createShop,
    getAllShops,
    getShopById, 
    updateShop,
    deleteShop
} from '../controllers/shopController.js';


router.post('/', protect, createShop);
router.get('/', getAllShops);
router.get('/:id', getShopById);
router.put('/:id',protect, updateShop);
router.delete('/:id',protect, deleteShop);

export default router;