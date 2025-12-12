import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";
import { uploadImage } from "../services/uploadService.js";
import { sendVerificationEmail, sendPasswordResetEmail, sendPasswordChangedEmail } from "../services/emailService.js";
import { generateRandomToken, hashToken } from "../utils/tokenUtils.js";

// registrar usuario
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, role, avatar } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error("El usuario ya existe, Inicia sesion");
    }

    // Generar token de verificación
    const { token, hashedToken } = generateRandomToken();
    const verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 horas

    // Subir avatar a Cloudinary si se proporciona
    let avatarUrl = "";
    let avatarPublicId = "";

    if (avatar && avatar.startsWith("data:image")) {
        const uploadResult = await uploadImage(avatar, "avatars");
        avatarUrl = uploadResult.url;
        avatarPublicId = uploadResult.publicId;
    }

    const user = await User.create({
        name,
        email,
        password,
        role,
        avatar: avatarUrl,
        avatarPublicId: avatarPublicId,
        addresses: [],
        verificationToken: hashedToken,
        verificationTokenExpires
    });

    if (user) {
        // Enviar email de verificación
        try {
            await sendVerificationEmail(user, token);
        } catch (error) {
            console.error("Error enviando email de verificación:", error);
            // No fallamos el registro, pero el usuario deberá reenviar el email
        }

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            role: user.role,
            addresses: user.addresses,
            isVerified: false,
            message: "Usuario registrado. Por favor verifica tu email."
        });
    } else {
        res.status(400);
        throw new Error("Datos de usuario invalidos");
    }
});

// login usuario
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        // Verificar si el email está confirmado
        if (!user.isVerified) {
            res.status(401);
            throw new Error("Por favor verifica tu email antes de iniciar sesión");
        }

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            role: user.role,
            addresses: user.addresses || [],
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error("Contraseña o email incorrectos");
    }
});

// Verificar Email
const verifyEmail = asyncHandler(async (req, res) => {
    const { token } = req.params;
    const hashedToken = hashToken(token);

    const user = await User.findOne({
        verificationToken: hashedToken,
        verificationTokenExpires: { $gt: Date.now() }
    });

    if (!user) {
        res.status(400);
        throw new Error("Token inválido o expirado");
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    res.status(200).json({
        success: true,
        message: "Email verificado correctamente. Ya puedes iniciar sesión."
    });
});

// Reenviar verificación
const resendVerification = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        res.status(404);
        throw new Error("Usuario no encontrado");
    }

    if (user.isVerified) {
        res.status(400);
        throw new Error("Esta cuenta ya ha sido verificada");
    }

    const { token, hashedToken } = generateRandomToken();
    user.verificationToken = hashedToken;
    user.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();

    await sendVerificationEmail(user, token);

    res.status(200).json({
        success: true,
        message: "Email de verificación reenviado"
    });
});

// Solicitar recuperación de contraseña
const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        res.status(404);
        throw new Error("No existe una cuenta con este email");
    }

    const { token, hashedToken } = generateRandomToken();
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hora
    await user.save();

    await sendPasswordResetEmail(user, token);

    res.status(200).json({
        success: true,
        message: "Te hemos enviado un email con instrucciones"
    });
});

// Validar token de reset (GET)
const validateResetToken = asyncHandler(async (req, res) => {
    const { token } = req.params;
    const hashedToken = hashToken(token);

    const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
        res.status(400);
        throw new Error("Token inválido o expirado");
    }

    res.status(200).json({
        success: true,
        message: "Token válido"
    });
});

// Restablecer contraseña (POST)
const resetPassword = asyncHandler(async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
    const hashedToken = hashToken(token);

    const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
        res.status(400);
        throw new Error("Token inválido o expirado");
    }

    user.password = password; // El middleware pre-save hasheará esto
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    await sendPasswordChangedEmail(user);

    res.status(200).json({
        success: true,
        message: "Contraseña actualizada correctamente"
    });
});

// getUserProfile
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            role: user.role,
            addresses: user.addresses || [],
        });
    } else {
        console.error("Error al obtener el usuario:", req.user?._id);
        res.status(404);
        throw new Error("Usuario no encontrado");
    }
});

// Logout user
const logoutUser = asyncHandler(async (req, res) => {
    res.status(200).json({
        success: true,
        message: "Usuario desconectado exitosamente",
    });
});

export {
    registerUser,
    loginUser,
    getUserProfile,
    logoutUser,
    verifyEmail,
    resendVerification,
    forgotPassword,
    resetPassword,
    validateResetToken
};