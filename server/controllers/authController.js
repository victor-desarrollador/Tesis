import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";

// registrar usuario
const registerUser =  asyncHandler (async (req, res) => {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne ({ email });
    if (userExists) {
        res.status(400);
        throw new Error ("El usuario ya existe, Inicia sesion");
    }

    const user = await User.create ({
        name,
        email,
        password,
        role,
        addersses: [],
    });

    if (user) {
        res.status(201).json ({
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            role: user.role,
            addresses: user.addresses,
        });

    } else {
        res.status(400);
        throw new Error ("Datos de usuario invalidos");
    }
});

// login usuario
const loginUser = asyncHandler (async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne ({ email });
    if (user && (await user.matchPassword (password))) {
        res.status(200).json ({
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            role: user.role,
            addresses: user.addresses || [],
            token: generateToken (user._id),
        });
    } else {
        res.status(400);
        throw new Error ("Datos de invalidos");
    }
});

export { registerUser, loginUser };