import asyncHandler from "express-async-handler";
import Category from "../models/categoryModel.js";
import { uploadImage, deleteImage } from "../services/uploadService.js";

/**
 * @desc    Obtener todas las categorías
 * @route   GET /api/categories
 * @access  Public
 * Soporta paginación y filtros opcionales
 */
const getCategories = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 20;
    const skip = (page - 1) * perPage;

    // Filtro opcional por categoría padre
    const filter = {};
    if (req.query.parent) {
        filter.parent = req.query.parent;
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
    const { name, description, image, parent } = req.body;

    if (!name) {
        res.status(400);
        throw new Error("El nombre es obligatorio");
    }

    // Verificar si ya existe
    const categoryExists = await Category.findOne({ name });
    if (categoryExists) {
        res.status(400);
        throw new Error("Ya existe una categoría con este nombre");
    }

    // Subir imagen a Cloudinary si es base64
    let imageUrl = "";
    let imagePublicId = "";

    if (image && image.startsWith("data:image")) {
        const uploadResult = await uploadImage(image, "categories");
        imageUrl = uploadResult.url;
        imagePublicId = uploadResult.publicId;
    }

    const category = await Category.create({
        name,
        description: description || "",
        // Usar la estructura { url, publicId } requerida por el modelo, o string vacío si no hay
        image: imageUrl ? { url: imageUrl, publicId: imagePublicId } : undefined,
        parent: parent && parent !== "" ? parent : null,
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

    const { name, description, image, parent } = req.body;

    // Manejo de imagen
    let imageUrl = category.image?.url || "";
    let imagePublicId = category.image?.publicId || "";

    // 1. Si viene una nueva imagen base64
    if (image && image.startsWith("data:image")) {
        // Eliminar anterior si existe
        if (imagePublicId) {
            await deleteImage(imagePublicId);
        }
        // Subir nueva
        const uploadResult = await uploadImage(image, "categories");
        imageUrl = uploadResult.url;
        imagePublicId = uploadResult.publicId;
    }
    // 2. Si image es un string vacío (usuario eliminó la imagen)
    else if (image === "" && imagePublicId) {
        await deleteImage(imagePublicId);
        imageUrl = "";
        imagePublicId = "";
    }
    // 3. Si image es la URL que ya tenía, no hacer nada

    // Construir objeto de actualización
    const updateData = {
        name: name || category.name,
        description: description !== undefined ? description : category.description,
        parent: parent === "" ? null : (parent !== undefined ? parent : category.parent),
        image: imageUrl ? { url: imageUrl, publicId: imagePublicId } : undefined,
    };

    // Si imageUrl está vacío, podemos querer undefined o null en el modelo segun definición
    // Mongoose setea undefined si no pasamos nada y no es required.
    // Si image era opcional en el modelo, esto funcionará.

    const updatedCategory = await Category.findByIdAndUpdate(
        req.params.id,
        updateData,
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

    // Eliminar imagen de Cloudinary si existe
    if (category.image && category.image.publicId) {
        await deleteImage(category.image.publicId);
    }

    await Category.findByIdAndDelete(req.params.id);

    res.json({
        success: true,
        message: "Categoría eliminada exitosamente",
    });
});

export {
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
};