import mongoose from "mongoose";
import bcrypt from "bcryptjs";

/**
 * Schema de Dirección
 * Permite múltiples direcciones de envío por usuario
 */
const addressSchema = mongoose.Schema({
  street: { type: String, required: true, trim: true },
  city: { type: String, required: true, trim: true },
  state: { type: String, trim: true },
  zipCode: { type: String, trim: true },
  country: { type: String, required: true, trim: true },
  isDefault: { type: Boolean, default: false },
});

/**
 * Schema de Item del Carrito
 * Carrito embebido en el usuario para simplicidad
 */
const cartItemSchema = mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
});

/**
 * Schema Principal de Usuario
 * Incluye: autenticación, direcciones, carrito y wishlist
 */
const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    password: { type: String, required: true, minlength: 8 },
    role: {
      type: String,
      enum: ["cliente", "admin", "deliveryman"],
      default: "cliente",
    },
    // Avatar del usuario (base64 o URL)
    avatar: { type: String, default: "" },
    // Múltiples direcciones de envío
    addresses: [addressSchema],
    phone: { type: String },

    // Carrito embebido (más simple que modelo separado)
    cart: [cartItemSchema],

    // Wishlist embebida
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],

    // Verificación y recuperación de contraseña
    isVerified: { type: Boolean, default: false },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  { timestamps: true }
);

/**
 * Método: Comparar contraseña
 * @param {string} enteredPassword - Contraseña ingresada por el usuario
 * @returns {Promise<boolean>} - True si coincide
 */
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

/**
 * Middleware Pre-Save: Encriptar contraseña
 * Solo encripta si la contraseña fue modificada
 */
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/**
 * Índices para optimizar búsquedas
 */
userSchema.index({ email: 1 });

const User = mongoose.model("User", userSchema);

export default User;