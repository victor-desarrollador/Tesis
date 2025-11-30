import { body, query } from 'express-validator';

/**
 * Validadores para Crear Producto
 */
export const createProductValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('El nombre del producto es obligatorio')
        .isLength({ min: 3, max: 200 }).withMessage('El nombre debe tener entre 3 y 200 caracteres'),

    body('description')
        .trim()
        .notEmpty().withMessage('La descripción es obligatoria')
        .isLength({ min: 10, max: 2000 }).withMessage('La descripción debe tener entre 10 y 2000 caracteres'),

    body('price')
        .notEmpty().withMessage('El precio es obligatorio')
        .isFloat({ min: 0 }).withMessage('El precio debe ser un número positivo'),

    body('comparePrice')
        .optional()
        .isFloat({ min: 0 }).withMessage('El precio de comparación debe ser un número positivo'),

    body('stock')
        .optional()
        .isInt({ min: 0 }).withMessage('El stock debe ser un número entero positivo'),

    body('category')
        .notEmpty().withMessage('La categoría es obligatoria')
        .isMongoId().withMessage('ID de categoría inválido')
        .optional({ checkFalsy: true })
        .isString().withMessage('Categoría debe ser un string'),

    body('brand')
        .optional()
        .isMongoId().withMessage('ID de marca inválido')
        .optional({ checkFalsy: true })
        .isString().withMessage('Marca debe ser un string'),

    body('featured')
        .optional()
        .isBoolean().withMessage('Featured debe ser un valor booleano'),
];

/**
 * Validadores para Actualizar Producto
 */
export const updateProductValidation = [
    body('name')
        .optional()
        .trim()
        .isLength({ min: 3, max: 200 }).withMessage('El nombre debe tener entre 3 y 200 caracteres'),

    body('description')
        .optional()
        .trim()
        .isLength({ min: 10, max: 2000 }).withMessage('La descripción debe tener entre 10 y 2000 caracteres'),

    body('price')
        .optional()
        .isFloat({ min: 0 }).withMessage('El precio debe ser un número positivo'),

    body('stock')
        .optional()
        .isInt({ min: 0 }).withMessage('El stock debe ser un número entero positivo'),

    body('category')
        .optional()
        .isMongoId().withMessage('ID de categoría inválido')
        .optional({ checkFalsy: true })
        .isString().withMessage('Categoría debe ser un string'),
];

/**
 * Validadores para Búsqueda y Filtros de Productos
 */
export const getProductsValidation = [
    query('page')
        .optional()
        .isInt({ min: 1 }).withMessage('La página debe ser un número entero positivo'),

    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 }).withMessage('El límite debe estar entre 1 y 100'),

    query('minPrice')
        .optional()
        .isFloat({ min: 0 }).withMessage('El precio mínimo debe ser un número positivo'),

    query('maxPrice')
        .optional()
        .isFloat({ min: 0 }).withMessage('El precio máximo debe ser un número positivo'),

    query('minRating')
        .optional()
        .isFloat({ min: 0, max: 5 }).withMessage('El rating debe estar entre 0 y 5'),

    query('sort')
        .optional()
        .isIn(['price_asc', 'price_desc', 'rating', 'newest', 'popular'])
        .withMessage('Ordenamiento inválido'),
];

/**
 * Validadores para Crear Reseña
 */
export const createReviewValidation = [
    body('rating')
        .notEmpty().withMessage('El rating es obligatorio')
        .isInt({ min: 1, max: 5 }).withMessage('El rating debe estar entre 1 y 5'),

    body('comment')
        .trim()
        .notEmpty().withMessage('El comentario es obligatorio')
        .isLength({ min: 10, max: 500 }).withMessage('El comentario debe tener entre 10 y 500 caracteres'),
];
