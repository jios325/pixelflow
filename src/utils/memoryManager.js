/**
 * Utilidades para gestionar la memoria cuando se trabaja con imágenes grandes
 * Este módulo ayuda a evitar problemas de memoria con archivos grandes
 */

/**
 * Libera memoria de las URLs de objeto que ya no se necesitan
 * @param {string[]} urls - Array de URLs de objetos a liberar
 */
export const releaseObjectURLs = (urls = []) => {
  if (!urls || !Array.isArray(urls)) return;
  
  urls.forEach(url => {
    if (url && url.startsWith('blob:')) {
      try {
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Error al liberar URL de objeto:', error);
      }
    }
  });
};

/**
 * Intenta forzar la recolección de basura (solo para debugging)
 * Nota: Esta función no garantiza que se ejecute la recolección de basura,
 * ya que depende de la implementación del navegador.
 */
export const forceGarbageCollection = () => {
  if (window.gc) {
    try {
      window.gc();
    } catch (e) {
      console.log('No se pudo forzar la recolección de basura');
    }
  }
};

/**
 * Comprime una imagen para reducir su tamaño en memoria
 * @param {File|Blob} file - Archivo de imagen a comprimir
 * @param {Object} options - Opciones de compresión
 * @returns {Promise<Blob>} - Blob de la imagen comprimida
 */
export const compressImageForMemory = async (file, options = {}) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const img = new Image();
      
      img.onload = () => {
        // Determinar dimensiones máximas para mantener en memoria
        const MAX_WIDTH = options.maxWidth || 1920;
        const MAX_HEIGHT = options.maxHeight || 1080;
        
        let width = img.width;
        let height = img.height;
        
        // Redimensionar si es necesario para conservar memoria
        if (width > MAX_WIDTH || height > MAX_HEIGHT) {
          if (width > height) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          } else {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }
        
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = width;
        canvas.height = height;
        
        // Dibujar imagen redimensionada
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convertir a blob con compresión opcional
        canvas.toBlob(
          (blob) => {
            // Liberar memoria
            URL.revokeObjectURL(img.src);
            img.src = '';
            
            resolve(blob);
          },
          file.type,
          options.quality || 0.85
        );
      };
      
      img.onerror = () => {
        reject(new Error('Error al cargar la imagen para compresión de memoria'));
      };
      
      img.src = event.target.result;
    };
    
    reader.onerror = () => {
      reject(new Error('Error al leer el archivo para compresión de memoria'));
    };
    
    reader.readAsDataURL(file);
  });
};

/**
 * Estima la memoria necesaria para procesar una imagen
 * @param {File} file - Archivo de imagen
 * @param {number} imageWidth - Ancho de la imagen (si se conoce)
 * @param {number} imageHeight - Alto de la imagen (si se conoce)
 * @returns {number} - Memoria estimada en bytes
 */
export const estimateImageMemoryUsage = (file, imageWidth = 0, imageHeight = 0) => {
  // Si tenemos dimensiones, calcular basado en ellas
  if (imageWidth > 0 && imageHeight > 0) {
    // Cada píxel necesita 4 bytes (RGBA)
    return imageWidth * imageHeight * 4;
  }
  
  // Si no, hacer una estimación basada en el tamaño del archivo
  // Las imágenes no comprimidas pueden ser 10-20 veces más grandes en memoria
  const compressionRatio = 10;
  return file.size * compressionRatio;
};

/**
 * Crea una vista previa de baja resolución para imágenes grandes
 * @param {File} file - Archivo de imagen original
 * @returns {Promise<string>} - URL de datos para la vista previa
 */
export const createLowResPreview = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const img = new Image();
      
      img.onload = () => {
        // Determinar tamaño de vista previa
        const PREVIEW_SIZE = 300;
        let width, height;
        
        if (img.width > img.height) {
          width = PREVIEW_SIZE;
          height = Math.round((img.height * PREVIEW_SIZE) / img.width);
        } else {
          height = PREVIEW_SIZE;
          width = Math.round((img.width * PREVIEW_SIZE) / img.height);
        }
        
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = width;
        canvas.height = height;
        
        // Dibujamos la imagen redimensionada para la vista previa
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convertir a URL de datos para la vista previa
        const dataUrl = canvas.toDataURL('image/jpeg', 0.5);
        
        // Liberar memoria
        URL.revokeObjectURL(img.src);
        img.src = '';
        
        resolve(dataUrl);
      };
      
      img.onerror = () => {
        reject(new Error('Error al cargar la imagen para vista previa'));
      };
      
      img.src = event.target.result;
    };
    
    reader.onerror = () => {
      reject(new Error('Error al leer el archivo para vista previa'));
    };
    
    reader.readAsDataURL(file);
  });
};

/**
 * Divide una imagen grande en fragmentos más pequeños para procesamiento
 * Útil para imágenes extremadamente grandes que pueden causar problemas de memoria
 * @param {HTMLImageElement} image - Elemento de imagen cargado
 * @param {number} chunkSize - Tamaño máximo de cada fragmento en píxeles
 * @returns {Array<{canvas: HTMLCanvasElement, x: number, y: number, width: number, height: number}>} - Array de fragmentos
 */
export const splitImageIntoChunks = (image, chunkSize = 1024) => {
  const chunks = [];
  const width = image.width;
  const height = image.height;
  
  // Calcular número de filas y columnas de fragmentos
  const cols = Math.ceil(width / chunkSize);
  const rows = Math.ceil(height / chunkSize);
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      // Determinar dimensiones del fragmento actual
      const chunkWidth = Math.min(chunkSize, width - col * chunkSize);
      const chunkHeight = Math.min(chunkSize, height - row * chunkSize);
      
      // Crear canvas para el fragmento
      const canvas = document.createElement('canvas');
      canvas.width = chunkWidth;
      canvas.height = chunkHeight;
      
      const ctx = canvas.getContext('2d');
      
      // Dibujar porción de la imagen en el canvas
      ctx.drawImage(
        image,
        col * chunkSize,
        row * chunkSize,
        chunkWidth,
        chunkHeight,
        0,
        0,
        chunkWidth,
        chunkHeight
      );
      
      // Guardar información del fragmento
      chunks.push({
        canvas,
        x: col * chunkSize,
        y: row * chunkSize,
        width: chunkWidth,
        height: chunkHeight
      });
    }
  }
  
  return chunks;
};

/**
 * Libera recursos de memoria cuando se cambia de vista o se eliminan imágenes
 * @param {Function} callback - Función a ejecutar después de la limpieza
 */
export const cleanupMemory = (callback = null) => {
  // Hacer cualquier limpieza necesaria
  
  // Intentar forzar la recolección de basura
  if (window.gc) {
    try {
      window.gc();
    } catch (e) {
      // Ignorar errores, esto es solo una ayuda para debugging
    }
  }
  
  // Ejecutar callback si se proporciona
  if (typeof callback === 'function') {
    setTimeout(callback, 0);
  }
};
