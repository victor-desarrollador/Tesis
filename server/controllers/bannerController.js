import asyncHandler from "express-async-handler";
import Banner from "../models/bannerModel.js";
import { uploadImage, deleteImage } from "../services/uploadService.js";

// @desc    Get all banners
// @route   GET /api/banners
// @access  Private
const getBanners = asyncHandler(async (req, res) => {
    const banners = await Banner.find().sort({ createdAt: -1 });
    res.json(banners);
});

// @desc    Get banner by ID
// @route   GET /api/banners/:id
// @access  Private
const getBannerById = asyncHandler(async (req, res) => {
    const banner = await Banner.findById(req.params.id);

    if (banner) {
        res.json(banner);
    } else {
        res.status(404);
        throw new Error("Publicidad no encontrada");
    }
});

// @desc    Create a banner
// @route   POST /api/banners
// @access  Private/Admin
const createBanner = asyncHandler(async (req, res) => {
    const { name, title, startFrom, image, bannerType } = req.body;

    if (!name || !title || !startFrom || !bannerType) {
        res.status(400);
        throw new Error("Por favor complete todos los campos requeridos");
    }

    // Subir imagen a Cloudinary si es base64
    let imageUrl = "";
    let imagePublicId = "";

    if (image && image.startsWith("data:image")) {
        const uploadResult = await uploadImage(image, "banners");
        imageUrl = uploadResult.url;
        imagePublicId = uploadResult.publicId;
    }

    const banner = await Banner.create({
        name,
        title,
        startFrom,
        image: imageUrl ? { url: imageUrl, publicId: imagePublicId } : undefined,
        bannerType,
    });

    res.status(201).json(banner);
});

// @desc    Update a banner
// @route   PUT /api/banners/:id
// @access  Private/Admin
const updateBanner = asyncHandler(async (req, res) => {
    const { name, title, startFrom, image, bannerType } = req.body;

    const banner = await Banner.findById(req.params.id);

    if (!banner) {
        res.status(404);
        throw new Error("Publicidad no encontrada");
    }

    // Manejo de imagen
    let imageUrl = banner.image?.url || "";
    let imagePublicId = banner.image?.publicId || "";

    // 1. Si viene una nueva imagen base64
    if (image && image.startsWith("data:image")) {
        // Eliminar anterior si existe
        if (imagePublicId) {
            await deleteImage(imagePublicId);
        }
        // Subir nueva
        const uploadResult = await uploadImage(image, "banners");
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
        name: name || banner.name,
        title: title || banner.title,
        startFrom: startFrom || banner.startFrom,
        bannerType: bannerType || banner.bannerType,
        image: imageUrl ? { url: imageUrl, publicId: imagePublicId } : undefined,
    };

    const updatedBanner = await Banner.findByIdAndUpdate(
        req.params.id,
        updateData,
        {
            new: true,
            runValidators: true,
        }
    );

    res.json(updatedBanner);
});

// @desc    Delete a banner
// @route   DELETE /api/banners/:id
// @access  Private/Admin
const deleteBanner = asyncHandler(async (req, res) => {
    const banner = await Banner.findById(req.params.id);

    if (!banner) {
        res.status(404);
        throw new Error("Publicidad no encontrada");
    }

    // Eliminar imagen de Cloudinary si existe
    if (banner.image && banner.image.publicId) {
        await deleteImage(banner.image.publicId);
    }

    await banner.deleteOne();

    res.json({ message: "Publicidad eliminada" });
});

export { getBanners, getBannerById, createBanner, updateBanner, deleteBanner };

