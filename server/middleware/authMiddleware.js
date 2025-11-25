import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");

      return next();
    } catch (error) {
      console.error("Token error:", error);
      res.status(401);
      throw new Error("No autorizado, token inválido o expirado");
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
  } else {
    res.status(403);
    throw new Error("No autorizado como administrador");
  }
};

export { protect, admin };
