/**
 * Middleware Centralizado de Manejo de Errores
 *
 * Proporciona manejo consistente de errores en toda la aplicación
 * Diferencia entre tipos de errores y proporciona respuestas apropiadas
 *
 * Justificación Académica:
 * - Demuestra conocimiento de manejo robusto de errores
 * - Mejora la experiencia del desarrollador con mensajes claros
 * - Facilita debugging en desarrollo
 * - Oculta información sensible en producción
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log completo del error para debugging
  console.error('❌ Error:', {
    message: err.message,
    stack: err.stack,
    name: err.name,
    code: err.code,
    path: req.path,
    method: req.method,
  });

  // Mongoose bad ObjectId (CastError)
  // Ocurre cuando se intenta usar un ID inválido
  if (err.name === 'CastError') {
    const message = 'Recurso no encontrado. ID inválido.';
    error = { message, statusCode: 404 };
  }

  // Mongoose duplicate key error (E11000)
  // Ocurre cuando se intenta crear un documento con un campo único duplicado
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || 'campo';
    const value = err.keyValue?.[field] || 'valor';
    const message = `${field} "${value}" ya existe en la base de datos.`;
    error = { message, statusCode: 400 };
  }

  // Mongoose validation error
  // Ocurre cuando los datos no cumplen con las validaciones del schema
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors || {}).map((val) => val.message);
    const message = `Error de validación: ${errors.join(', ')}`;
    error = { message, statusCode: 400 };
  }

  // JWT errors
  // Token inválido o malformado
  if (err.name === 'JsonWebTokenError') {
    const message = 'Token inválido. Por favor inicia sesión nuevamente.';
    error = { message, statusCode: 401 };
  }

  // JWT expired error
  // Token expirado
  if (err.name === 'TokenExpiredError') {
    const message = 'Token expirado. Por favor inicia sesión nuevamente.';
    error = { message, statusCode: 401 };
  }

  // Error de express-validator
  // Errores de validación de entrada
  if (err.name === 'ValidationError' && err.array) {
    const message = err.array().map((e) => e.msg).join(', ');
    error = { message, statusCode: 400 };
  }

  // Determinar código de estado HTTP
  // Usa el código del error, el código de respuesta actual, o 500 por defecto
  const statusCode = error.statusCode || res.statusCode || 500;

  // Respuesta estructurada
  const response = {
    success: false,
    message: error.message || 'Error del servidor',
  };

  // Solo incluir stack trace en desarrollo
  // En producción, ocultar detalles técnicos por seguridad
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
    response.error = {
      name: err.name,
      code: err.code,
    };
  }

  res.status(statusCode).json(response);
};

export { errorHandler };