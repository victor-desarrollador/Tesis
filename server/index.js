import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import connectDB from "./config/db.js";
import swaggerUi from "swagger-ui-express";
import { specs } from "./config/swagger.js";
import { errorHandler } from "./middleware/errorMiddleware.js";

// Import routes
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import brandRoutes from "./routes/brandRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import bannerRoutes from "./routes/bannerRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";




// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();
const PORT = process.env.PORT || 8000;

// Enhanced CORS configuration
// Usar Set para mejor performance en búsquedas
const allowedOrigins = new Set([
  process.env.CLIENT_URL,
  process.env.ADMIN_URL,
  "http://localhost:3000",
  "http://localhost:5173",
  "http://localhost:8081",
  "http://10.0.2.2:8081",
  "http://10.0.2.2:8080"
].filter(Boolean)); // Filtrar valores undefined/null

app.use(
  cors({
    origin: function (origin, callback) {
      // ✅ Permitir requests sin origin (mobile apps, Postman, etc)
      if (!origin) return callback(null, true);

      if (process.env.NODE_ENV === "development") {
        return callback(null, true);
      }

      if (allowedOrigins.has(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Body parser middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// 🔒 SECURITY: Helmet para protección de headers HTTP
// Protege contra XSS, clickjacking, y otros ataques comunes
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: [
          "'self'",
          "https://res.cloudinary.com",
          "data:",
          "https:",
        ],
        scriptSrc: ["'self'", "'unsafe-inline'"], // Swagger necesita unsafe-inline
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        connectSrc: ["'self'"],
      },
    },
    crossOriginEmbedderPolicy: false, // Necesario para Swagger UI
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// 🛡️ RATE LIMITING: Protección contra ataques de fuerza bruta y DDoS
// Limitar intentos de autenticación (más estricto)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // 5 intentos por IP en 15 minutos
  message: {
    success: false,
    message: "Demasiados intentos de login. Por favor intenta nuevamente en 15 minutos.",
  },
  standardHeaders: true, // Retorna rate limit info en headers `RateLimit-*`
  legacyHeaders: false, // No retorna `X-RateLimit-*` headers
  skipSuccessfulRequests: false, // Contar todos los requests, incluso exitosos
});

// Rate limiting general para todas las rutas API
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 1000, // 1000 requests por IP en 15 minutos (aumentado para desarrollo)
  message: {
    success: false,
    message: "Demasiadas peticiones desde esta IP. Por favor intenta más tarde.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Aplicar rate limiting a rutas de autenticación
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);

// Aplicar rate limiting general a todas las rutas API
app.use("/api/", apiLimiter);

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/banners", bannerRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/payments", paymentRoutes);


// Swagger Documentation
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, {
    explorer: true,
    customCss: `.swagger-ui .topbar { display: none }`,
    customSiteTitle: "L&V Tienda E-commerce API Documentation",
  })
);

// Home route
app.get("/", (req, res) => {
  const projectInfo = {
    name: "L&V tienda E-commerce API",
    version: "1.0.0",
    description: "Backend API server for L&V Tienda e-commerce platform",
    status: "Running",
    environment: process.env.NODE_ENV || "development",
    port: PORT,
    endpoints: {
      documentation: `/api-docs`,
      health: `/health`,
      api: `/api`,
    },
    features: [
      "🔐 JWT Authentication",
      "📦 Product Management",
      "🛍️ Order Processing",
      "👥 User Management",
      "☁️ Cloudinary Integration",
      "📊 MongoDB Database",
      "📖 Swagger Documentation",
    ],
    applications: {
      "Admin Dashboard": process.env.ADMIN_URL || "http://localhost:5173",
      "Client Website": process.env.CLIENT_URL || "http://localhost:3000",
      "Mobile App": "React Native Application",
      "API Server": `http://localhost:${PORT} (You are here)`,
    },
    quickStart: {
      development: "npm run dev",
      production: "npm start",
      documentation: `Visit http://localhost:${PORT}/api-docs for API documentation`,
    },
    message: "🚀 L&V API is running successfully!",
  };

  res.json(projectInfo);
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
  });
});

// Error handler (debe ir al final)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`✅ API Server is running!`);
  console.log(`📍 Server URL: http://localhost:${PORT}`);
  console.log(`🌐 Client URL: ${process.env.CLIENT_URL || "http://localhost:3000"}`);
  console.log(`🖥️  Admin URL: ${process.env.ADMIN_URL || "http://localhost:5173"}`);
  console.log(`📖 API Documentation: http://localhost:${PORT}/api-docs`);
  console.log(`❤️  Health Check: http://localhost:${PORT}/health`);
  console.log(`📋 Project Info: http://localhost:${PORT}`);
  console.log(`⚡ Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`\n🛠️  Ready to build your e-commerce API!`);
});