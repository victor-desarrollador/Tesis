import asyncHandler from "express-async-handler";
import Category from "../models/categoryModel.js";

/**
 * @desc    Obtener todas las categorías
 * @route   GET /api/categories
 * @access  Public
 * 
 * Soporta paginación y filtros opcionales
 */
const getAllCategories = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 20;
    const skip = (page - 1) * perPage;

    // Filtro opcional por tipo de categoría
    const filter = {};
    if (req.query.categoryType) {
        filter.categoryType = req.query.categoryType;
    }

    // Ordenamiento
    const sortOrder = req.query.sortOrder === "desc" ? -1 : 1;

    const categories = await Category.find(filter)
        .sort({ name: sortOrder })
        .limit(perPage)
        .skip(skip);

    const total = await Category.countDocuments(filter);

    res.json({
        success: true,
        categories,
        pagination: {
            total,
            page,
            perPage,
            totalPages: Math.ceil(total / perPage),
            hasNextPage: page < Math.ceil(total / perPage),
            hasPrevPage: page > 1,
        },
    });
});

/**
 * @desc    Obtener categoría por ID
 * @route   GET /api/categories/:id
 * @access  Public
 */
const getCategoryById = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);

    if (!category) {
        res.status(404);
        throw new Error("Categoría no encontrada");
    }

    res.json({
        success: true,
        data: category,
    });
});

/**
 * @desc    Crear nueva categoría
 * @route   POST /api/categories
 * @access  Private/Admin
 */
const createCategory = asyncHandler(async (req, res) => {
    const { name, image, categoryType } = req.body;

    if (!name || !categoryType) {
        res.status(400);
        throw new Error("Nombre y tipo de categoría son obligatorios");
    }

    // Verificar si ya existe
    const categoryExists = await Category.findOne({ name });
    if (categoryExists) {
        res.status(400);
        throw new Error("Ya existe una categoría con este nombre");
    }

    const category = await Category.create({
        name,
        image: image || "",
        categoryType,
    });

    res.status(201).json({
        success: true,
        message: "Categoría creada exitosamente",
        data: category,
    });
});

/**
 * @desc    Actualizar categoría
 * @route   PUT /api/categories/:id
 * @access  Private/Admin
 */
const updateCategory = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);

    if (!category) {
        res.status(404);
        throw new Error("Categoría no encontrada");
    }

    const updatedCategory = await Category.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,
            runValidators: true,
        }
    );

    res.json({
        success: true,
        message: "Categoría actualizada exitosamente",
        data: updatedCategory,
    });
});

/**
 * @desc    Eliminar categoría
 * @route   DELETE /api/categories/:id
 * @access  Private/Admin
 */
const deleteCategory = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);

    if (!category) {
        res.status(404);
        throw new Error("Categoría no encontrada");
    }

    await Category.findByIdAndDelete(req.params.id);

    res.json({
        success: true,
        message: "Categoría eliminada exitosamente",
    });
});

export {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
};