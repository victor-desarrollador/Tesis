import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";

// =========================
// GET ALL USERS
// =========================
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select("-password");
  res.status(200).json({
    success: true,
    users,
  });
});

// =========================
// CREATE USER (ADMIN ONLY)
// =========================
const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, addresses } = req.body;

  // validar email duplicado
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("El usuario ya existe");
  }

  // crear usuario
  const user = await User.create({
    name,
    email,
    password,
    role,
    addresses: addresses || [],
  });

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    role: user.role,
    addresses: user.addresses,
  });
});

// =========================
// GET USER BY ID
// =========================
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (!user) {
    res.status(404);
    throw new Error("Usuario no encontrado");
  }

  res.json(user);
});

// =========================
// UPDATE USER
// =========================
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("Usuario no encontrado");
  }

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;

  // Si manda password nueva, se encripta en el pre-save del modelo
  if (req.body.password) {
    user.password = req.body.password;
  }

  // Solo admin puede cambiar roles
  if (req.body.role && req.user.role === "admin") {
    user.role = req.body.role;
  }

  if (req.body.addresses) {
    user.addresses = req.body.addresses;
  }

  const updatedUser = await user.save();

  res.status(200).json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    avatar: updatedUser.avatar,
    role: updatedUser.role,
    addresses: updatedUser.addresses,
  });
});

// =========================
// DELETE USER
// =========================
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("Usuario no encontrado");
  }

  await user.deleteOne();

  res.json({
    success: true,
    message: "Usuario eliminado exitosamente",
  });
});

// =========================
// ADD ADDRESS
// =========================
const addAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("Usuario no encontrado");
  }

  // El dueño o admin
  if (req.user._id.toString() !== user._id.toString() && req.user.role !== "admin") {
    res.status(403);
    throw new Error("No autorizado para modificar direcciones");
  }

  const { street, city, country, postalCode, phone, isDefault } = req.body;

  if (!street || !city || !country || !postalCode) {
    res.status(400);
    throw new Error("Todos los campos son obligatorios");
  }

  // Si la nueva es default, quitar default a las demás
  if (isDefault) {
    user.addresses.forEach(addr => (addr.isDefault = false));
  }

  user.addresses.push({
    street,
    city,
    country,
    postalCode,
    isDefault: isDefault || user.addresses.length === 0 ? true : false,
  });

  await user.save();

  res.json({
    success: true,
    addresses: user.addresses,
    message: "Dirección agregada exitosamente",
  });
});

// =========================
// UPDATE ADDRESS
// =========================
const updateAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("Usuario no encontrado");
  }

  // Dueño o admin
  if (req.user._id.toString() !== user._id.toString() && req.user.role !== "admin") {
    res.status(403);
    throw new Error("No autorizado para modificar direcciones");
  }

  const address = user.addresses.id(req.params.addressId);

  if (!address) {
    res.status(404);
    throw new Error("Dirección no encontrada");
  }

  const { street, city, country, postalCode, isDefault } = req.body;

  if (street) address.street = street;
  if (city) address.city = city;
  if (country) address.country = country;
  if (postalCode) address.postalCode = postalCode;

  if (isDefault) {
    user.addresses.forEach(addr => (addr.isDefault = false));
    address.isDefault = true;
  }

  await user.save();

  res.json({
    success: true,
    addresses: user.addresses,
    message: "Dirección actualizada exitosamente",
  });
});

// =========================
// DELETE ADDRESS
// =========================
const deleteAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("Usuario no encontrado");
  }

  if (req.user._id.toString() !== user._id.toString() && req.user.role !== "admin") {
    res.status(403);
    throw new Error("No autorizado para modificar direcciones");
  }

  const address = user.addresses.id(req.params.addressId);

  if (!address) {
    res.status(404);
    throw new Error("Dirección no encontrada");
  }

  const wasDefault = address.isDefault;

  user.addresses.pull(req.params.addressId);

  if (wasDefault && user.addresses.length > 0) {
    user.addresses[0].isDefault = true;
  }

  await user.save();

  res.json({
    success: true,
    addresses: user.addresses,
    message: "Dirección eliminada exitosamente",
  });
});

export {
  getUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  addAddress,
  updateAddress,
  deleteAddress,
};
