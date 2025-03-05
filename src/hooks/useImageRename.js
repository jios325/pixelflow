import { useState, useEffect } from 'react';
import { getBaseName, getFileExtension } from '../utils/fileValidation';

/**
 * Hook personalizado para renombrar imágenes
 * @param {Array} processedImages - Lista de imágenes procesadas
 * @returns {Object} - Estado y funciones para renombrar imágenes
 */
const useImageRename = (processedImages) => {
  // Estado para almacenar las imágenes renombradas
  const [renamedImages, setRenamedImages] = useState([]);
  
  // Configuración de renombrado
  const [renameSettings, setRenameSettings] = useState({
    cleanText: true,
    mode: 'sequential', // sequential, addText, replaceText
    sequential: {
      prefix: 'IMG_',
      startNumber: 1,
      digits: 3
    },
    addText: {
      position: 'prefix', // prefix, suffix
      text: ''
    },
    replaceText: {
      search: '',
      replace: ''
    }
  });
  
  // Renombrar imágenes cuando cambia la lista de imágenes procesadas o la configuración
  useEffect(() => {
    if (!processedImages || processedImages.length === 0) {
      setRenamedImages([]);
      return;
    }
    
    console.log('Renombrando imágenes procesadas:', processedImages);
    
    // Función para limpiar texto (eliminar caracteres especiales)
    const cleanFileName = (name) => {
      if (!renameSettings.cleanText) return name;
      
      // Eliminar caracteres especiales y espacios
      return name
        .replace(/[^\w\s.-]/g, '')
        .replace(/\s+/g, '_')
        .toLowerCase();
    };
    
    // Función para renombrar secuencialmente
    const renameSequential = (index) => {
      const { prefix, startNumber, digits } = renameSettings.sequential;
      const number = startNumber + index;
      const paddedNumber = number.toString().padStart(digits, '0');
      return `${prefix}${paddedNumber}`;
    };
    
    // Función para añadir texto
    const addText = (name) => {
      const { position, text } = renameSettings.addText;
      if (!text) return name;
      
      return position === 'prefix' ? `${text}${name}` : `${name}${text}`;
    };
    
    // Función para reemplazar texto
    const replaceText = (name) => {
      const { search, replace } = renameSettings.replaceText;
      if (!search) return name;
      
      return name.replace(new RegExp(search, 'g'), replace);
    };
    
    // Aplicar renombrado según el modo seleccionado
    const renamed = processedImages.map((img, index) => {
      // Determinar la extensión correcta basada en el archivo procesado
      let extension;
      
      // Si el archivo fue procesado y tiene tipo MIME, usar esa información
      if (img.processedFile && img.processedFile.type) {
        const mimeType = img.processedFile.type.toLowerCase();
        if (mimeType.includes('jpeg') || mimeType.includes('jpg')) {
          extension = 'jpg';
        } else if (mimeType.includes('png')) {
          extension = 'png';
        } else if (mimeType.includes('webp')) {
          extension = 'webp';
        } else if (mimeType.includes('gif')) {
          extension = 'gif';
        } else {
          // Extraer extensión del tipo MIME
          extension = mimeType.split('/')[1] || getFileExtension(img.name);
        }
      } else {
        // Si no hay información de MIME, usar la extensión del nombre original
        extension = getFileExtension(img.newName || img.name);
      }
      
      console.log(`Determinando extensión para ${img.name}: MIME=${img.processedFile?.type}, extensión=${extension}`);
      
      let baseName = getBaseName(img.name);
      
      // Aplicar limpieza de texto si está habilitada
      baseName = cleanFileName(baseName);
      
      // Aplicar renombrado según el modo
      switch (renameSettings.mode) {
        case 'sequential':
          baseName = renameSequential(index);
          break;
        case 'addText':
          baseName = addText(baseName);
          break;
        case 'replaceText':
          baseName = replaceText(baseName);
          break;
        default:
          break;
      }
      
      // Construir el nuevo nombre completo
      const newName = `${baseName}.${extension}`;
      
      return {
        ...img,
        renamed: true,
        newName
      };
    });
    
    setRenamedImages(renamed);
  }, [processedImages, renameSettings]);
  
  /**
   * Activa/desactiva la limpieza de texto
   */
  const toggleCleanText = () => {
    setRenameSettings(prev => ({
      ...prev,
      cleanText: !prev.cleanText
    }));
  };
  
  /**
   * Cambia el modo de renombrado
   * @param {string} mode - Modo de renombrado (sequential, addText, replaceText)
   */
  const changeRenameMode = (mode) => {
    setRenameSettings(prev => ({
      ...prev,
      mode
    }));
  };
  
  /**
   * Actualiza la configuración de renombrado secuencial
   * @param {Object} settings - Nueva configuración
   */
  const updateSequentialSettings = (settings) => {
    setRenameSettings(prev => ({
      ...prev,
      sequential: {
        ...prev.sequential,
        ...settings
      }
    }));
  };
  
  /**
   * Actualiza la configuración de añadir texto
   * @param {Object} settings - Nueva configuración
   */
  const updateAddTextSettings = (settings) => {
    setRenameSettings(prev => ({
      ...prev,
      addText: {
        ...prev.addText,
        ...settings
      }
    }));
  };
  
  /**
   * Actualiza la configuración de reemplazar texto
   * @param {Object} settings - Nueva configuración
   */
  const updateReplaceTextSettings = (settings) => {
    setRenameSettings(prev => ({
      ...prev,
      replaceText: {
        ...prev.replaceText,
        ...settings
      }
    }));
  };
  
  return {
    renamedImages,
    renameSettings,
    toggleCleanText,
    changeRenameMode,
    updateSequentialSettings,
    updateAddTextSettings,
    updateReplaceTextSettings
  };
};

export default useImageRename; 