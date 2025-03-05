import imageCompression from 'browser-image-compression';
import Resizer from 'react-image-file-resizer';

/**
 * Calcula las dimensiones en píxeles basado en un porcentaje del tamaño original
 * @param {File} file - Archivo de imagen original
 * @param {number} widthPercent - Porcentaje del ancho (1-100)
 * @param {boolean} maintainAspectRatio - Mantener proporción de aspecto
 * @returns {Promise<{width: number, height: number}>} - Dimensiones en píxeles
 */
export const calculatePercentageDimensions = async (file, widthPercent, maintainAspectRatio = true) => {
  try {
    // Cargar la imagen para obtener sus dimensiones originales
    const img = await new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = (err) => reject(new Error(`Error al cargar la imagen: ${err?.message || 'Unknown error'}`));
      
      // Leer el archivo como URL de datos
      const reader = new FileReader();
      reader.onload = (e) => { img.src = e.target.result; };
      reader.onerror = (err) => reject(new Error(`Error al leer el archivo: ${err?.message || 'Unknown error'}`));
      reader.readAsDataURL(file);
    });
    
    // Calcular el ancho en píxeles basándose en el porcentaje
    const newWidth = Math.round(img.width * (widthPercent / 100));
    
    // Calcular el alto manteniéndose en proporción si es necesario
    let newHeight;
    if (maintainAspectRatio) {
      const aspectRatio = img.width / img.height;
      newHeight = Math.round(newWidth / aspectRatio);
    } else {
      // Si no se mantiene la proporción, usar el mismo porcentaje para el alto
      newHeight = Math.round(img.height * (widthPercent / 100));
    }
    
    return { 
      width: newWidth, 
      height: newHeight, 
      originalWidth: img.width, 
      originalHeight: img.height 
    };
  } catch (error) {
    console.error('Error al calcular dimensiones por porcentaje:', error);
    // Devolver valores predeterminados en caso de error
    return { width: 800, height: 600 };
  }
};

/**
 * Función auxiliar para crear una promesa que maneja la conversión de formato mediante canvas
 * @param {HTMLImageElement} img - Elemento de imagen cargado
 * @param {string} format - Formato MIME (e.g., 'image/webp')
 * @param {number} quality - Calidad de compresión (0-1)
 * @returns {Promise<Blob>} - Blob de la imagen convertida
 */
const createConvertPromise = (img, format, quality = 0.92) => {
  return new Promise((resolve, reject) => {
    try {
      // Crear canvas y dibujar la imagen
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      
      // Fondo blanco para formatos sin transparencia como JPG
      if (format === 'image/jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      
      // Dibujar la imagen
      ctx.drawImage(img, 0, 0);
      
      // Convertir a formato deseado
      if (canvas.toBlob) {
        canvas.toBlob(blob => {
          if (!blob) {
            console.error('La conversión a', format, 'falló - no se generó blob');
            reject(new Error(`No se pudo convertir a ${format}`));
            return;
          }
          resolve(blob);
        }, format, quality);
      } else {
        // Fallback para navegadores que no soportan toBlob
        try {
          const dataURL = canvas.toDataURL(format, quality);
          const binary = atob(dataURL.split(',')[1]);
          const array = [];
          for (let i = 0; i < binary.length; i++) {
            array.push(binary.charCodeAt(i));
          }
          const blob = new Blob([new Uint8Array(array)], {type: format});
          resolve(blob);
        } catch (e) {
          console.error('Error en fallback de conversión:', e);
          reject(e);
        }
      }
    } catch (e) {
      console.error('Error en createConvertPromise:', e);
      reject(e);
    }
  });
};

/**
 * Optimiza una imagen para reducir su tamaño
 * @param {File} file - Archivo de imagen a optimizar
 * @param {Object} options - Opciones de optimización
 * @returns {Promise<File>} - Archivo optimizado
 */
export const optimizeImage = async (file, options = {}) => {
  const defaultOptions = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true
  };
  
  const compressionOptions = {
    ...defaultOptions,
    ...options
  };
  
  try {
    return await imageCompression(file, compressionOptions);
  } catch (error) {
    console.error('Error al optimizar la imagen:', error);
    return file; // Devolver el archivo original en caso de error
  }
};

/**
 * Redimensiona una imagen
 * @param {File} file - Archivo de imagen a redimensionar
 * @param {number} width - Ancho deseado
 * @param {number} height - Alto deseado
 * @param {boolean} maintainAspectRatio - Mantener proporción de aspecto
 * @returns {Promise<Blob>} - Blob de la imagen redimensionada
 */
export const resizeImage = (file, width, height, maintainAspectRatio = true) => {
  return new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      width,
      height,
      file.type.split('/')[1].toUpperCase(), // Formato (JPEG, PNG, etc.)
      100, // Calidad
      0, // Rotación
      (blob) => {
        resolve(blob);
      },
      'blob',
      width,
      height,
      maintainAspectRatio ? file.type.includes('png') ? 3 : 1 : 0
    );
  });
};

/**
 * Convierte una imagen a un formato específico
 * @param {File} file - Archivo de imagen a convertir
 * @param {string} format - Formato deseado ('jpg', 'png', 'webp')
 * @returns {Promise<File>} - Archivo de la imagen convertida
 */
export const convertImageFormat = async (file, format) => {
  // Si el formato es 'original', devolver el archivo sin cambios
  if (format === 'original') {
    return file;
  }
  
  console.log(`Iniciando conversión a formato: ${format.toUpperCase()}`);
  
  // Determinar el tipo MIME adecuado para el formato solicitado
  let mimeType;
  let extension;
  switch(format.toLowerCase()) {
    case 'jpg':
    case 'jpeg':
      mimeType = 'image/jpeg';
      extension = 'jpg';
      break;
    case 'png':
      mimeType = 'image/png';
      extension = 'png';
      break;
    case 'webp':
      mimeType = 'image/webp';
      extension = 'webp';
      break;
    case 'gif':
      mimeType = 'image/gif';
      extension = 'gif';
      break;
    default:
      mimeType = `image/${format}`;
      extension = format;
  }
  
  console.log(`Usando MIME type: ${mimeType}`);
  
  try {
    // Cargar la imagen en un objeto Image
    const loadImagePromise = new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = (err) => reject(new Error(`Error al cargar la imagen: ${err?.message || 'Unknown error'}`));
      
      // Leer el archivo como URL de datos
      const reader = new FileReader();
      reader.onload = (e) => { img.src = e.target.result; };
      reader.onerror = (err) => reject(new Error(`Error al leer el archivo: ${err?.message || 'Unknown error'}`));
      reader.readAsDataURL(file);
    });
    
    // Esperar a que la imagen esté cargada
    const img = await loadImagePromise;
    
    // Convertir la imagen al formato deseado
    const blob = await createConvertPromise(img, mimeType, 0.92);
    
    // Crear un nuevo archivo con el tipo MIME correcto
    const timestamp = new Date().getTime();
    const convertedFile = new File(
      [blob],
      `image_${timestamp}.${extension}`,
      { type: mimeType, lastModified: timestamp }
    );
    
    console.log(`Conversión exitosa a ${format.toUpperCase()}:`, convertedFile);
    return convertedFile;
  } catch (error) {
    console.error(`Error al convertir a ${format}:`, error);
    // En caso de error, devolver el archivo original
    return file;
  }
};

/**
 * Recorta una imagen a un tamaño específico desde una posición determinada
 * @param {File} file - Archivo de imagen a recortar
 * @param {number} width - Ancho del recorte
 * @param {number} height - Alto del recorte
 * @param {string} position - Posición desde donde recortar (center, top-left, etc.)
 * @returns {Promise<Blob>} - Blob de la imagen recortada
 */
export const cropImage = async (file, width, height, position = 'center') => {
  console.log(`Ejecutando cropImage con dimensiones: ${width}x${height}, posición: ${position}`);
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        // Registrar las dimensiones reales de la imagen
        console.log(`Dimensiones reales antes del recorte: ${img.width}x${img.height}`);
        
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Configurar el tamaño del canvas para el recorte
        canvas.width = width;
        canvas.height = height;
        
        // Definir las coordenadas de origen según la posición
        let sourceX, sourceY;
        
        // Calcular coordenadas X según posición horizontal
        if (position.includes('left')) {
          sourceX = 0;
        } else if (position.includes('right')) {
          sourceX = Math.max(0, img.width - width);
        } else { // centro
          sourceX = Math.max(0, (img.width - width) / 2);
        }
        
        // Calcular coordenadas Y según posición vertical
        if (position.includes('top')) {
          sourceY = 0;
        } else if (position.includes('bottom')) {
          sourceY = Math.max(0, img.height - height);
        } else { // centro
          sourceY = Math.max(0, (img.height - height) / 2);
        }
        
        console.log(`Posición de recorte: ${position}, Coordenadas: (${sourceX}, ${sourceY})`);
        
        // Asegurarse de que no se salga de los límites de la imagen
        const sourceWidth = Math.min(width, img.width - sourceX);
        const sourceHeight = Math.min(height, img.height - sourceY);
        
        console.log(`Área de origen para recorte: ${sourceWidth}x${sourceHeight}`);
        
        // Fondo blanco para el canvas
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        
        // Si la imagen es más pequeña que el recorte, centramos
        let destX = 0;
        let destY = 0;
        let destWidth = sourceWidth;
        let destHeight = sourceHeight;
        
        // Ajustar si la imagen es más pequeña que las dimensiones solicitadas
        if (sourceWidth < width) {
          destX = Math.floor((width - sourceWidth) / 2);
        }
        
        if (sourceHeight < height) {
          destY = Math.floor((height - sourceHeight) / 2);
        }
        
        // Dibujar solo la parte deseada de la imagen
        ctx.drawImage(
          img,
          sourceX,
          sourceY,
          sourceWidth,
          sourceHeight,
          destX,
          destY,
          destWidth,
          destHeight
        );
        
        console.log(`Recorte completado: ${width}x${height}`);
        
        // Convertir a Blob
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Error al recortar la imagen'));
          }
        }, file.type);
      };
      
      img.onerror = () => {
        reject(new Error('Error al cargar la imagen'));
      };
      
      img.src = e.target.result;
    };
    
    reader.onerror = () => {
      reject(new Error('Error al leer el archivo'));
    };
    
    reader.readAsDataURL(file);
  });
};