/**
 * Script de Prueba para Rate Limiting
 * 
 * Este script prueba el rate limiting haciendo múltiples requests
 * a los endpoints protegidos.
 * 
 * Requiere que el servidor esté corriendo en http://localhost:8000
 * 
 * Ejecutar con: node tests/test-rate-limiting.js
 */

const API_URL = process.env.API_URL || "http://localhost:8000";

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
 * Función para hacer una petición HTTP
 */
const makeRequest = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    const data = await response.json();
    return {
      status: response.status,
      headers: Object.fromEntries(response.headers.entries()),
      data,
    };
  } catch (error) {
    return {
      status: 0,
      error: error.message,
    };
  }
};

/**
 * TEST: Rate Limiting en /api/auth/login
 */
const testAuthRateLimit = async () => {
  log.test("TEST: Rate Limiting en /api/auth/login");
  log.info(`Haciendo 7 requests a ${API_URL}/api/auth/login (límite: 5)`);

  const results = [];
  for (let i = 1; i <= 7; i++) {
    const result = await makeRequest(`${API_URL}/api/auth/login`, {
      method: "POST",
      body: JSON.stringify({
        email: `test${i}@example.com`,
        password: "test123",
      }),
    });

    results.push({
      attempt: i,
      status: result.status,
      message: result.data?.message || result.error,
      rateLimitRemaining: result.headers["ratelimit-remaining"],
      rateLimitReset: result.headers["ratelimit-reset"],
    });

    log.info(
      `  Intento ${i}: Status ${result.status} - ${
        result.status === 429 ? "🚫 RATE LIMITED" : result.data?.message || "OK"
      }`
    );

    // Pequeña pausa entre requests
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  // Verificar resultados
  const successCount = results.filter((r) => r.status !== 429).length;
  const blockedCount = results.filter((r) => r.status === 429).length;

  console.log("\n📊 Resumen:");
  log.info(`  Requests exitosos: ${successCount}`);
  log.info(`  Requests bloqueados (429): ${blockedCount}`);

  if (blockedCount > 0) {
    log.success("✅ Rate limiting funciona correctamente");
    log.info(`  Los últimos ${blockedCount} requests fueron bloqueados`);
  } else {
    log.warning("⚠️  Rate limiting no bloqueó ningún request");
    log.info("  Esto puede ser normal si el límite es mayor o si hay un delay");
  }

  return results;
};

/**
 * TEST: Rate Limiting general en /api/products
 */
const testGeneralRateLimit = async () => {
  log.test("TEST: Rate Limiting general en /api/products");
  log.info(`Haciendo 5 requests rápidos a ${API_URL}/api/products (límite: 100)`);

  const results = [];
  for (let i = 1; i <= 5; i++) {
    const result = await makeRequest(`${API_URL}/api/products`);

    results.push({
      attempt: i,
      status: result.status,
      rateLimitRemaining: result.headers["ratelimit-remaining"],
    });

    log.info(`  Intento ${i}: Status ${result.status}`);

    // Pausa muy pequeña
    await new Promise((resolve) => setTimeout(resolve, 50));
  }

  const successCount = results.filter((r) => r.status === 200).length;
  log.info(`\n  Requests exitosos: ${successCount}/5`);

  if (successCount === 5) {
    log.success("✅ Rate limiting general permite requests normales");
  }

  return results;
};

/**
 * Función principal
 */
const runTests = async () => {
  console.log("\n" + "=".repeat(60));
  console.log("🧪 PRUEBAS DE RATE LIMITING");
  console.log("=".repeat(60));
  log.info(`Servidor: ${API_URL}\n`);

  // Verificar que el servidor está corriendo
  try {
    const healthCheck = await makeRequest(`${API_URL}/health`);
    if (healthCheck.status !== 200) {
      log.error("El servidor no está respondiendo correctamente");
      log.info("Asegúrate de que el servidor esté corriendo en http://localhost:8000");
      process.exit(1);
    }
    log.success("Servidor está corriendo\n");
  } catch (error) {
    log.error("No se puede conectar al servidor");
    log.info("Asegúrate de que el servidor esté corriendo en http://localhost:8000");
    log.info("Ejecuta: cd server && npm run dev");
    process.exit(1);
  }

  try {
    await testAuthRateLimit();
    console.log("");
    await testGeneralRateLimit();

    console.log("\n" + "=".repeat(60));
    log.success("🎉 PRUEBAS COMPLETADAS");
    console.log("=".repeat(60));
  } catch (error) {
    log.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Ejecutar tests
runTests();

