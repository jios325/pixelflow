import { useState } from 'react';
import { message } from 'antd';
import { getImagePreview } from '../utils/fileValidation';
import { createLowResPreview, estimateImageMemoryUsage } from '../utils/memoryManager';

/**
 * Hook personalizado para manejar la carga de imágenes
 * @returns {Object} - Estado y funciones para manejar imágenes
 */
const useImageUpload = () => {
  // Estado para almacenar las imágenes cargadas
  const [uploadedImages, setUploadedImages] = useState([]);
  // Estado para indicar si está cargando
  const [loading, setLoading] = useState(false);

  /**
   * Procesa las imágenes cargadas
   * @param {File[]} files - Lista de archivos de imagen
   */
  const handleUpload = async (files) => {
    if (!files || files.length === 0) return;
    
    setLoading(true);
    
    try {
      // Constantes para el procesamiento por lotes
      const BATCH_SIZE = 3; // Procesar 3 imágenes a la vez
      const TOTAL_BATCHES = Math.ceil(files.length / BATCH_SIZE);
      
      // Array para almacenar las nuevas imágenes procesadas
      const newImages = [];
      
      // Procesar imágenes en lotes para evitar problemas de memoria
      for (let batchIndex = 0; batchIndex < TOTAL_BATCHES; batchIndex++) {
        // Calcular el rango del lote actual
        const startIndex = batchIndex * BATCH_SIZE;
        const endIndex = Math.min(startIndex + BATCH_SIZE, files.length);
        const currentBatch = files.slice(startIndex, endIndex);
        
        // Mostrar progreso para archivos grandes
        if (files.length > 5) {
          message.loading({
            content: `Procesando imágenes ${startIndex + 1}-${endIndex} de ${files.length}...`,
            key: 'uploadProgress',
            duration: 0
          });
        }
        
        // Procesar cada imagen del lote actual
        const batchResults = await Promise.all(currentBatch.map(async (file, idx) => {
          try {
            // Identificador único para la imagen
            const id = `img-${Date.now()}-${startIndex + idx}`;
            
            // Comprobar si es una imagen grande (más de 10MB)
            const isLargeImage = file.size > 10 * 1024 * 1024;
            
            // Crear vista previa adecuada según el tamaño
            let preview;
            if (isLargeImage) {
              // Para imágenes grandes, crear una vista previa de baja resolución
              // para evitar problemas de memoria
              preview = await createLowResPreview(file);
            } else {
              // Para imágenes normales, usar la vista previa estándar
              preview = getImagePreview(file);
            }
            
            // Estimar el uso de memoria para alertar al usuario si es necesario
            const estimatedMemory = estimateImageMemoryUsage(file);
            const memoryWarning = estimatedMemory > 500 * 1024 * 1024; // Advertir si usa más de 500MB
            
            if (memoryWarning) {
              console.warn(`Imagen grande detectada: ${file.name}. Puede afectar al rendimiento.`);
            }
            
            // Crear objeto de imagen para el estado
            return {
              id,
              file,
              name: file.name,
              size: file.size,
              type: file.type,
              preview,
              originalName: file.name,
              isLargeImage, // Marcar imágenes grandes para tratamiento especial
            };
          } catch (error) {
            console.error(`Error al procesar la imagen ${file.name}:`, error);
            return null; // Devolver null para las imágenes con error
          }
        }));
        
        // Filtrar cualquier resultado nulo (imágenes con errores)
        const validResults = batchResults.filter(Boolean);
        newImages.push(...validResults);
        
        // Dar tiempo al navegador para actualizarse
        await new Promise(resolve => setTimeout(resolve, 10));
      }
      
      // Actualizar el estado con todas las imágenes procesadas
      // IMPORTANTE: Aquí REEMPLAZAMOS las imágenes anteriores en lugar de agregar a las existentes
      setUploadedImages(newImages);
      
      // Mostrar mensaje de éxito
      message.success({
        content: `${newImages.length} imágenes cargadas correctamente`,
        key: 'uploadProgress'
      });
    } catch (error) {
      console.error('Error al cargar imágenes:', error);
      message.error('Error al cargar las imágenes');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Elimina una imagen de la lista
   * @param {string} id - ID de la imagen a eliminar
   */
  const removeImage = (id) => {
    // Buscar la imagen a eliminar
    const imageToRemove = uploadedImages.find(img => img.id === id);
    
    // Liberar recursos si existe
    if (imageToRemove && imageToRemove.preview && !imageToRemove.isLargeImage) {
      // Solo revocar URL si no es una imagen grande (vista previa de baja resolución)
      try {
        URL.revokeObjectURL(imageToRemove.preview);
      } catch (error) {
        console.error('Error al liberar URL de vista previa:', error);
      }
    }
    
    // Eliminar la imagen del estado
    setUploadedImages(prev => prev.filter(img => img.id !== id));
  };

  /**
   * Limpia todas las imágenes
   */
  const clearImages = () => {
    // Liberar recursos de URLs de objeto
    uploadedImages.forEach(img => {
      if (img.preview && !img.isLargeImage) {
        try {
          URL.revokeObjectURL(img.preview);
        } catch (error) {
          console.error('Error al liberar URL de vista previa:', error);
        }
      }
    });
    
    // Limpiar el estado
    setUploadedImages([]);
  };

  return {
    uploadedImages,
    loading,
    handleUpload,
    removeImage,
    clearImages
  };
};

export default useImageUpload; 