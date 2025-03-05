import { useState, useEffect, useCallback } from 'react';
import { optimizeImage, resizeImage, convertImageFormat, cropImage, calculatePercentageDimensions } from '../utils/imageProcessing';
import { getBaseName, getFileExtension, formatFileSize } from '../utils/fileValidation';

/**
 * Hook personalizado para procesar imágenes
 * @param {Array} uploadedImages - Lista de imágenes cargadas
 * @returns {Object} - Estado y funciones para procesar imágenes
 */
const useImageProcessor = (uploadedImages) => {
  // Estado para almacenar las imágenes procesadas
  const [processedImages, setProcessedImages] = useState([]);
  // Estado para indicar si está procesando
  const [processing, setProcessing] = useState(false);
  // Estado para almacenar la relación de aspecto actual (proporción)
  const [aspectRatio, setAspectRatio] = useState(4/3); // Valor por defecto (4:3)
  
  // Configuración de procesamiento
  const [processingSettings, setProcessingSettings] = useState({
    optimize: true,
    format: 'original', // original, jpg, png, webp
    resize: {
      enabled: false,
      width: 800,
      height: 600,
      maintainAspectRatio: true,
      unit: 'px' // 'px' o '%'
    },
    crop: {
      enabled: false,
      cropType: 'square',
      width: 1000,
      height: 1000,
      position: 'center'
    }
  });
  
  // Actualizar la relación de aspecto cuando se modifiquen el ancho o alto
  useEffect(() => {
    if (processingSettings.resize.width && processingSettings.resize.height) {
      const newAspectRatio = processingSettings.resize.width / processingSettings.resize.height;
      if (newAspectRatio > 0 && isFinite(newAspectRatio)) {
        setAspectRatio(newAspectRatio);
      }
    }
  }, [processingSettings.resize.width, processingSettings.resize.height]);
  
  // Función para crear un archivo con el formato correcto
  const createFileWithFormat = async (file, format) => {
    if (!file || format === 'original') return file;
    
    // Determinar el tipo MIME para el formato solicitado
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
    
    try {
      // Crear un canvas para hacer la conversión
      const img = new Image();
      
      // Cargar la imagen
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        
        // Crear objeto URL para la imagen
        if (file instanceof File || file instanceof Blob) {
          const reader = new FileReader();
          reader.onload = (e) => { img.src = e.target.result; };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        } else if (typeof file === 'string') {
          img.src = file;
        } else {
          reject(new Error('Formato de archivo no soportado'));
        }
      });
      
      // Crear un canvas con las dimensiones de la imagen
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      
      // Fondo blanco para JPEG (que no soporta transparencia)
      if (mimeType === 'image/jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      
      // Dibujar la imagen en el canvas
      ctx.drawImage(img, 0, 0);
      
      // Convertir el canvas a un Blob con el formato deseado
      const blob = await new Promise(resolve => {
        canvas.toBlob(resolve, mimeType, 0.92);
      });
      
      if (!blob) {
        throw new Error(`No se pudo convertir al formato ${format}`);
      }
      
      // Crear un File con el blob y el tipo MIME adecuado
      const timestamp = Date.now();
      const newFile = new File([blob], `image_${timestamp}.${extension}`, {
        type: mimeType,
        lastModified: timestamp
      });
      
      console.log(`Conversión exitosa a ${format.toUpperCase()}:`, newFile);
      return newFile;
    } catch (error) {
      console.error(`Error al convertir a ${format}:`, error);
      return file; // Devolver archivo original en caso de error
    }
  };
  
  // Función para procesar imágenes bajo demanda (cuando el usuario haga clic en un botón)
  const processImages = useCallback(async () => {
    if (!uploadedImages || uploadedImages.length === 0) {
      setProcessedImages([]);
      return;
    }
    
    // Iniciar procesamiento
    setProcessing(true);
    
    // Procesar imágenes en lotes para mejorar rendimiento con archivos grandes
    const BATCH_SIZE = 3; // Procesar 3 imágenes a la vez para evitar bloquear el navegador
    const processedResults = [];
    
    try {
      // Dividir en lotes
      for (let i = 0; i < uploadedImages.length; i += BATCH_SIZE) {
        const batch = uploadedImages.slice(i, i + BATCH_SIZE);
        
        // Procesar lote actual
        const batchResults = await Promise.all(batch.map(async (img) => {
          try {
            let processedFile = img.file;
            let fileChanged = false;
            let resizeDimensions = {
              width: processingSettings.resize.width,
              height: processingSettings.resize.height
            };
            
            // Si se usa porcentaje para el redimensionamiento, calcular las dimensiones en píxeles
            if (processingSettings.resize.enabled && processingSettings.resize.unit === '%') {
              try {
                // Calcular las dimensiones basadas en el porcentaje
                const percentWidth = processingSettings.resize.width;
                const dimensions = await calculatePercentageDimensions(
                  processedFile,
                  percentWidth,
                  processingSettings.resize.maintainAspectRatio
                );
                
                if (dimensions.width && dimensions.height) {
                  resizeDimensions = dimensions;
                  console.log(`Redimensionando al ${percentWidth}% - Ancho: ${dimensions.width}px, Alto: ${dimensions.height}px`);
                }
              } catch (error) {
                console.error('Error al calcular dimensiones en porcentaje:', error);
              }
            }
            
            // Definimos el orden exacto de procesamiento:
            
            // 1. Primero aplicar optimización si está habilitada (reduce el tamaño del archivo)
            if (processingSettings.optimize) {
              processedFile = await optimizeImage(processedFile, {
                maxSizeMB: 1,
                maxWidthOrHeight: 1920,
                useWebWorker: true
              });
              fileChanged = true;
              console.log('Imagen optimizada');
            }
            
            // 2. Segundo: aplicar redimensionamiento si está habilitado
            if (processingSettings.resize.enabled) {
              processedFile = await resizeImage(
                processedFile, 
                resizeDimensions.width, 
                resizeDimensions.height, 
                processingSettings.resize.maintainAspectRatio
              );
              fileChanged = true;
              console.log(`Imagen redimensionada a ${resizeDimensions.width}x${resizeDimensions.height}`);
              
              // Importante: Si estamos en modo debug, obtener dimensiones reales
              try {
                const img = new Image();
                const reader = new FileReader();
                await new Promise((resolve, reject) => {
                  reader.onload = () => {
                    img.onload = resolve;
                    img.onerror = reject;
                    img.src = reader.result;
                  };
                  reader.onerror = reject;
                  reader.readAsDataURL(processedFile);
                });
                console.log(`Dimensiones reales después del redimensionamiento: ${img.width}x${img.height}`);
              } catch (err) {
                console.error('Error al verificar dimensiones:', err);
              }
            }
            
            // 3. Tercero: aplicar recorte si está habilitado (siempre después del redimensionamiento)
            if (processingSettings.crop.enabled) {
              // Obtener las dimensiones de la imagen antes del recorte
              let imageDimensions;
              try {
                const img = new Image();
                const reader = new FileReader();
                await new Promise((resolve, reject) => {
                  reader.onload = () => {
                    img.onload = resolve;
                    img.onerror = reject;
                    img.src = reader.result;
                  };
                  reader.onerror = reject;
                  reader.readAsDataURL(processedFile);
                });
                imageDimensions = { width: img.width, height: img.height };
                console.log(`Dimensiones antes del recorte: ${img.width}x${img.height}`);
              } catch (err) {
                console.error('Error al obtener dimensiones para recorte:', err);
                imageDimensions = { width: 0, height: 0 };
              }
              
              // Usar las dimensiones exactas del tipo de recorte
              const cropWidth = processingSettings.crop.width;
              const cropHeight = processingSettings.crop.height;
              
              console.log(`Aplicando recorte: ${cropWidth}x${cropHeight} desde posición ${processingSettings.crop.position}`);
              
              processedFile = await cropImage(
                processedFile,
                cropWidth,
                cropHeight,
                processingSettings.crop.position || 'center'
              );
              fileChanged = true;
              console.log(`Imagen recortada completada: ${cropWidth}x${cropHeight}`);
            }
            
            // 4. Por último: convertir formato si no es 'original'
            if (processingSettings.format !== 'original') {
              console.log(`Aplicando conversión de formato a: ${processingSettings.format}`);
              try {
                const prevSize = processedFile.size;
                processedFile = await convertImageFormat(processedFile, processingSettings.format);
                console.log(`Conversión completada. Tamaño anterior: ${prevSize}, Nuevo tamaño: ${processedFile.size}`);
                console.log(`Tipo MIME resultante: ${processedFile.type}`);
                fileChanged = true;
              } catch (error) {
                console.error(`Error en la conversión de formato a ${processingSettings.format}:`, error);
              }
            }
            
            // Crear una URL para la vista previa de la imagen procesada
            const processedPreview = URL.createObjectURL(processedFile);
            
            // Determinar la extensión basada en el tipo MIME del archivo procesado
            let newExtension;
            if (processedFile.type) {
              const mimeType = processedFile.type.toLowerCase();
              if (mimeType.includes('jpeg') || mimeType.includes('jpg')) {
                newExtension = 'jpg';
              } else if (mimeType.includes('png')) {
                newExtension = 'png';
              } else if (mimeType.includes('webp')) {
                newExtension = 'webp';
              } else if (mimeType.includes('gif')) {
                newExtension = 'gif';
              } else {
                newExtension = mimeType.split('/')[1] || getFileExtension(img.name);
              }
            } else {
              newExtension = processingSettings.format === 'original' 
                ? getFileExtension(img.name) 
                : processingSettings.format;
            }
            
            // Construir nuevo nombre con la extensión correcta
            const baseName = getBaseName(img.name);
            const newName = `${baseName}.${newExtension}`;
            
            console.log(`Nombre final: ${newName}, Tipo MIME: ${processedFile.type}`);
            
            // Crear objeto de imagen procesada
            return {
              ...img,
              processed: true,
              processedFile, // El archivo procesado
              processedPreview, // URL para vista previa
              processedSize: processedFile.size, // Tamaño del archivo procesado
              formattedProcessedSize: formatFileSize(processedFile.size), // Tamaño formateado
              newName, // Nombre con extensión actualizada
              fileChanged, // Indica si la imagen fue realmente modificada
              mimeType: processedFile.type, // Guardar el tipo MIME para referencia
              optimization: {
                originalSize: img.size,
                newSize: processedFile.size,
                reduction: img.size - processedFile.size,
                reductionPercent: ((img.size - processedFile.size) / img.size * 100).toFixed(2)
              }
            };
          } catch (error) {
            console.error(`Error al procesar imagen ${img.name}:`, error);
            // Si hay error, devolver la imagen sin procesar pero marcarla como procesada
            return {
              ...img,
              processed: true,
              processedPreview: img.preview,
              processedFile: img.file,
              processedSize: img.size,
              formattedProcessedSize: formatFileSize(img.size),
              newName: img.name,
              fileChanged: false,
              error: error.message
            };
          }
        }));
        
        // Añadir resultados del lote al array final
        processedResults.push(...batchResults);
      }
      
      // Actualizar estado con todas las imágenes procesadas (reemplazando, no añadiendo)
      setProcessedImages(processedResults);
    } catch (error) {
      console.error('Error al procesar imágenes:', error);
    } finally {
      setProcessing(false);
    }
  }, [uploadedImages, processingSettings]);
  
  // Limpiar las imágenes procesadas cuando cambian las imágenes subidas
  useEffect(() => {
    if (!uploadedImages || uploadedImages.length === 0) {
      setProcessedImages([]);
    }
  }, [uploadedImages]);
  
  /**
   * Activa/desactiva la optimización de imágenes
   */
  const toggleOptimize = () => {
    setProcessingSettings(prev => ({
      ...prev,
      optimize: !prev.optimize
    }));
  };
  
  /**
   * Cambia el formato de salida de las imágenes
   * @param {string} format - Formato de salida (original, jpg, png, webp)
   */
  const changeFormat = (format) => {
    setProcessingSettings(prev => ({
      ...prev,
      format
    }));
  };
  
  /**
   * Actualiza la configuración de redimensionamiento
   * @param {Object} settings - Nueva configuración
   */
  const updateResizeSettings = (settings) => {
    // Si estamos activando la opción de mantener la proporción
    if (settings.maintainAspectRatio === true && !processingSettings.resize.maintainAspectRatio) {
      // Calcular y guardar la relación de aspecto actual
      if (processingSettings.resize.width && processingSettings.resize.height) {
        const newAspectRatio = processingSettings.resize.width / processingSettings.resize.height;
        if (newAspectRatio > 0 && isFinite(newAspectRatio)) {
          setAspectRatio(newAspectRatio);
        }
      }
    }
    
    // Si estamos actualizando el ancho o el alto y se debe mantener la proporción
    if (processingSettings.resize.maintainAspectRatio && 
        (settings.hasOwnProperty('width') || settings.hasOwnProperty('height'))) {
      
      const currentSettings = processingSettings.resize;
      // Usar la relación de aspecto guardada en el estado
      const currentAspectRatio = aspectRatio;
      
      // Si se actualizó el ancho, ajustar el alto
      if (settings.hasOwnProperty('width') && !settings.hasOwnProperty('height')) {
        const newWidth = settings.width;
        const newHeight = Math.round(newWidth / currentAspectRatio);
        
        setProcessingSettings(prev => ({
          ...prev,
          resize: {
            ...prev.resize,
            ...settings,
            height: newHeight
          }
        }));
        return;
      }
      
      // Si se actualizó el alto, ajustar el ancho
      if (settings.hasOwnProperty('height') && !settings.hasOwnProperty('width')) {
        const newHeight = settings.height;
        const newWidth = Math.round(newHeight * currentAspectRatio);
        
        setProcessingSettings(prev => ({
          ...prev,
          resize: {
            ...prev.resize,
            ...settings,
            width: newWidth
          }
        }));
        return;
      }
    }
    
    // Para otros casos (mantainAspectRatio=false o actualizando otras propiedades)
    setProcessingSettings(prev => ({
      ...prev,
      resize: {
        ...prev.resize,
        ...settings
      }
    }));
  };
  
  /**
   * Actualiza la configuración de recorte
   * @param {Object} settings - Nueva configuración
   */
  const updateCropSettings = (settings) => {
    setProcessingSettings(prev => ({
      ...prev,
      crop: {
        ...prev.crop,
        ...settings
      }
    }));
  };
  
  return {
    processedImages,
    processingSettings,
    processing,
    processImages,
    toggleOptimize,
    changeFormat,
    updateResizeSettings,
    updateCropSettings
  };
};

export default useImageProcessor;