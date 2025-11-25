import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";
import { 
  getUsers, 
  createUser, 
  getUserById, 
  updateUser, 
  deleteUser, 
  addAddress, 
  updateAddress, 
  deleteAddress 
} from "../controllers/userController.js";

const router = express.Router();

// /api/users/
router
  .route("/")
  .get(protect, admin, getUsers)
  .post(protect, admin, createUser);

// /api/users/:id
router
  .route("/:id")
  .get(protect, getUserById)
  .put(protect, updateUser)
  .delete(protect, admin, deleteUser);

// /api/users/:id/addresses
router
  .route("/:id/addresses")
  .post(protect, addAddress);

// /api/users/:id/addresses/:addressId
router
  .route("/:id/addresses/:addressId")
  .put(protect, updateAddress)
  .delete(protect, deleteAddress); // si querés admin, cambiar: admin, deleteAddress

export default router;
