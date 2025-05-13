// routes/cartRoutes.js
import express from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  updateCartItemStatus,
  clearCart
} from "../controllers/cartController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Apply protection to all routes
router.use(protect);

router.get("/", getCart);
router.post("/add", addToCart);
router.put("/update/:productId", updateCartItem);
router.delete("/remove/:productId", removeFromCart);
router.put("/item/:productId/status", updateCartItemStatus);
router.delete("/", clearCart); // <-- Clear entire cart

export default router;