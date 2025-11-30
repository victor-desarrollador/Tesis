import { body, validationResult } from 'express-validator';

/**
 * Middleware para verificar errores de validación
 * Se ejecuta después de los validadores
 */
export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array().map(err => ({
                field: err.path,
                message: err.msg,
                value: err.value
            }))
        });
    }
    next();
};

/**
 * Validadores para Registro de Usuario
 * Asegura que los datos cumplan con requisitos de seguridad
 */
export const registerValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('El nombre es obligatorio')
        .isLength({ min: 2, max: 50 }).withMessage('El nombre debe tener entre 2 y 50 caracteres')
        .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/).withMessage('El nombre solo puede contener letras'),

    body('email')
        .trim()
        .notEmpty().withMessage('El email es obligatorio')
        .isEmail().withMessage('Debe ser un email válido')
        .normalizeEmail()
        .isLength({ max: 100 }).withMessage('El email no puede exceder 100 caracteres'),

    body('password')
        .notEmpty().withMessage('La contraseña es obligatoria')
        .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('La contraseña debe contener al menos una mayúscula, una minúscula y un número'),

    body('role')
        .optional()
        .isIn(['cliente', 'admin']).withMessage('Rol inválido. Debe ser "cliente" o "admin"'),
];

/**
 * Validadores para Login
 */
export const loginValidation = [
    body('email')
        .trim()
        .notEmpty().withMessage('El email es obligatorio')
        .isEmail().withMessage('Debe ser un email válido'),

    body('password')
        .notEmpty().withMessage('La contraseña es obligatoria'),
];

/**
 * Validadores para Actualización de Usuario
 */
export const updateUserValidation = [
    body('name')
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 }).withMessage('El nombre debe tener entre 2 y 50 caracteres')
        .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/).withMessage('El nombre solo puede contener letras'),

    body('email')
        .optional()
        .trim()
        .isEmail().withMessage('Debe ser un email válido')
        .normalizeEmail(),

    body('phone')
        .optional()
        .trim()
        .matches(/^[0-9+\-\s()]+$/).withMessage('Número de teléfono inválido'),
];
