import mongoose from "mongoose";

/**
 * Schema de Categorías
 * Soporta categorías jerárquicas (parent-child) y gestión de imágenes
 */
const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre de la categoría es obligatorio'],
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
    image: {
      url: {
        type: String,
        default: '',
      },
      publicId: {
        type: String,
        default: '',
      },
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      default: null, // null = categoría raíz
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    categoryType: {
      type: String,
      enum: ['Featured', 'Hot categories', 'Top categories', 'Discount'],
      default: 'Top categories',
    },
  },
  { timestamps: true }
);

/**
 * Middleware Pre-Save: Generación automática de slug
 * Convierte el nombre en un slug URL-friendly
 */
categorySchema.pre('save', function (next) {
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
categorySchema.index({ name: 'text' });
categorySchema.index({ slug: 1 });
categorySchema.index({ parent: 1 });
categorySchema.index({ isActive: 1 });

const Category = mongoose.model('Category', categorySchema);

export default Category;
