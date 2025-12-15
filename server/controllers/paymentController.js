import { MercadoPagoConfig, Preference, Payment } from "mercadopago";
import asyncHandler from "express-async-handler";
import Order from "../models/orderModel.js";

/**
 * Inicializar cliente de Mercado Pago
 * Documentación: https://www.mercadopago.com.ar/developers/es/docs
 */
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || "",
  options: {
    timeout: 5000,
  },
});

const preference = new Preference(client);
const payment = new Payment(client);

/**
 * @desc    Crear preferencia de pago de Mercado Pago
 * @route   POST /api/payments/create-preference
 * @access  Private
 * 
 * Crea una preferencia de pago y retorna el init_point para redirigir al usuario
 * al Checkout Pro de Mercado Pago
 */
export const createPaymentPreference = asyncHandler(async (req, res) => {
  try {
    console.log("💳 Creando preferencia de pago Mercado Pago");
    const { orderId } = req.body;

    // Validar que se envió el orderId
    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID es requerido",
      });
    }

    // Buscar la orden
    const order = await Order.findById(orderId).populate("items.productId");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Orden no encontrada",
      });
    }

    // Verificar que el usuario sea dueño de la orden
    if (!order.userId.equals(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: "No autorizado para pagar esta orden",
      });
    }

    // Verificar que la orden no esté ya pagada
    if (order.status === "paid" || order.paidAt) {
      return res.status(400).json({
        success: false,
        message: "Esta orden ya ha sido pagada",
      });
    }

    // Construir items para Mercado Pago
    const items = order.items.map((item) => ({
      id: item.productId?._id?.toString() || "product",
      title: item.name || "Producto",
      description: `Producto de L&V Tienda`,
      picture_url: item.image || "",
      category_id: "baby_products",
      quantity: item.quantity,
      unit_price: Number(item.price),
      currency_id: "ARS", // Pesos argentinos
    }));

    // URL Base del cliente (con fallback seguro)
    // URL Base del cliente (con fallback seguro)
    const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";
    console.log("🔗 URL base para redirección:", clientUrl);

    // Crear preferencia de pago
    const preferenceData = {
      items: items,
      payer: {
        name: req.user.name,
        email: req.user.email,
      },
      back_urls: {
        success: `${clientUrl}/success`,
        failure: `${clientUrl}/failure`,
        pending: `${clientUrl}/pending`,
      },
      // auto_return: "approved", // User request: disable auto_return to allow manual return flow
      external_reference: orderId.toString(),
      statement_descriptor: "L&V TIENDA BEBE",
      metadata: {
        order_id: orderId.toString(),
        user_id: req.user._id.toString(),
        user_email: req.user.email,
      },
      payment_methods: {
        excluded_payment_methods: [],
        excluded_payment_types: [],
        installments: 12,
      },
    };

    console.log("📦 Payload DETALLADO enviado a Mercado Pago:", JSON.stringify(preferenceData, null, 2));

    // Explicitly check back_urls
    if (!preferenceData.back_urls || !preferenceData.back_urls.success) {
      console.error("❌ CRÍTICO: back_urls.success no está definido antes de enviar");
    }

    const response = await preference.create({ body: preferenceData });

    console.log("✅ Preferencia creada:", response.id);

    // Guardar el preference_id en la orden para referencia
    order.paymentIntentId = response.id;
    await order.save();

    res.status(200).json({
      success: true,
      preferenceId: response.id,
      initPoint: response.init_point, // URL para redirigir al checkout
      sandboxInitPoint: response.sandbox_init_point, // URL para testing
      message: "Preferencia de pago creada exitosamente",
    });
  } catch (error) {
    console.error("❌ Error creando preferencia:", error);
    // Log detailed error from Mercado Pago if available
    if (error.cause) {
      console.error("Mercado Pago Error Cause:", JSON.stringify(error.cause, null, 2));
    }

    res.status(500).json({
      success: false,
      message: error.message || "Error al crear preferencia de pago",
      error_detail: error.cause || error.message // Sending detail to client for debugging
    });
  }
});

/**
 * @desc    Obtener información de un pago
 * @route   GET /api/payments/:paymentId
 * @access  Private
 */
export const getPaymentInfo = asyncHandler(async (req, res) => {
  try {
    const { paymentId } = req.params;

    const paymentInfo = await payment.get({ id: paymentId });

    res.json({
      success: true,
      payment: paymentInfo,
    });
  } catch (error) {
    console.error("❌ Error obteniendo info de pago:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error al obtener información del pago",
    });
  }
});

/**
 * @desc    Webhook de Mercado Pago
 * @route   POST /api/payments/webhook
 * @access  Public (Mercado Pago webhook)
 * 
 * Mercado Pago enviará notificaciones a este endpoint cuando cambie el estado de un pago
 * Documentación: https://www.mercadopago.com.ar/developers/es/docs/your-integrations/notifications/webhooks
 */
export const handleMercadoPagoWebhook = asyncHandler(async (req, res) => {
  try {
    console.log("🎣 Webhook de Mercado Pago recibido");
    console.log("📋 Headers:", req.headers);
    console.log("📋 Body:", req.body);
    console.log("📋 Query:", req.query);

    // Mercado Pago envía la notificación en query params
    const { type, data } = req.query;

    // Responder inmediatamente a Mercado Pago (importante)
    res.status(200).send("OK");

    // Procesar la notificación de forma asíncrona
    if (type === "payment") {
      const paymentId = data.id;
      console.log(`💳 Procesando pago: ${paymentId}`);

      try {
        // Obtener información del pago
        const paymentInfo = await payment.get({ id: paymentId });
        console.log("📋 Info del pago:", JSON.stringify(paymentInfo, null, 2));

        const orderId = paymentInfo.external_reference || paymentInfo.metadata?.order_id;

        if (!orderId) {
          console.error("❌ No se encontró order_id en el pago");
          return;
        }

        // Buscar la orden
        const order = await Order.findById(orderId);

        if (!order) {
          console.error(`❌ Orden no encontrada: ${orderId}`);
          return;
        }

        // Actualizar orden según el estado del pago
        switch (paymentInfo.status) {
          case "approved":
            console.log(`✅ Pago aprobado para orden: ${orderId}`);
            order.status = "paid";
            order.paidAt = new Date();
            order.paymentIntentId = paymentId.toString();
            order.stripeSessionId = paymentInfo.id.toString();
            await order.save();
            console.log(`✅ Orden actualizada a 'paid': ${orderId}`);
            break;

          case "pending":
            console.log(`⏳ Pago pendiente para orden: ${orderId}`);
            order.status = "pending";
            await order.save();
            break;

          case "in_process":
            console.log(`🔄 Pago en proceso para orden: ${orderId}`);
            order.status = "pending";
            await order.save();
            break;

          case "rejected":
            console.log(`❌ Pago rechazado para orden: ${orderId}`);
            order.status = "cancelled";
            await order.save();
            break;

          case "cancelled":
            console.log(`🚫 Pago cancelado para orden: ${orderId}`);
            order.status = "cancelled";
            await order.save();
            break;

          default:
            console.log(`ℹ️ Estado de pago no manejado: ${paymentInfo.status}`);
        }
      } catch (error) {
        console.error("❌ Error procesando webhook de pago:", error);
      }
    } else {
      console.log(`ℹ️ Tipo de notificación no manejado: ${type}`);
    }
  } catch (error) {
    console.error("❌ Error en webhook:", error);
    // Aún así respondemos OK para que Mercado Pago no reintente
    if (!res.headersSent) {
      res.status(200).send("OK");
    }
  }
});

/**
 * @desc    Verificar estado de pago manualmente
 * @route   POST /api/payments/verify
 * @access  Private
 * 
 * Permite al usuario verificar manualmente el estado de su pago
 * Útil si el webhook falla o para debugging
 */
export const verifyPaymentStatus = asyncHandler(async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID es requerido",
      });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Orden no encontrada",
      });
    }

    // Verificar que el usuario sea dueño de la orden o sea admin
    if (!order.userId.equals(req.user._id) && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "No autorizado para verificar esta orden",
      });
    }

    // Si la orden ya está pagada, retornar el estado
    if (order.status === "paid") {
      return res.json({
        success: true,
        status: "paid",
        message: "La orden ya está pagada",
        order: order,
      });
    }

    // Si hay un paymentIntentId, buscar el pago en Mercado Pago
    if (order.paymentIntentId) {
      try {
        const paymentInfo = await payment.get({ id: order.paymentIntentId });

        // Actualizar orden si el estado cambió
        if (paymentInfo.status === "approved" && order.status !== "paid") {
          order.status = "paid";
          order.paidAt = new Date();
          await order.save();
        }

        return res.json({
          success: true,
          status: paymentInfo.status,
          paymentInfo: paymentInfo,
          order: order,
        });
      } catch (error) {
        console.error("Error obteniendo info de pago:", error);
      }
    }

    res.json({
      success: true,
      status: order.status,
      message: "Estado actual de la orden",
      order: order,
    });
  } catch (error) {
    console.error("❌ Error verificando estado:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error al verificar estado del pago",
    });
  }
});
