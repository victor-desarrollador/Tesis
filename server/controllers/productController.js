import asyncHandler from "express-async-handler";
import Product from "../models/productModel.js";
import Category from "../models/categoryModel.js";
import Brand from "../models/brandModel.js";

/**
 * @desc    Crear nuevo producto
 * @route   POST /api/products
 * @access  Private/Admin
 * 
 * Acepta tanto IDs de MongoDB como nombres para category y brand
 * Ejemplo con nombres: { "category": "Ropa de Bebé", "brand": "Huggies" }
 * Ejemplo con IDs: { "category": "67a1b2c3...", "brand": "67a1b2c3..." }
 */
const createProduct = asyncHandler(async (req, res) => {
    const {
        name,
        description,
        price,
        comparePrice,
        stock,
        images,
        category,
        brand,
        featured,
    } = req.body;

    // Validar campos requeridos
    if (!name || !description || !price || !category) {
        res.status(400);
        throw new Error("Nombre, descripción, precio y categoría son obligatorios");
    }

    // Verificar si el producto ya existe
    const productExists = await Product.findOne({ name });
    if (productExists) {
        res.status(400);
        throw new Error("Ya existe un producto con este nombre");
    }

    // Resolver categoría: puede ser ID o nombre
    let categoryId;

    // Intentar buscar por ID primero (validar formato ObjectId)
    if (category.match(/^[0-9a-fA-F]{24}$/)) {
        // Es un ObjectId válido
        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
            res.status(404);
            throw new Error("La categoría especificada no existe");
        }
        categoryId = category;
    } else {
        // Es un nombre, buscar por nombre
        const categoryByName = await Category.findOne({ name: category });
        if (!categoryByName) {
            res.status(404);
            throw new Error(
                `No se encontró una categoría con el nombre "${category}". Usa el ID de la categoría o crea la categoría primero.`
            );
        }
        categoryId = categoryByName._id;
    }

    // Resolver marca: puede ser ID o nombre (opcional)
    let brandId = null;
    if (brand) {
        if (brand.match(/^[0-9a-fA-F]{24}$/)) {
            // Es un ObjectId válido
            const brandExists = await Brand.findById(brand);
            if (!brandExists) {
                res.status(404);
                throw new Error("La marca especificada no existe");
            }
            brandId = brand;
        } else {
            // Es un nombre, buscar por nombre
            const brandByName = await Brand.findOne({ name: brand });
            if (!brandByName) {
                res.status(404);
                throw new Error(
                    `No se encontró una marca con el nombre "${brand}". Usa el ID de la marca o crea la marca primero.`
                );
            }
            brandId = brandByName._id;
        }
    }

    // Crear producto
    const product = await Product.create({
        name,
        description,
        price,
        comparePrice,
        stock: stock || 0,
        images: images || [],
        category: categoryId,
        brand: brandId,
        featured: featured || false,
    });

    // Poblar referencias para la respuesta
    await product.populate("category brand");

    res.status(201).json({
        success: true,
        message: "Producto creado exitosamente",
        data: product,
    });
});

/**
 * @desc    Obtener todos los productos con filtros, búsqueda y paginación
 * @route   GET /api/products
 * @access  Public
 */
const getProducts = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const filter = { isActive: true };

    if (req.query.search) {
        filter.$text = { $search: req.query.search };
    }

    if (req.query.category) {
        filter.category = req.query.category;
    }

    if (req.query.brand) {
        filter.brand = req.query.brand;
    }

    if (req.query.minPrice || req.query.maxPrice) {
        filter.price = {};
        if (req.query.minPrice) filter.price.$gte = parseFloat(req.query.minPrice);
        if (req.query.maxPrice) filter.price.$lte = parseFloat(req.query.maxPrice);
    }

    if (req.query.minRating) {
        filter.rating = { $gte: parseFloat(req.query.minRating) };
    }

    if (req.query.featured === "true") {
        filter.featured = true;
    }

    let sort = {};
    switch (req.query.sort) {
        case "price_asc":
            sort = { price: 1 };
            break;
        case "price_desc":
            sort = { price: -1 };
            break;
        case "rating":
            sort = { rating: -1 };
            break;
        case "newest":
            sort = { createdAt: -1 };
            break;
        case "popular":
            sort = { numReviews: -1 };
            break;
        default:
            sort = { createdAt: -1 };
    }

    const products = await Product.find(filter)
        .populate("category", "name slug")
        .populate("brand", "name slug")
        .sort(sort)
        .limit(limit)
        .skip(skip)
        .select("-reviews");

    const total = await Product.countDocuments(filter);

    res.json({
        success: true,
        data: products,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
        },
    });
});

/**
 * @desc    Obtener producto por ID
 * @route   GET /api/products/:id
 * @access  Public
 */
const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)
        .populate("category", "name slug description")
        .populate("brand", "name slug description")
        .populate("reviews.user", "name");

    if (!product) {
        res.status(404);
        throw new Error("Producto no encontrado");
    }

    res.json({
        success: true,
        data: product,
    });
});

/**
 * @desc    Obtener producto por slug
 * @route   GET /api/products/slug/:slug
 * @access  Public
 */
const getProductBySlug = asyncHandler(async (req, res) => {
    const product = await Product.findOne({ slug: req.params.slug })
        .populate("category", "name slug description")
        .populate("brand", "name slug description")
        .populate("reviews.user", "name");

    if (!product) {
        res.status(404);
        throw new Error("Producto no encontrado");
    }

    res.json({
        success: true,
        data: product,
    });
});

/**
 * @desc    Actualizar producto
 * @route   PUT /api/products/:id
 * @access  Private/Admin
 */
const updateProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        res.status(404);
        throw new Error("Producto no encontrado");
    }

    if (req.body.category && req.body.category !== product.category.toString()) {
        const categoryExists = await Category.findById(req.body.category);
        if (!categoryExists) {
            res.status(404);
            throw new Error("La categoría especificada no existe");
        }
    }

    if (req.body.brand && req.body.brand !== product.brand?.toString()) {
        const brandExists = await Brand.findById(req.body.brand);
        if (!brandExists) {
            res.status(404);
            throw new Error("La marca especificada no existe");
        }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,
            runValidators: true,
        }
    ).populate("category brand");

    res.json({
        success: true,
        message: "Producto actualizado exitosamente",
        data: updatedProduct,
    });
});

/**
 * @desc    Eliminar producto
 * @route   DELETE /api/products/:id
 * @access  Private/Admin
 */
const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        res.status(404);
        throw new Error("Producto no encontrado");
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({
        success: true,
        message: "Producto eliminado exitosamente",
    });
});

/**
 * @desc    Crear reseña de producto
 * @route   POST /api/products/:id/reviews
 * @access  Private
 */
const createProductReview = asyncHandler(async (req, res) => {
    const { rating, comment } = req.body;

    if (!rating || !comment) {
        res.status(400);
        throw new Error("Rating y comentario son obligatorios");
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
        res.status(404);
        throw new Error("Producto no encontrado");
    }

    const alreadyReviewed = product.reviews.find(
        (review) => review.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
        res.status(400);
        throw new Error("Ya has dejado una reseña para este producto");
    }

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment,
    };

    product.reviews.push(review);
    await product.save();

    res.status(201).json({
        success: true,
        message: "Reseña agregada exitosamente",
    });
});

/**
 * @desc    Obtener productos destacados
 * @route   GET /api/products/featured
 * @access  Public
 */
const getFeaturedProducts = asyncHandler(async (req, res) => {
    const limit = parseInt(req.query.limit) || 8;

    const products = await Product.find({ featured: true, isActive: true })
        .populate("category", "name slug")
        .populate("brand", "name slug")
        .sort({ rating: -1 })
        .limit(limit)
        .select("-reviews");

    res.json({
        success: true,
        data: products,
    });
});

/**
 * @desc    Actualizar stock del producto
 * @route   PATCH /api/products/:id/stock
 * @access  Private/Admin
 */
const updateProductStock = asyncHandler(async (req, res) => {
    const { stock } = req.body;

    if (stock === undefined || stock < 0) {
        res.status(400);
        throw new Error("Stock debe ser un número mayor o igual a 0");
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
        res.status(404);
        throw new Error("Producto no encontrado");
    }

    product.stock = stock;
    await product.save();

    res.json({
        success: true,
        message: "Stock actualizado exitosamente",
        data: { stock: product.stock },
    });
});

export {
    createProduct,
    getProducts,
    getProductById,
    getProductBySlug,
    updateProduct,
    deleteProduct,
    createProductReview,
    getFeaturedProducts,
    updateProductStock,
};