import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        res.status(401);
        throw new Error("Usuario no encontrado");
      }

      return next();
    } catch (error) {
      console.error("Token error:", error);

      if (error.name === "TokenExpiredError") {
        res.status(401);
        throw new Error("Token expirado. Por favor inicia sesión nuevamente.");
      }

      res.status(401);
      throw new Error("Token inválido");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("No autorizado, no hay token");
  }
});

const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }

  res.status(403);
  throw new Error("No autorizado como administrador");
};

export { protect, admin };