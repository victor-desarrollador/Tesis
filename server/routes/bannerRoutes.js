import express from "express";
import { getBanners, getBannerById, createBanner, updateBanner, deleteBanner } from "../controllers/bannerController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 *  /api/banners:
 *   get:
 *     summary: Get all banners
 *     tags: [Banners]
 *     responses:
 *       200:
 *         description: List of banners
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Banner'
 */

router.route("/").get(getBanners).post(protect, admin, createBanner);

/**
 * @swagger
 *  /api/banners/{id}:
 *   get:
 *     summary: Get banner by ID
 *     tags: [Banners]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Banner details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Banner'
 */

router.route("/:id")
.get(getBannerById)
.put(protect, admin, updateBanner)
.delete(protect, admin, deleteBanner);

export default router;
