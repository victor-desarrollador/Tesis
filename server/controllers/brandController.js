import asyncHandler from "express-async-handler";
import Brand from "../models/brandModel.js";
import { uploadImage, deleteImage } from "../services/uploadService.js";

// @desc    Get all brands
// @route   GET /api/brands
// @access  Public
const getBrands = asyncHandler(async (req, res) => {
    const brands = await Brand.find().sort({ createdAt: -1 });
    res.json(brands);
});

// @desc    Get single brand
// @route   GET /api/brands/:id
// @access  Public
const getBrandById = asyncHandler(async (req, res) => {
    const brand = await Brand.findById(req.params.id);

    if (!brand) {
        res.status(404);
        throw new Error("Marca no encontrada");
    }

    res.json(brand);
});

// @desc    Create a brand
// @route   POST /api/brands
// @access  Private/Admin
const createBrand = asyncHandler(async (req, res) => {
    const { name, image } = req.body;

    if (!name) {
        res.status(400);
        throw new Error("El nombre es obligatorio");
    }

    const brandExists = await Brand.findOne({ name });

    if (brandExists) {
        res.status(400);
        throw new Error("La marca ya existe");
    }

    // Subir imagen a Cloudinary si es base64
    let imageUrl = "";
    let imagePublicId = "";

    if (image && image.startsWith("data:image")) {
        const uploadResult = await uploadImage(image, "brands");
        imageUrl = uploadResult.url;
        imagePublicId = uploadResult.publicId;
    }

    const brand = await Brand.create({
        name,
        image: imageUrl ? { url: imageUrl, publicId: imagePublicId } : undefined,
    });

    res.status(201).json(brand);
});

// @desc    Update brand
// @route   PUT /api/brands/:id
// @access  Private/Admin
const updateBrand = asyncHandler(async (req, res) => {
    const { name, image } = req.body;

    const brand = await Brand.findById(req.params.id);

    if (!brand) {
        res.status(404);
        throw new Error("Marca no encontrada");
    }

    // Manejo de imagen
    let imageUrl = brand.image?.url || "";
    let imagePublicId = brand.image?.publicId || "";

    // 1. Si viene una nueva imagen base64
    if (image && image.startsWith("data:image")) {
        // Eliminar anterior si existe
        if (imagePublicId) {
            await deleteImage(imagePublicId);
        }
        // Subir nueva
        const uploadResult = await uploadImage(image, "brands");
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

    const updateData = {
        name: name || brand.name,
        image: imageUrl ? { url: imageUrl, publicId: imagePublicId } : undefined,
    };

    const updatedBrand = await Brand.findByIdAndUpdate(
        req.params.id,
        updateData,
        {
            new: true,
            runValidators: true,
        }
    );

    res.json(updatedBrand);
});

// @desc    Delete brand
// @route   DELETE /api/brands/:id
// @access  Private/Admin
const deleteBrand = asyncHandler(async (req, res) => {
    const brand = await Brand.findById(req.params.id);

    if (!brand) {
        res.status(404);
        throw new Error("Marca no encontrada");
    }

    // Eliminar imagen de Cloudinary si existe
    if (brand.image && brand.image.publicId) {
        await deleteImage(brand.image.publicId);
    }

    await brand.deleteOne();

    res.json({ message: "Marca eliminada correctamente" });
});

export {
    getBrands,
    getBrandById,
    createBrand,
    updateBrand,
    deleteBrand,
};