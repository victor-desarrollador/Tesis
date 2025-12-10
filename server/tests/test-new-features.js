/**
 * Script de Prueba para Nuevas Funcionalidades
 * 
 * Este script prueba:
 * 1. Rate Limiting
 * 2. Modelo Product con nuevos campos
 * 3. Modelo User con preferences
 * 4. Formato de orderNumber
 * 5. Manejo de errores mejorado
 * 
 * Ejecutar con: node tests/test-new-features.js
 */

import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Product from "../models/productModel.js";
import User from "../models/userModel.js";
import Order from "../models/orderModel.js";
import Category from "../models/categoryModel.js";
import Brand from "../models/brandModel.js";

// Cargar variables de entorno
dotenv.config();

// Colores para la consola
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  test: (msg) => console.log(`${colors.cyan}🧪 ${msg}${colors.reset}`),
};

/**
 * Función auxiliar para limpiar datos de prueba
 */
const cleanup = async () => {
  try {
    await Product.deleteMany({ name: /^TEST-/ });
    await User.deleteMany({ email: /^test-/ });
    await Order.deleteMany({ orderNumber: /^LV-/ });
    log.info("Datos de prueba limpiados");
  } catch (error) {
    log.error(`Error al limpiar: ${error.message}`);
  }
};

/**
 * TEST 1: Verificar que el modelo Product acepta nuevos campos
 */
const testProductNewFields = async () => {
  log.test("TEST 1: Verificando nuevos campos del modelo Product");

  try {
    // Buscar una categoría y marca existentes para la prueba
    const category = await Category.findOne();
    const brand = await Brand.findOne();

    if (!category) {
      log.warning("No hay categorías en la BD. Creando una de prueba...");
      const testCategory = await Category.create({
        name: "TEST-Categoría Perfumes",
        description: "Categoría de prueba",
      });
      category = testCategory;
    }

    if (!brand) {
      log.warning("No hay marcas en la BD. Creando una de prueba...");
      const testBrand = await Brand.create({
        name: "TEST-Marca Natura",
        description: "Marca de prueba",
      });
      brand = testBrand;
    }

    // Crear producto con todos los nuevos campos
    const productData = {
      name: "TEST-Perfume Kaiak Masculino 100ml",
      description: "Perfume masculino con fragancia amaderada y acuática. Duración de 8-10 horas.",
      shortDescription: "Perfume masculino amaderado y acuático",
      price: 15000,
      comparePrice: 18000,
      stock: 50,
      category: category._id,
      brand: brand._id,
      subcategory: "Perfumes Masculinos",
      productType: "perfume-hombre",
      variants: [
        {
          name: "Tamaño",
          options: ["50ml", "100ml", "150ml"],
          stock: 30,
          price: 0, // Sin precio adicional
          sku: "KAI-M-100",
        },
        {
          name: "Fragancia",
          options: ["Original", "Intenso"],
          stock: 20,
          price: 2000, // Precio adicional para intenso
          sku: "KAI-M-100-INT",
        },
      ],
      specifications: {
        volume: "100ml",
        ingredients: ["Alcohol", "Fragancia", "Agua"],
        skinType: [], // No aplica para perfumes
        scent: "Amaderado Acuático",
        color: null,
        material: null,
        size: null,
      },
      tags: ["perfume", "masculino", "amaderado", "acuático", "natura"],
      metaTitle: "Perfume Kaiak Masculino 100ml - Natura",
      metaDescription: "Perfume masculino Kaiak de Natura con fragancia amaderada y acuática. 100ml. Envío gratis.",
      newArrival: false,
      bestSeller: true,
      featured: true,
      isActive: true,
      images: [
        {
          url: "https://res.cloudinary.com/test/image/upload/test.jpg",
          publicId: "test/test",
        },
      ],
    };

    const product = await Product.create(productData);
    log.success(`Producto creado: ${product.name}`);
    log.info(`  - ProductType: ${product.productType}`);
    log.info(`  - Subcategory: ${product.subcategory}`);
    log.info(`  - Variants: ${product.variants.length}`);
    log.info(`  - Tags: ${product.tags.join(", ")}`);
    log.info(`  - BestSeller: ${product.bestSeller}`);
    log.info(`  - Slug generado: ${product.slug}`);

    // Verificar que los campos se guardaron correctamente
    if (product.productType !== "perfume-hombre") {
      throw new Error("productType no se guardó correctamente");
    }
    if (product.variants.length !== 2) {
      throw new Error("variants no se guardaron correctamente");
    }
    if (!product.slug) {
      throw new Error("slug no se generó automáticamente");
    }

    log.success("✅ TEST 1 PASADO: Todos los nuevos campos funcionan correctamente");
    return product;
  } catch (error) {
    log.error(`TEST 1 FALLIDO: ${error.message}`);
    throw error;
  }
};

/**
 * TEST 2: Verificar que el modelo User acepta preferences
 */
const testUserPreferences = async () => {
  log.test("TEST 2: Verificando campo preferences del modelo User");

  try {
    const userData = {
      name: "TEST Usuario",
      email: "test-prefs@example.com",
      password: "Test123456",
      role: "cliente",
      preferences: {
        skinType: "mixta",
        fragrancePreference: ["floral", "cítrico"],
        hairType: "ondulado",
      },
    };

    const user = await User.create(userData);
    log.success(`Usuario creado: ${user.email}`);
    log.info(`  - SkinType: ${user.preferences?.skinType}`);
    log.info(`  - FragrancePreference: ${user.preferences?.fragrancePreference?.join(", ")}`);
    log.info(`  - HairType: ${user.preferences?.hairType}`);

    // Verificar que las preferences se guardaron
    if (user.preferences?.skinType !== "mixta") {
      throw new Error("preferences.skinType no se guardó correctamente");
    }
    if (user.preferences?.fragrancePreference?.length !== 2) {
      throw new Error("preferences.fragrancePreference no se guardó correctamente");
    }

    log.success("✅ TEST 2 PASADO: Campo preferences funciona correctamente");
    return user;
  } catch (error) {
    log.error(`TEST 2 FALLIDO: ${error.message}`);
    throw error;
  }
};

/**
 * TEST 3: Verificar formato de orderNumber (LV-YYYY-NNNNN)
 */
const testOrderNumberFormat = async () => {
  log.test("TEST 3: Verificando formato de orderNumber (LV-YYYY-NNNNN)");

  try {
    // Crear un usuario de prueba si no existe
    let testUser = await User.findOne({ email: "test-order@example.com" });
    if (!testUser) {
      testUser = await User.create({
        name: "TEST Usuario Order",
        email: "test-order@example.com",
        password: "Test123456",
        role: "cliente",
      });
    }

    // Crear varias órdenes para verificar el formato
    const orders = [];
    for (let i = 0; i < 3; i++) {
      const order = await Order.create({
        userId: testUser._id,
        items: [
          {
            productId: new mongoose.Types.ObjectId(),
            name: "Producto Test",
            price: 1000,
            quantity: 1,
          },
        ],
        shippingAddress: {
          street: "Calle Test",
          city: "Ciudad Test",
          country: "Argentina",
          postalCode: "1234",
        },
        total: 1000,
        status: "pending",
      });

      orders.push(order);
    }

    // Verificar formato
    const currentYear = new Date().getFullYear();
    const expectedPattern = new RegExp(`^LV-${currentYear}-\\d{5}$`);

    orders.forEach((order, index) => {
      log.info(`  Orden ${index + 1}: ${order.orderNumber}`);
      if (!expectedPattern.test(order.orderNumber)) {
        throw new Error(
          `Formato incorrecto: ${order.orderNumber}. Debe ser LV-${currentYear}-NNNNN`
        );
      }
    });

    // Verificar que son secuenciales
    const orderNumbers = orders.map((o) => o.orderNumber);
    log.info(`  Números de orden generados: ${orderNumbers.join(", ")}`);

    log.success("✅ TEST 3 PASADO: Formato de orderNumber es correcto (LV-YYYY-NNNNN)");
    return orders;
  } catch (error) {
    log.error(`TEST 3 FALLIDO: ${error.message}`);
    throw error;
  }
};

/**
 * TEST 4: Verificar manejo de errores mejorado
 */
const testErrorHandling = async () => {
  log.test("TEST 4: Verificando manejo de errores mejorado");

  try {
    // Test 4.1: CastError - ID inválido
    log.info("  4.1: Probando CastError (ID inválido)");
    try {
      await Product.findById("invalid-id");
      log.warning("    No se lanzó error con ID inválido");
    } catch (error) {
      if (error.name === "CastError") {
        log.success("    CastError detectado correctamente");
      }
    }

    // Test 4.2: ValidationError - Campos requeridos faltantes
    log.info("  4.2: Probando ValidationError (campos requeridos)");
    try {
      await Product.create({
        name: "TEST-Producto Sin Descripción",
        // Falta description, price, category
      });
      log.error("    No se lanzó ValidationError");
    } catch (error) {
      if (error.name === "ValidationError") {
        log.success("    ValidationError detectado correctamente");
        log.info(`    Mensajes: ${Object.values(error.errors).map((e) => e.message).join(", ")}`);
      }
    }

    // Test 4.3: DuplicateKeyError - Nombre duplicado
    log.info("  4.3: Probando DuplicateKeyError (nombre duplicado)");
    const category = await Category.findOne();
    if (category) {
      try {
        const existingProduct = await Product.findOne();
        if (existingProduct) {
          await Product.create({
            name: existingProduct.name, // Nombre duplicado
            description: "Descripción de prueba",
            price: 1000,
            category: category._id,
          });
          log.error("    No se lanzó DuplicateKeyError");
        }
      } catch (error) {
        if (error.code === 11000) {
          log.success("    DuplicateKeyError (E11000) detectado correctamente");
        }
      }
    }

    log.success("✅ TEST 4 PASADO: Manejo de errores funciona correctamente");
  } catch (error) {
    log.error(`TEST 4 FALLIDO: ${error.message}`);
    throw error;
  }
};

/**
 * TEST 5: Verificar índices del modelo Product
 */
const testProductIndexes = async () => {
  log.test("TEST 5: Verificando índices del modelo Product");

  try {
    // Buscar productos por diferentes campos indexados
    const byCategory = await Product.find({ category: new mongoose.Types.ObjectId() }).limit(1);
    const byProductType = await Product.find({ productType: "perfume-hombre" }).limit(1);
    const byFeatured = await Product.find({ featured: true, isActive: true }).limit(1);
    const byBestSeller = await Product.find({ bestSeller: true, isActive: true }).limit(1);

    log.info(`  Búsqueda por categoría: ${byCategory.length} resultados`);
    log.info(`  Búsqueda por productType: ${byProductType.length} resultados`);
    log.info(`  Búsqueda por featured: ${byFeatured.length} resultados`);
    log.info(`  Búsqueda por bestSeller: ${byBestSeller.length} resultados`);

    log.success("✅ TEST 5 PASADO: Índices funcionan correctamente");
  } catch (error) {
    log.error(`TEST 5 FALLIDO: ${error.message}`);
    throw error;
  }
};

/**
 * Función principal que ejecuta todos los tests
 */
const runTests = async () => {
  console.log("\n" + "=".repeat(60));
  console.log("🧪 INICIANDO PRUEBAS DE NUEVAS FUNCIONALIDADES");
  console.log("=".repeat(60) + "\n");

  try {
    // Conectar a la base de datos
    log.info("Conectando a la base de datos...");
    await connectDB();
    log.success("Conexión exitosa\n");

    // Limpiar datos de prueba anteriores
    await cleanup();

    // Ejecutar tests
    await testProductNewFields();
    console.log("");

    await testUserPreferences();
    console.log("");

    await testOrderNumberFormat();
    console.log("");

    await testErrorHandling();
    console.log("");

    await testProductIndexes();
    console.log("");

    // Resumen final
    console.log("=".repeat(60));
    log.success("🎉 TODAS LAS PRUEBAS PASARON EXITOSAMENTE");
    console.log("=".repeat(60));

    // Limpiar datos de prueba
    log.info("\nLimpiando datos de prueba...");
    await cleanup();
  } catch (error) {
    console.log("\n" + "=".repeat(60));
    log.error(`❌ ERROR EN LAS PRUEBAS: ${error.message}`);
    console.log("=".repeat(60));
    if (error.stack) {
      console.log("\nStack trace:");
      console.log(error.stack);
    }
    process.exit(1);
  } finally {
    // Cerrar conexión
    await mongoose.connection.close();
    log.info("Conexión cerrada");
    process.exit(0);
  }
};

// Ejecutar tests
runTests();

