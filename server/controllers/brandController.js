import asyncHandler from "../middleware/asyncHandler.js";
import Brand from "../models/brandModel.js";
import cloudinary from "../utils/cloudinary.js";

// @desc    Get all brands
// @route   GET /api/brands
// @access  Public
const getBrands = asyncHandler(async (req, res) => {
    const brands = await Brand.find();
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

    let imageUrl = "";

    if (image) {
        const result = await cloudinary.uploader.upload(image, {
            folder: "admin/panel-de-control/marcas",
        });
        imageUrl = result.secure_url;
    }

    const brand = await Brand.create({
        name,
        image: imageUrl || "",
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

    // Si envían nombre, actualizarlo
    if (name) {
        brand.name = name;
    }

    // Si envían imagen, subirla a Cloudinary
    if (image) {
        const result = await cloudinary.uploader.upload(image, {
            folder: "admin/panel-de-control/marcas",
        });
        brand.image = result.secure_url;
    }

    const updatedBrand = await brand.save();

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


