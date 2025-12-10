# 🧪 Scripts de Prueba para Nuevas Funcionalidades

Este directorio contiene scripts de prueba para verificar que las nuevas funcionalidades implementadas funcionan correctamente.

## 📋 Scripts Disponibles

### 1. `test-new-features.js`
Prueba las nuevas funcionalidades de los modelos:
- ✅ Modelo Product con nuevos campos (variants, specifications, tags, etc.)
- ✅ Modelo User con campo preferences
- ✅ Formato de orderNumber (LV-YYYY-NNNNN)
- ✅ Manejo de errores mejorado
- ✅ Índices del modelo Product

**Ejecutar:**
```bash
cd server
node tests/test-new-features.js
```

**Requisitos:**
- Base de datos MongoDB conectada
- Variables de entorno configuradas (.env)
- Al menos una categoría y marca en la base de datos

---

### 2. `test-rate-limiting.js`
Prueba el rate limiting implementado:
- ✅ Rate limiting en `/api/auth/login` (5 intentos por 15 minutos)
- ✅ Rate limiting general en `/api/products` (100 requests por 15 minutos)

**Ejecutar:**
```bash
cd server
node tests/test-rate-limiting.js
```

**Requisitos:**
- Servidor corriendo en `http://localhost:8000`
- Node.js con soporte para `fetch` (v18+) o instalar `node-fetch`

---

## 🚀 Cómo Ejecutar las Pruebas

### Opción 1: Pruebas de Modelos (Base de Datos)

1. **Asegúrate de que MongoDB esté corriendo:**
   ```bash
   # Si usas MongoDB local
   mongod
   
   # O verifica tu conexión en .env
   ```

2. **Configura las variables de entorno:**
   ```bash
   cd server
   # Asegúrate de tener un archivo .env con:
   # MONGO_URI=tu_uri_de_mongodb
   ```

3. **Ejecuta las pruebas:**
   ```bash
   node tests/test-new-features.js
   ```

### Opción 2: Pruebas de Rate Limiting (API)

1. **Inicia el servidor:**
   ```bash
   cd server
   npm run dev
   ```

2. **En otra terminal, ejecuta las pruebas:**
   ```bash
   cd server
   node tests/test-rate-limiting.js
   ```

---

## 📊 Qué Esperar

### test-new-features.js

Deberías ver:
```
🧪 INICIANDO PRUEBAS DE NUEVAS FUNCIONALIDADES
✅ Conexión exitosa
✅ TEST 1 PASADO: Todos los nuevos campos funcionan correctamente
✅ TEST 2 PASADO: Campo preferences funciona correctamente
✅ TEST 3 PASADO: Formato de orderNumber es correcto (LV-YYYY-NNNNN)
✅ TEST 4 PASADO: Manejo de errores funciona correctamente
✅ TEST 5 PASADO: Índices funcionan correctamente
🎉 TODAS LAS PRUEBAS PASARON EXITOSAMENTE
```

### test-rate-limiting.js

Deberías ver:
```
🧪 PRUEBAS DE RATE LIMITING
✅ Servidor está corriendo
✅ Rate limiting funciona correctamente
  Los últimos 2 requests fueron bloqueados
✅ Rate limiting general permite requests normales
🎉 PRUEBAS COMPLETADAS
```

---

## 🔧 Solución de Problemas

### Error: "Cannot find module"
```bash
# Asegúrate de estar en el directorio server
cd server
```

### Error: "MongoDB connection failed"
- Verifica que MongoDB esté corriendo
- Verifica la URI en tu archivo .env
- Verifica que tengas permisos de escritura

### Error: "fetch is not defined"
Si usas Node.js < 18, instala node-fetch:
```bash
npm install node-fetch
```

Luego modifica `test-rate-limiting.js` para importar fetch:
```javascript
import fetch from 'node-fetch';
```

### Rate Limiting no bloquea requests
- Verifica que el servidor esté usando las nuevas configuraciones
- Verifica que no estés usando un proxy que cambie tu IP
- Los límites pueden resetearse si pasan 15 minutos

---

## 📝 Notas

- Los scripts crean datos de prueba que se limpian automáticamente al finalizar
- Los datos de prueba tienen el prefijo "TEST-" para fácil identificación
- Las pruebas no afectan datos existentes en producción
- Si una prueba falla, revisa los mensajes de error para más detalles

---

## 🎓 Valor Académico

Estos scripts demuestran:
- ✅ Conocimiento de testing
- ✅ Verificación de funcionalidades implementadas
- ✅ Buenas prácticas de desarrollo
- ✅ Documentación clara

