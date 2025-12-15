import asyncHandler from "express-async-handler";
import Product from "../models/productModel.js";
import Category from "../models/categoryModel.js";
import Brand from "../models/brandModel.js";
import { uploadImage, deleteImage } from "../services/uploadService.js";

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

    // Procesar imágenes con Cloudinary
    let processedImages = [];
    if (images && Array.isArray(images)) {
        for (const img of images) {
            // Si es base64, subir a Cloudinary
            if (img.url && img.url.startsWith("data:image")) {
                const uploadResult = await uploadImage(img.url, "products");
                processedImages.push({
                    url: uploadResult.url,
                    publicId: uploadResult.publicId,
                });
            } else {
                // Si ya es una URL válida o no es base64, se mantiene (ej. si viniera de otro lado)
                // Pero aseguramos que tenga la estructura correcta si es posible
                if (img.url) {
                    processedImages.push(img);
                }
            }
        }
    }

    // Crear producto
    const product = await Product.create({
        name,
        description,
        price,
        comparePrice,
        stock: stock || 0,
        images: processedImages,
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
    const limit = parseInt(req.query.limit || req.query.perPage) || 12; // Soportar ambos
    const skip = (page - 1) * limit;

    const filter = {}; // Remover filtro isActive por defecto

    console.log("DEBUG: Parameters received:", req.query);

    // Enhanced Search: Includes Text, Category (Name/Type), and Brand lookup
    if (req.query.search) {
        const searchRegex = new RegExp(req.query.search, 'i');

        // Find matching Brands
        const matchingBrands = await Brand.find({ name: searchRegex }).select('_id');
        const brandIds = matchingBrands.map(b => b._id);

        // Find matching Categories (Name or Type)
        const matchingCategories = await Category.find({
            $or: [
                { name: searchRegex },
                { categoryType: searchRegex }
            ]
        }).select('_id');
        const categoryIds = matchingCategories.map(c => c._id);

        filter.$or = [
            { name: searchRegex },
            { description: searchRegex },
            { brand: { $in: brandIds } },
            { category: { $in: categoryIds } }
        ];
    }

    // Smart Category Filter (ID or Name/Type) - Handled previously, keeping logic but ensuring clean flow
    if (req.query.category && !filter.$or) { // Only apply specific category filter if not searching globally OR combine? 
        // Logic generally combines. If user searches "Red" AND selects "Lipstick", we want both.
        // But the previous search logic above uses $or for the search term itself.
        // Let's keep specific category filter as an AND condition if present.
        // Note: The previous step inserted logic for req.query.category. We must ensure we don't overwrite it or conflict.

        // Re-inserting the logic I just added in the previous turn to ensure it stays:
        if (req.query.category.match(/^[0-9a-fA-F]{24}$/)) {
            filter.category = req.query.category;
        } else {
            const categories = await Category.find({
                $or: [
                    { name: { $regex: req.query.category, $options: "i" } },
                    { categoryType: { $regex: req.query.category, $options: "i" } }
                ]
            });
            const categoryIds = categories.map(c => c._id);
            // If we found categories, filter by them. If not, it might return empty, handled by the query returning 0.
            if (categoryIds.length > 0) {
                filter.category = { $in: categoryIds };
            } else {
                // Force empty result if strict category filter finds nothing
                // But wait, if we are just building 'filter', we can set a dummy ID
                filter.category = "000000000000000000000000";
            }
        }
    }

    // Smart Brand Filter (ID or Name)
    if (req.query.brand) {
        if (req.query.brand.match(/^[0-9a-fA-F]{24}$/)) {
            filter.brand = req.query.brand;
        } else {
            const brand = await Brand.findOne({ name: { $regex: req.query.brand, $options: "i" } });
            if (brand) {
                filter.brand = brand._id;
            } else {
                filter.brand = "000000000000000000000000"; // Force empty if brand name not found
            }
        }
    }

    // Flexible Price Filter (minPrice/maxPrice OR priceMin/priceMax)
    const minPrice = req.query.minPrice || req.query.priceMin;
    const maxPrice = req.query.maxPrice || req.query.priceMax;

    if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = parseFloat(minPrice);
        if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    if (req.query.minRating) {
        filter.rating = { $gte: parseFloat(req.query.minRating) };
    }

    if (req.query.featured === "true") {
        filter.featured = true;
    }

    if (req.query.bestSeller === "true") {
        filter.bestSeller = true;
    }

    if (req.query.newArrival === "true") {
        filter.newArrival = true;
    }

    let sort = {};
    const sortParam = req.query.sort || req.query.sortOrder;

    switch (sortParam) {
        case "price_asc":
        case "asc":
            sort = { price: 1 };
            break;
        case "price_desc":
        case "desc":
            sort = { createdAt: -1 };
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

    console.log("DEBUG: Final Mongo Filter:", JSON.stringify(filter, null, 2));

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

    // Gestionar imágenes
    let finalImages = [];
    if (req.body.images && Array.isArray(req.body.images)) {
        // Iterar sobre las nuevas imágenes solicitadas
        for (const img of req.body.images) {
            // Caso 1: Imagen base64 nueva -> Subir a Cloudinary
            if (img.url && img.url.startsWith("data:image")) {
                const uploadResult = await uploadImage(img.url, "products");
                finalImages.push({
                    url: uploadResult.url,
                    publicId: uploadResult.publicId,
                });
            }
            // Caso 2: URL existente (http/s)
            else if (img.url && img.url.startsWith("http")) {
                // Verificar si esta imagen ya existía en el producto para preservar su publicId
                const existingImage = product.images.find(
                    (pImg) => pImg.url === img.url
                );

                if (existingImage) {
                    finalImages.push(existingImage); // Mantiene publicId original
                } else {
                    // Si es una URL externa nueva (no común con Cloudinary Flow, pero posible)
                    // Se agrega tal cual
                    finalImages.push(img);
                }
            }
        }

        // Eliminar imágenes antiguas que ya no están en finalImages
        // SOLO si tienen publicId (están en Cloudinary)
        if (product.images && product.images.length > 0) {
            for (const oldImg of product.images) {
                if (oldImg.publicId) {
                    const stillExists = finalImages.find(
                        (newImg) => newImg.publicId === oldImg.publicId
                    );
                    if (!stillExists) {
                        await deleteImage(oldImg.publicId);
                    }
                }
            }
        }

        // Actualizar el array de imagenes en el body para que findByIdAndUpdate lo use
        req.body.images = finalImages;
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

    // Eliminar imágenes de Cloudinary asociadas
    if (product.images && product.images.length > 0) {
        for (const img of product.images) {
            if (img.publicId) {
                await deleteImage(img.publicId);
            }
        }
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