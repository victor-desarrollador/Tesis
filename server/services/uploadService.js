import cloudinary from '../config/cloudinary.config.js';

/**
 * Subir imagen a Cloudinary
 * @param {string} base64Image - Imagen en formato base64
 * @param {string} folder - Carpeta en Cloudinary (ej: 'avatars', 'products', 'brands')
 * @returns {Promise<{url: string, publicId: string}>}
 */
export const uploadImage = async (base64Image, folder) => {
    try {
        // Validar que sea una imagen base64
        if (!base64Image || !base64Image.startsWith('data:image')) {
            throw new Error('Invalid image format. Expected base64 image.');
        }

        const result = await cloudinary.uploader.upload(base64Image, {
            folder: `ecommerce/${folder}`,
            resource_type: 'auto',
            transformation: [
                { quality: 'auto:good' },
                { fetch_format: 'auto' }
            ]
        });

        return {
            url: result.secure_url,
            publicId: result.public_id,
        };
    } catch (error) {
        console.error('Error uploading image to Cloudinary:', error);
        throw new Error(`Error al subir imagen: ${error.message}`);
    }
};

/**
 * Eliminar imagen de Cloudinary
 * @param {string} publicId - Public ID de la imagen en Cloudinary
 * @returns {Promise<void>}
 */
export const deleteImage = async (publicId) => {
    try {
        if (!publicId) {
            return; // No hay imagen que eliminar
        }

        await cloudinary.uploader.destroy(publicId);
        console.log(`✅ Image deleted from Cloudinary: ${publicId}`);
    } catch (error) {
        console.error('Error deleting image from Cloudinary:', error);
        // No lanzar error para no bloquear operaciones
    }
};

/**
 * Subir múltiples imágenes a Cloudinary
 * @param {string[]} base64Images - Array de imágenes en base64
 * @param {string} folder - Carpeta en Cloudinary
 * @returns {Promise<Array<{url: string, publicId: string}>>}
 */
export const uploadMultipleImages = async (base64Images, folder) => {
    try {
        const uploadPromises = base64Images.map(image => uploadImage(image, folder));
        return await Promise.all(uploadPromises);
    } catch (error) {
        console.error('Error uploading multiple images:', error);
        throw new Error(`Error al subir imágenes: ${error.message}`);
    }
};

/**
 * Eliminar múltiples imágenes de Cloudinary
 * @param {string[]} publicIds - Array de public IDs
 * @returns {Promise<void>}
 */
export const deleteMultipleImages = async (publicIds) => {
    try {
        const deletePromises = publicIds.filter(id => id).map(id => deleteImage(id));
        await Promise.all(deletePromises);
    } catch (error) {
        console.error('Error deleting multiple images:', error);
    }
};
