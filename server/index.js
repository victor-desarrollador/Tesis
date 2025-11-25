import express from "express";
import dotenv from "dotenv";
import { errorHandler } from "./middleware/errorMiddleware.js";
import cors from "cors";
import connectDB from "./config/db.js";
import swaggerUi from "swagger-ui-express";
import { specs } from "./config/swagger.js";


// Import routes
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// 🔧 CORRECCIÓN: definir PORT antes de usarlo abajo
const PORT = process.env.PORT || 8000;

// Enhanced CORS configuration
const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.ADMIN_URL,
  "http://localhost:3000",
  "http://localhost:5173",
  "http://localhost:8081",
  "http://10.0.2.2:8081",
  "http://10.0.2.2:8080"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (process.env.NODE_ENV === "development") {
        return callback(null, true);
      }

      if (allowedOrigins.indexOf(origin) !== -1) {
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

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);

// 🔧 CORRECCIÓN: Swagger estaba montado en /api/docs, pero tu mensaje decía /api-docs
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
    name: " L&V tienda E-commerce API",
    version: "1.0.0",
    description: "Backend API server for L&V Tienda e-commerce platform",
    status: "Running",
    environment: process.env.NODE_ENV || "development",
    port: PORT,
    endpoints: {
      documentation: `/api-docs`,
      health: `/health`,
      api: `/api/v1`,
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
    message:
      "🚀 BabyShop API is running successfully! Remove this placeholder and start building your API endpoints!",
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

// Error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(` API Server is running!`);
  console.log(`📍 Server URL: http://localhost:${PORT}`);
  console.log(
    `🌐 Client URL: ${process.env.CLIENT_URL || "http://localhost:3000"}`
  );
  console.log(
    `🖥️  Admin URL: ${process.env.ADMIN_URL || "http://localhost:5173"}`
  );
  console.log(`📖 API Documentation: http://localhost:${PORT}/api-docs`);
  console.log(`❤️  Health Check: http://localhost:${PORT}/health`);
  console.log(`📋 Project Info: http://localhost:${PORT}`);
  console.log(`⚡ Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`\n🛠️  Ready to start building your e-commerce API!`);
});
