import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";

// get users
const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}).select("-password");
    res.status(200).json({
        success: true,
        users
    });
});

// createUser
const createUser = asyncHandler(async (req, res) => {
    const { name, email, password, roles, addresses } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error("El usuario ya existe");
    }

    const user = await User.create({
        name,
        email,
        password,
        roles,
        addresses: addresses || []
    });

    if (user) {
        //initialize emty cart
        // await Cart.create ({ user : user._id, Items : [] });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            roles: user.roles,
            addresses: user.addresses

        });

    } else {
        res.status(400);
        throw new Error("Datos de usuario inválidos");
    }

});

//getUserById
const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select("-password");
    
    if (user) {
        res.json(user);
    } else {
        res.status(404);
        throw new Error("Usuario no encontrado");
    }
});

//updateUser
const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        res.status(404);
        throw new Error("Usuario no encontrado");   
    }
    //allow update by user themselves or admin
    user.name = req.body.name || user.name;

    if(req.body.password){
        user.password = req.body.password;
    }

    if(req.user.role){
        user.role = req.body.role;
    }

    user.addresses = req.body.addresses || user.addresses;

    // avatar 
    const updatedUser = await user.save();
    
    res.json(200).json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
        roles: updatedUser.roles,
        addresses: updatedUser.addresses
    });
});

//deleteUser
const deleteUser = asyncHandler(async (req, res) => {

});

export { getUsers, createUser, getUserById, updateUser };