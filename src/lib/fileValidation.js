import { saveAs } from 'file-saver';
import JSZip from 'jszip';

/**
 * Verifica si un archivo es una imagen basado en su tipo MIME
 * @param {File} file - El archivo a verificar
 * @returns {boolean} - Verdadero si es una imagen, falso en caso contrario
 */
export const isImageFile = (file) => {
  const acceptedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  return acceptedTypes.includes(file.type);
};

/**
 * Valida el tamaño de un archivo
 * @param {File} file - El archivo a validar
 * @param {number} maxSizeMB - Tamaño máximo en MB
 * @returns {Object} - Objeto con el resultado de la validación
 */
export const validateFileSize = (file, maxSizeMB = 60) => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  const isValid = file.size <= maxSizeBytes;

  return {
    valid: isValid,
    message: isValid ? '' : `El archivo excede el tamaño máximo de ${maxSizeMB}MB`,
  };
};

/**
 * Genera una URL de objeto para previsualizar una imagen
 * @param {File} file - El archivo de imagen
 * @returns {string} - URL de objeto para la imagen
 */
export const getImagePreview = (file) => {
  return URL.createObjectURL(file);
};

/**
 * Formatea el tamaño de un archivo a una cadena legible
 * @param {number} bytes - Tamaño en bytes
 * @param {number} decimals - Número de decimales a mostrar
 * @returns {string} - Tamaño formateado (ej: "2.5 MB")
 */
export const formatFileSize = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';

  const absBytes = Math.abs(bytes);
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(absBytes) / Math.log(k));
  const sign = bytes < 0 ? '-' : '';

  return sign + parseFloat((absBytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
};

/**
 * Extrae la extensión de un archivo
 * @param {string} filename - Nombre del archivo
 * @returns {string} - Extensión del archivo
 */
export const getFileExtension = (filename) => {
  return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
};

/**
 * Extrae el nombre base de un archivo sin la extensión
 * @param {string} filename - Nombre del archivo
 * @returns {string} - Nombre base sin extensión
 */
export const getBaseName = (filename) => {
  return filename.replace(/\.[^/.]+$/, '');
};

/**
 * Descarga una imagen individual
 * @param {Object} image - Objeto de imagen con processedFile/originalFile y name
 */
export const downloadImage = (image) => {
  saveAs(image.processedFile || image.originalFile, image.name);
};

/**
 * Descarga múltiples imágenes como un archivo ZIP
 * @param {Array} images - Array de objetos de imagen
 * @param {string} zipName - Nombre del archivo ZIP
 */
export const downloadImagesAsZip = async (images, zipName = 'images.zip') => {
  if (!images || images.length === 0) return;

  const zip = new JSZip();
  const folder = zip.folder('images');

  // Agregar cada imagen al archivo ZIP
  for (const image of images) {
    const file = image.processedFile || image.originalFile;
    const blob = await file.arrayBuffer();
    folder.file(image.name, blob);
  }

  // Generar y descargar el archivo ZIP
  const content = await zip.generateAsync({ type: 'blob' });
  saveAs(content, zipName);
};

/**
 * Valida las dimensiones de una imagen
 * @param {File} file - El archivo de imagen
 * @param {number} maxWidth - Ancho máximo permitido en píxeles
 * @param {number} maxHeight - Alto máximo permitido en píxeles
 * @returns {Promise<boolean>} - Verdadero si las dimensiones son válidas
 */
export const validateImageDimensions = (file, maxWidth = 5000, maxHeight = 5000) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(img.src);
      resolve(img.width <= maxWidth && img.height <= maxHeight);
    };
    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      resolve(false);
    };
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Obtiene las dimensiones de una imagen
 * @param {File} file - El archivo de imagen
 * @returns {Promise<{width: number, height: number}>} - Dimensiones de la imagen
 */
export const getImageDimensions = (file) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(img.src);
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      resolve({ width: 0, height: 0 });
    };
    img.src = URL.createObjectURL(file);
  });
};
