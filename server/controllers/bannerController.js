import asyncHandler from "express-async-handler";
import Banner from "../models/bannerModel.js";
import cloudinary from "../config/cloudinary.js";

// @desc    Get all banners
// @route   GET /api/banners
// @access  Private
const getBanners = asyncHandler(async (req, res) => {
    const banners = await Banner.find();
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
    const {name, title, startFrom, image, bannerType } = req.body;

    //const bannerExists = await Banner.findOne({ name });
    //if (bannerExists) {
        //res.status(400);
        //throw new Error("Publicidad ya existe");
    //}

    let imageUrl;
    if (image) {
        imageUrl = await cloudinary.v2.uploader.upload(image, {
            folder: "admin-panel-de-control/banners",
        });
        imageUrl = imageUrl.secure_url;
    }

    const banner = await new Banner({
        name,
        title,
        startFrom,
        image : imageUrl || undefined,
        bannerType,
    });

    const createdBanner = await banner.save();
    if (createdBanner) {
        res.status(201).json(createdBanner);
    } else {
        res.status(400);
        throw new Error("Publicidad no creada");
    }
});

// @desc    Update a banner
// @route   PUT /api/banners/:id
// @access  Private/Admin

const updateBanner = asyncHandler(async (req, res) => {
    const {name, title, startFrom, image, bannerType } = req.body;

    const banner = await Banner.findById(req.params.id);

    if (banner) {
        banner.name = name || banner.name;
        banner.title = title || banner.title;
        banner.startFrom = startFrom || banner.startFrom;
        banner.bannerType = bannerType || banner.bannerType;

    try {
        if (image !== undefined) {
           if (image) {
            const result = await cloudinary.uploader.upload(image,{
                folder: "admin-panel-de-control/banners",
            });
            banner.image = result.secure_url;
           }else{
            banner.image = undefined; // imagen clara de una cadena vacía
           }
        }
        const updatedBanner = await banner.save();
        res.json(updatedBanner);

    } catch (error) {
        if (error.name === "ValidationError") {
            const errors = Object.values(error.errors).map((error) => error.message);
            res.status(400);
            throw new Error(errors.join(", "));
        }
        res.status(500);
        throw new Error("Error al actualizar la publicidad");
    }
    }else{
        res.status(404);
        throw new Error("Publicidad no encontrada");
    }
});

// @desc    Delete a banner
// @route   DELETE /api/banners/:id
// @access  Private/Admin
const deleteBanner = asyncHandler(async (req, res) => {
    const banner = await Banner.findById(req.params.id);

    if (banner) {
        await banner.deleteOne();
        res.json({ message: "Publicidad eliminada" });
    } else {
        res.status(404);
        throw new Error("Publicidad no encontrada");
    }
});

export { getBanners, getBannerById, createBanner, updateBanner, deleteBanner };

