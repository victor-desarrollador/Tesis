import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";
import {
    createProduct,
    getProducts,
    getProductById,
    getProductBySlug,
    updateProduct,
    deleteProduct,
    createProductReview,
    getFeaturedProducts,
    updateProductStock,
} from "../controllers/productController.js";

const router = express.Router();

/**
 * @route   GET /api/products
 * @desc    Obtener todos los productos (con filtros, búsqueda, paginación)
 * @access  Public
 * 
 * @route   POST /api/products
 * @desc    Crear nuevo producto
 * @access  Private/Admin
 */
router.route("/").get(getProducts).post(protect, admin, createProduct);

/**
 * @route   GET /api/products/featured
 * @desc    Obtener productos destacados
 * @access  Public
 */
router.route("/featured").get(getFeaturedProducts);

/**
 * @route   GET /api/products/slug/:slug
 * @desc    Obtener producto por slug
 * @access  Public
 */
router.route("/slug/:slug").get(getProductBySlug);

/**
 * @route   GET /api/products/:id
 * @desc    Obtener producto por ID
 * @access  Public
 * 
 * @route   PUT /api/products/:id
 * @desc    Actualizar producto
 * @access  Private/Admin
 * 
 * @route   DELETE /api/products/:id
 * @desc    Eliminar producto
 * @access  Private/Admin
 */
router
    .route("/:id")
    .get(getProductById)
    .put(protect, admin, updateProduct)
    .delete(protect, admin, deleteProduct);

/**
 * @route   POST /api/products/:id/reviews
 * @desc    Crear reseña de producto
 * @access  Private
 */
router.route("/:id/reviews").post(protect, createProductReview);

/**
 * @route   PATCH /api/products/:id/stock
 * @desc    Actualizar stock del producto
 * @access  Private/Admin
 */
router.route("/:id/stock").patch(protect, admin, updateProductStock);

export default router;