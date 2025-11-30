import express from "express";
import { getBanners, getBannerById, createBanner, updateBanner, deleteBanner } from "../controllers/bannerController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Banner:
 *       type: object
 *       required:
 *         - title
 *         - image
 *       properties:
 *         _id:
 *           type: string
 *           description: ID del banner
 *         title:
 *           type: string
 *           description: Título del banner
 *         subtitle:
 *           type: string
 *           description: Subtítulo del banner
 *         image:
 *           type: string
 *           description: URL de la imagen del banner
 *         link:
 *           type: string
 *           description: URL de destino al hacer clic
 *         isActive:
 *           type: boolean
 *           description: Si el banner está activo
 *         order:
 *           type: number
 *           description: Orden de visualización
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/banners:
 *   get:
 *     summary: Obtener todos los banners
 *     tags: [Banners]
 *     responses:
 *       200:
 *         description: Lista de banners
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 banners:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Banner'
 *       500:
 *         description: Error del servidor
 *   post:
 *     summary: Crear un nuevo banner
 *     tags: [Banners]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - image
 *             properties:
 *               title:
 *                 type: string
 *                 description: Título del banner
 *                 example: "Promoción de Verano"
 *               subtitle:
 *                 type: string
 *                 description: Subtítulo del banner
 *                 example: "Hasta 50% de descuento"
 *               image:
 *                 type: string
 *                 description: URL de la imagen
 *                 example: "https://res.cloudinary.com/..."
 *               link:
 *                 type: string
 *                 description: URL de destino
 *                 example: "/productos/promociones"
 *               isActive:
 *                 type: boolean
 *                 description: Si el banner está activo
 *                 default: true
 *               order:
 *                 type: number
 *                 description: Orden de visualización
 *                 default: 0
 *     responses:
 *       201:
 *         description: Banner creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 banner:
 *                   $ref: '#/components/schemas/Banner'
 *                 message:
 *                   type: string
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Requiere permisos de administrador
 */

router.route("/").get(getBanners).post(protect, admin, createBanner);

/**
 * @swagger
 * /api/banners/{id}:
 *   get:
 *     summary: Obtener banner por ID
 *     tags: [Banners]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del banner
 *     responses:
 *       200:
 *         description: Detalles del banner
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 banner:
 *                   $ref: '#/components/schemas/Banner'
 *       404:
 *         description: Banner no encontrado
 *       500:
 *         description: Error del servidor
 *   put:
 *     summary: Actualizar un banner
 *     tags: [Banners]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del banner a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Título del banner
 *               subtitle:
 *                 type: string
 *                 description: Subtítulo del banner
 *               image:
 *                 type: string
 *                 description: URL de la imagen
 *               link:
 *                 type: string
 *                 description: URL de destino
 *               isActive:
 *                 type: boolean
 *                 description: Si el banner está activo
 *               order:
 *                 type: number
 *                 description: Orden de visualización
 *     responses:
 *       200:
 *         description: Banner actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 banner:
 *                   $ref: '#/components/schemas/Banner'
 *                 message:
 *                   type: string
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Requiere permisos de administrador
 *       404:
 *         description: Banner no encontrado
 *   delete:
 *     summary: Eliminar un banner
 *     tags: [Banners]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del banner a eliminar
 *     responses:
 *       200:
 *         description: Banner eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Requiere permisos de administrador
 *       404:
 *         description: Banner no encontrado
 */

router.route("/:id")
    .get(getBannerById)
    .put(protect, admin, updateBanner)
    .delete(protect, admin, deleteBanner);

export default router;
