import crypto from 'crypto';

/**
 * Genera un token aleatorio seguro
 * @param {number} bytes - Longitud en bytes (default 32)
 * @returns {object} { token: string, hashedToken: string }
 */
export const generateRandomToken = (bytes = 32) => {
    const token = crypto.randomBytes(bytes).toString('hex');

    // Hash SHA-256 para guardar en DB
    const hashedToken = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');

    return { token, hashedToken };
};

/**
 * Hash un token para comparación
 * @param {string} token 
 * @returns {string} hashed token
 */
export const hashToken = (token) => {
    return crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');
};
