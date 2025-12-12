import express from "express";
import {
    registerUser,
    loginUser,
    getUserProfile,
    logoutUser,
    verifyEmail,
    resendVerification,
    forgotPassword,
    resetPassword,
    validateResetToken
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import {
    registerValidation,
    loginValidation,
    forgotPasswordValidation,
    resetPasswordValidation,
    validate
} from "../validators/authValidator.js";


const router = express.Router();


router.post("/register", registerValidation, validate, registerUser);

//login router
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 role:
 *                   type: string
 *                 token:
 *                   type: string
 *       400:
 *         description: Invalid user credentials
 */
router.post("/login", loginValidation, validate, loginUser);

//profile
router.get("/profile", protect, getUserProfile);

// Email Verification
router.get("/verify-email/:token", verifyEmail);
router.post("/resend-verification", resendVerification);

// Password Recovery
router.post("/forgot-password", forgotPasswordValidation, validate, forgotPassword);
router.get("/reset-password/:token", validateResetToken);
router.post("/reset-password/:token", resetPasswordValidation, validate, resetPassword);

//logout

router.post("/logout", protect, logoutUser);


export default router;
