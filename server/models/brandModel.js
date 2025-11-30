import mongoose from "mongoose";

/**
 * Schema de Marcas
 * Gestión de marcas de productos con soporte para logos en Cloudinary
 */
const brandSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre de la marca es obligatorio'],
      unique: true,
      trim: true,
      maxlength: [100, 'El nombre no puede exceder 100 caracteres'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'La descripción no puede exceder 500 caracteres'],
    },
    logo: {
      url: {
        type: String,
        default: '',
      },
      publicId: {
        type: String,
        default: '',
      },
    },
    image: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Middleware Pre-Save: Generación automática de slug
 * Convierte el nombre en un slug URL-friendly
 */
brandSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

/**
 * Índices para búsquedas optimizadas
 */
brandSchema.index({ name: 'text' });
brandSchema.index({ slug: 1 });
brandSchema.index({ isActive: 1 });

const Brand = mongoose.model('Brand', brandSchema);

export default Brand;
