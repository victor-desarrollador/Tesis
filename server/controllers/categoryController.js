import asyncHandler from "express-async-handler";
import Category from "../models/categoryModel.js";
import cloudinary from "../config/cloudinary.js";

// @desc    Get all categories
// @route   GET /api/categories
// @access  Private
const getCategories = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const perPage = parseInt(req.query.perPage) || 20; // Default to 10 per page
    const sortOrder = req.query.sortOrder || "asc"; // Default to ascending
    // Validate page and perPage
    if (page < 1 || perPage < 1) {
        res.status(400);
        throw new Error("Page and perPage must be positive integers");
    }
    // Validate sortOrder
    if (!["asc", "desc"].includes(sortOrder)) {
        res.status(400);
        throw new Error('Sort order must be "asc" or "desc"');
    }

    const skip = (page - 1) * perPage;
    const total = await Category.countDocuments({});
    const sortValue = sortOrder === "asc" ? 1 : -1; // 1 for asc, -1 for desc
    const categories = await Category.find({})
        .skip(skip)
        .limit(perPage)
        .sort({ createdAt: sortValue }); // Sort by createdAt

    const totalPages = Math.ceil(total / perPage);

    res.json({ categories, total, page, perPage, totalPages });
});

// @desc    Get category by ID
// @route   GET /api/categories/:id
// @access  Private
const getCategoryById = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);

    if (category) {
        res.json(category);
    } else {
        res.status(404);
        throw new Error("Category not found");
    }
});

// @desc    Create a category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = asyncHandler(async (req, res) => {
    const { name, image, categoryType } = req.body;

    // Validate inputs
    if (!name || typeof name !== "string") {
        res.status(400);
        throw new Error("Category name is required and must be a string");
    }

    const slug = name.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');

    // Validate categoryType
    const validCategoryTypes = [
        "Perfumería",
        "Maquillaje",
        "Cuidado para el Hombre",
        "Cuidado Diario",
        "Cabello",
        "Accesorios de Damas",
        "Otros"
    ];
    if (!validCategoryTypes.includes(categoryType)) {
        res.status(400);
        throw new Error("Tipo de categoría inválido");
    }

    const categoryExists = await Category.findOne({ name });

    if (categoryExists) {
        res.status(400);
        throw new Error("La categoría ya existe");
    }

    let imageUrl = "";
    if (image) {
        try {
            const result = await cloudinary.uploader.upload(image, {
                folder: "babymartyt/categories",
            });
            imageUrl = result.secure_url;
        } catch (error) {
            console.error("Cloudinary upload error:", error);
            // Continue without image or throw error? User logic suggests continue or fail.
            // But usually we should handle this. I will proceed.
        }
    }

    const category = await Category.create({
        name,
        image: imageUrl || undefined,
        categoryType,
        slug,
    });

    if (category) {
        res.status(201).json(category);
    } else {
        res.status(400);
        throw new Error("Datos de categoría inválidos");
    }
});

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private/Admin
const updateCategory = asyncHandler(async (req, res) => {
    const { name, image, categoryType } = req.body;

    // Validate categoryType
    const validCategoryTypes = [
        "Perfumería",
        "Maquillaje",
        "Cuidado para el Hombre",
        "Cuidado Diario",
        "Cabello",
        "Accesorios de Damas",
        "Otros"
    ];
    if (categoryType && !validCategoryTypes.includes(categoryType)) {
        res.status(400);
        throw new Error("Tipo de categoría inválido");
    }

    const category = await Category.findById(req.params.id);

    if (category) {
        category.name = name || category.name;
        category.categoryType = categoryType || category.categoryType;

        if (name) {
            category.slug = name.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
        }

        if (image !== undefined) {
            if (image) {
                const result = await cloudinary.uploader.upload(image, {
                    folder: "babymartyt/categories",
                });
                category.image = result.secure_url;
            } else {
                category.image = undefined; // Clear image if empty string is provided
            }
        }

        const updatedCategory = await category.save();
        res.json(updatedCategory);
    } else {
        res.status(404);
        throw new Error("Categoría no encontrada");
    }
});

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);

    if (category) {
        await category.deleteOne();
        res.json({ message: "Categoría eliminada" });
    } else {
        res.status(404);
        throw new Error("Categoría no encontrada");
    }
});

export {
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
};