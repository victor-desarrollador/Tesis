import asyncHandler from "express-async-handler";
import Product from "../models/productModel.js";


//create product

const createProduct = asyncHandler(async (req, res) => {
    const { name, description, price, category,brand, image, discountPercentage, stock } = req.body;

// Check if product with same name exists
const productExists = await Product.findOne({ name });

if (productExists) {
    res.status(400);
    throw new Error("El producto con este nombre ya existe");
}


//upload image to cloudinary    
const product = await Product.create({
    name,
    description,
    price,
    category,
    brand,
    discountPercentage:discountPercentage || 0,
    stock:stock || 0,
    image:"",
});

if(product){
    res.status(201).json(product);
}else{
    res.status(400);
    throw new Error("Error al crear el producto");
}   
});

export {createProduct};