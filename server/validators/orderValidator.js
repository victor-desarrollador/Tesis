import { body } from 'express-validator';

/**
 * Validadores para Crear Orden
 */
export const createOrderValidation = [
    body('items')
        .isArray({ min: 1 }).withMessage('Debe haber al menos un producto en la orden')
        .notEmpty().withMessage('Los items son obligatorios'),

    body('items.*._id')
        .notEmpty().withMessage('El ID del producto es obligatorio')
        .isMongoId().withMessage('ID de producto inválido'),

    body('items.*.quantity')
        .notEmpty().withMessage('La cantidad es obligatoria')
        .isInt({ min: 1 }).withMessage('La cantidad debe ser al menos 1'),

    body('items.*.price')
        .notEmpty().withMessage('El precio es obligatorio')
        .isFloat({ min: 0 }).withMessage('El precio debe ser un número positivo'),

    body('shippingAddress')
        .optional(), // Validado en cotroller según deliveryMethod

    body('shippingAddress.street')
        .optional()
        .trim()
        // .notEmpty().withMessage('La calle es obligatoria')
        .isLength({ min: 5, max: 200 }).withMessage('La calle debe tener entre 5 y 200 caracteres'),

    body('shippingAddress.city')
        .optional()
        .trim()
        // .notEmpty().withMessage('La ciudad es obligatoria')
        .isLength({ min: 2, max: 100 }).withMessage('La ciudad debe tener entre 2 y 100 caracteres'),

    body('shippingAddress.country')
        .optional()
        .trim()
        // .notEmpty().withMessage('El país es obligatorio')
        .isLength({ min: 2, max: 100 }).withMessage('El país debe tener entre 2 y 100 caracteres'),

    body('shippingAddress.postalCode')
        .optional()
        .trim()
        // .notEmpty().withMessage('El código postal es obligatorio')
        .matches(/^[0-9A-Z\s-]+$/i).withMessage('Código postal inválido'),
];

/**
 * Validadores para Actualizar Estado de Orden
 */
export const updateOrderStatusValidation = [
    body('status')
        .notEmpty().withMessage('El estado es obligatorio')
        .isIn(['pending', 'paid', 'completed', 'cancelled'])
        .withMessage('Estado inválido. Debe ser: pending, paid, completed o cancelled'),

    body('paymentIntentId')
        .optional()
        .isString().withMessage('El payment intent ID debe ser un string'),

    body('stripeSessionId')
        .optional()
        .isString().withMessage('El session ID debe ser un string'),
];
