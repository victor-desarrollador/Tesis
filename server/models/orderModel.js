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

    // Dirección de envío
    shippingAddress: {
      street: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: String,
      zipCode: String,
      country: {
        type: String,
        required: true,
      },
      postalCode: {
        type: String,
        required: true,
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
 * Formato: ORD-YYYYMMDD-XXX
 */
orderSchema.pre('save', async function (next) {
  if (!this.orderNumber) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    // Contar órdenes del día
    const count = await mongoose.model('Order').countDocuments({
      createdAt: {
        $gte: new Date(year, date.getMonth(), day),
        $lt: new Date(year, date.getMonth(), day + 1),
      },
    });

    this.orderNumber = `ORD-${year}${month}${day}-${String(count + 1).padStart(3, '0')}`;
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
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });

export default mongoose.model("Order", orderSchema);
