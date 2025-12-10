import mongoose from "mongoose";

/**
 * Schema de Reseñas de Productos
 * Permite a los usuarios dejar comentarios y calificaciones
 * Incluye verificación de compra para mayor confiabilidad
 */
const reviewSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
    verified: {
      type: Boolean,
      default: false, // Indica si el usuario compró el producto
    },
  },
  { timestamps: true }
);

/**
 * Schema Principal de Productos
 * Modelo completo para gestión de productos de e-commerce
 * Incluye: imágenes, categorías, marcas, stock, precios, reseñas
 */
const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre del producto es obligatorio"],
      unique: true,
      trim: true,
      maxlength: [200, "El nombre no puede exceder 200 caracteres"],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "La descripción es obligatoria"],
      minlength: [10, "La descripción debe tener al menos 10 caracteres"],
    },
    shortDescription: {
      type: String,
      trim: true,
      maxlength: [200, "La descripción breve no puede exceder 200 caracteres"],
    },
    price: {
      type: Number,
      required: [true, "El precio es obligatorio"],
      min: [0, "El precio no puede ser negativo"],
    },
    comparePrice: {
      type: Number,
      min: [0, "El precio de comparación no puede ser negativo"],
    },
    stock: {
      type: Number,
      required: true,
      min: [0, "El stock no puede ser negativo"],
      default: 0,
    },
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        publicId: {
          type: String,
          required: true,
        },
      },
    ],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "La categoría es obligatoria"],
    },
    subcategory: {
      type: String,
      trim: true,
      // ej: "Labiales", "Fragancias Femeninas", "Carteras de Mano"
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
    },
    /**
     * Tipo de producto específico para belleza y accesorios
     * Permite filtros especializados en el frontend
     */
    productType: {
      type: String,
      enum: [
        "perfume-hombre",
        "perfume-mujer",
        "perfume-unisex",
        "maquillaje-rostro",
        "maquillaje-ojos",
        "maquillaje-labios",
        "cuidado-piel",
        "cuidado-cabello",
        "cartera",
        "accesorio-reloj",
        "accesorio-aros",
        "accesorio-otro",
      ],
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    reviews: [reviewSchema],
    isActive: {
      type: Boolean,
      default: true,
    },
    /**
     * Sistema de Variantes
     * Permite productos con opciones (tonos de labial, tamaños, fragancias)
     */
    variants: [
      {
        name: {
          type: String,
          required: true,
          // ej: "Tono", "Tamaño", "Fragancia"
        },
        options: [
          {
            type: String,
            // ej: ["Rojo 01", "Rosado 02", "Nude 03"]
          },
        ],
        stock: {
          type: Number,
          default: 0,
          min: 0,
        },
        price: {
          type: Number,
          min: 0,
          // Precio adicional para esta variante (opcional)
        },
        sku: {
          type: String,
          unique: true,
          sparse: true, // Permite múltiples nulls
        },
      },
    ],
    /**
     * Especificaciones Técnicas
     * Información detallada del producto según su tipo
     */
    specifications: {
      volume: {
        type: String,
        // ej: "100ml", "50g", "30ml"
      },
      ingredients: [
        {
          type: String,
          // Ingredientes principales
        },
      ],
      skinType: [
        {
          type: String,
          enum: ["seca", "grasa", "mixta", "normal", "sensible"],
          // Para quién está recomendado
        },
      ],
      scent: {
        type: String,
        // Notas de fragancia para perfumes
        // ej: "Amaderado Acuático", "Floral Dulce"
      },
      color: {
        type: String,
        // Color para maquillaje
      },
      material: {
        type: String,
        // Material para carteras/accesorios
        // ej: "Cuero", "Sintético", "Tela"
      },
      size: {
        type: String,
        // Dimensiones para accesorios
        // ej: "20x15x5cm"
      },
    },
    featured: {
      type: Boolean,
      default: false,
    },
    /**
     * Flags de Marketing
     * Para destacar productos en el catálogo
     */
    newArrival: {
      type: Boolean,
      default: false,
      // Producto nuevo en el catálogo
    },
    bestSeller: {
      type: Boolean,
      default: false,
      // Producto más vendido
    },
    /**
     * Tags para SEO y Filtros
     * Permite búsqueda y filtrado avanzado
     */
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
        // ej: ["hidratante", "anti-edad", "natural", "vegano"]
      },
    ],
    /**
     * Metadata SEO
     * Optimización para motores de búsqueda
     */
    metaTitle: {
      type: String,
      trim: true,
      maxlength: [60, "Meta title no puede exceder 60 caracteres"],
    },
    metaDescription: {
      type: String,
      trim: true,
      maxlength: [160, "Meta description no puede exceder 160 caracteres"],
    },
  },
  { timestamps: true }
);

/**
 * Middleware Pre-Save: Generación automática de slug
 * Convierte el nombre del producto en un slug URL-friendly
 */
productSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = this.name
      .toLowerCase()
      .replaceAll(/[^a-z0-9]+/g, "-")
      .replaceAll(/(^-|-$)/g, "");
  }
  next();
});

/**
 * Middleware Pre-Save: Cálculo automático de rating promedio
 * Actualiza el rating y número de reseñas basado en las reviews
 */
productSchema.pre("save", function (next) {
  if (this.reviews && this.reviews.length > 0) {
    const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    this.rating = sum / this.reviews.length;
    this.numReviews = this.reviews.length;
  } else {
    this.rating = 0;
    this.numReviews = 0;
  }
  next();
});

/**
 * Índices para optimizar búsquedas
 */
productSchema.index({ name: "text", description: "text", shortDescription: "text" });
productSchema.index({ category: 1 });
productSchema.index({ subcategory: 1 });
productSchema.index({ brand: 1 });
productSchema.index({ productType: 1 });
productSchema.index({ price: 1 });
productSchema.index({ rating: -1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ featured: 1, isActive: 1 });
productSchema.index({ newArrival: 1, isActive: 1 });
productSchema.index({ bestSeller: 1, isActive: 1 });
productSchema.index({ tags: 1 });

const Product = mongoose.model("Product", productSchema);

export default Product;
