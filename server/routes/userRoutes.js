import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";
import { getUsers } from "../controllers/userController.js";

const router = express.Router();

// route
router.route("/").get(protect, admin,getUsers);

// /:id route

// /_id/addresses

// /_id/addresses/:addressId

export default router;