import mongoose from "mongoose";

/**
 * Schema de Item de Orden
 * Guarda snapshot del producto al momento de la compra
 */
const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  image: {
    type: String,
  },
});

/**
 * Schema Principal de Orden
 * Gestión completa del ciclo de vida de pedidos
 */
const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [orderItemSchema],

    // Método de entrega
    deliveryMethod: {
      type: String,
      enum: ['shipping', 'pickup'],
      default: 'shipping',
    },

    // Dirección de envío (Obligatorio si deliveryMethod es 'shipping', opcional si es 'pickup')
    shippingAddress: {
      street: {
        type: String,
        // required: true, // Manejado en validator/controller
      },
      city: {
        type: String,
        // required: true,
      },
      state: String,
      zipCode: String,
      country: {
        type: String,
        // required: true,
      },
      postalCode: {
        type: String,
        // required: true,
      },
      phone: String,
    },

    // Método de pago
    paymentMethod: {
      type: String,
      enum: ['efectivo', 'tarjeta', 'transferencia', 'mercadopago'],
      default: 'mercadopago',
    },

    // Información de pago (Mercado Pago)
    paymentIntentId: {
      type: String,
    },
    stripeSessionId: {
      type: String,
    },
    paymentResult: {
      id: String,
      status: String,
      update_time: String,
      email_address: String,
    },

    // Precios
    subtotal: {
      type: Number,
      default: 0,
    },
    taxPrice: {
      type: Number,
      default: 0,
    },
    shippingPrice: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      default: 0,
    },
    totalPrice: {
      type: Number,
      default: 0,
    },

    // Estados
    status: {
      type: String,
      enum: ['pending', 'paid', 'processing', 'completed', 'cancelled'],
      default: 'pending',
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    isDelivered: {
      type: Boolean,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },

    // Historial de cambios de estado
    statusHistory: [
      {
        status: String,
        timestamp: {
          type: Date,
          default: Date.now,
        },
        note: String,
      },
    ],
  },
  { timestamps: true }
);

/**
 * Middleware Pre-Save: Generar número de orden único
 * Formato: LV-YYYY-NNNNN (según especificaciones de tesis)
 * Ejemplo: LV-2024-00001, LV-2024-00002, etc.
 */
orderSchema.pre('save', async function (next) {
  if (!this.orderNumber) {
    const year = new Date().getFullYear();

    // Find the last order of the current year (based on orderNumber pattern)
    // This is safer than counting documents because it accounts for deletions.
    const lastOrder = await mongoose.model('Order').findOne({
      orderNumber: { $regex: `^LV-${year}-` }
    }).sort({ orderNumber: -1 });

    let nextSequence = 1;
    if (lastOrder && lastOrder.orderNumber) {
      const parts = lastOrder.orderNumber.split('-');
      const lastSequence = parseInt(parts[2], 10);
      if (!isNaN(lastSequence)) {
        nextSequence = lastSequence + 1;
      }
    }

    // Format: LV-2024-00001 (5 digits with leading zeros)
    this.orderNumber = `LV-${year}-${String(nextSequence).padStart(5, '0')}`;
  }
  next();
});

/**
 * Middleware Pre-Save: Registrar cambios de estado
 */
orderSchema.pre('save', function (next) {
  if (this.isModified('status') && !this.isNew) {
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date(),
    });
  }
  next();
});

/**
 * Middleware Pre-Save: Calcular total si no está definido
 */
orderSchema.pre('save', function (next) {
  if (!this.total && !this.totalPrice) {
    this.total = this.subtotal + this.taxPrice + this.shippingPrice;
    this.totalPrice = this.total;
  }
  next();
});

/**
 * Índices para optimizar consultas
 */
orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });

export default mongoose.model("Order", orderSchema);
