import { Router } from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    changeUserRole,
} from "../controllers/userController.js";
const router = Router();

router.get("/", protect, getAllUsers);
router.get("/:id", protect, getUserById);
router.put("/:id", protect, updateUser);
router.delete("/:id", protect, deleteUser);
router.put("/:id/role", protect, changeUserRole);

export default router;