import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createPaymentPreference,
  getPaymentInfo,
  handleMercadoPagoWebhook,
  verifyPaymentStatus,
} from "../controllers/paymentController.js";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     PaymentPreference:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         preferenceId:
 *           type: string
 *         initPoint:
 *           type: string
 *         sandboxInitPoint:
 *           type: string
 *         message:
 *           type: string
 */

/**
 * @swagger
 * /api/payments/create-preference:
 *   post:
 *     summary: Crear preferencia de pago de Mercado Pago
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderId
 *             properties:
 *               orderId:
 *                 type: string
 *                 description: ID de la orden a pagar
 *     responses:
 *       200:
 *         description: Preferencia creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaymentPreference'
 *       400:
 *         description: Solicitud inválida - orden ya pagada o datos faltantes
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No autorizado para pagar esta orden
 *       404:
 *         description: Orden no encontrada
 *       500:
 *         description: Error del servidor
 */
router.post("/create-preference", protect, createPaymentPreference);

/**
 * @swagger
 * /api/payments/{paymentId}:
 *   get:
 *     summary: Obtener información de un pago
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: paymentId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del pago en Mercado Pago
 *     responses:
 *       200:
 *         description: Información del pago obtenida
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.get("/:paymentId", protect, getPaymentInfo);

/**
 * @swagger
 * /api/payments/verify:
 *   post:
 *     summary: Verificar estado de pago manualmente
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderId
 *             properties:
 *               orderId:
 *                 type: string
 *                 description: ID de la orden
 *     responses:
 *       200:
 *         description: Estado verificado
 *       400:
 *         description: Solicitud inválida
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No autorizado para verificar esta orden
 *       404:
 *         description: Orden no encontrada
 *       500:
 *         description: Error del servidor
 */
router.post("/verify", protect, verifyPaymentStatus);

/**
 * @swagger
 * /api/payments/webhook:
 *   post:
 *     summary: Webhook de Mercado Pago
 *     tags: [Payments]
 *     description: Endpoint para notificaciones de Mercado Pago sobre cambios en el estado de pagos
 *     responses:
 *       200:
 *         description: Webhook procesado exitosamente
 */
router.post("/webhook", handleMercadoPagoWebhook);

export default router;
