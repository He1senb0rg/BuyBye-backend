import { Router } from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    removeImage,
    updatePassword
} from "../controllers/userController.js";
const router = Router();

router.get("/", protect, getAllUsers);
router.get("/:id", protect, getUserById);
router.put("/:id", protect, updateUser);
router.delete("/:id", protect, deleteUser);
router.put("/:id/image", protect, removeImage);
router.put("/:id/password", protect, updatePassword);

export default router;