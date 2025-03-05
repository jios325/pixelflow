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
    message: isValid ? '' : `El archivo excede el tamaño máximo de ${maxSizeMB}MB`
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
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
};

/**
 * Extrae la extensión de un archivo
 * @param {string} filename - Nombre del archivo
 * @returns {string} - Extensión del archivo
 */
export const getFileExtension = (filename) => {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
};

/**
 * Extrae el nombre base de un archivo sin la extensión
 * @param {string} filename - Nombre del archivo
 * @returns {string} - Nombre base sin extensión
 */
export const getBaseName = (filename) => {
  return filename.replace(/\.[^/.]+$/, '');
}; 