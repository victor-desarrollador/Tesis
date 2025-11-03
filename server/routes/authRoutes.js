import exprees from "express";
import { registerUser, loginUser } from "../controllers/authController.js";

const router = exprees.Router();

// register route

router.post("/register", registerUser);

// login route
router.post("/login", loginUser);


export default router;