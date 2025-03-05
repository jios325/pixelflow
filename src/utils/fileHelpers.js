import { saveAs } from 'file-saver';
import JSZip from 'jszip';

// Función para formatear el tamaño de archivo en KB, MB, etc.
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Función para validar si un archivo es una imagen
export const isImageFile = (file) => {
  const acceptedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/bmp', 'image/tiff'];
  return file && acceptedTypes.includes(file.type);
};

// Función para descargar una imagen individual
export const downloadImage = (image) => {
  saveAs(image.processedFile || image.originalFile, image.name);
};

// Función para descargar múltiples imágenes como un archivo ZIP
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

// Función para obtener la extensión de un archivo
export const getFileExtension = (filename) => {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
};

// Función para obtener el nombre base de un archivo (sin extensión)
export const getBaseName = (filename) => {
  return filename.substring(0, filename.lastIndexOf('.')) || filename;
};

// Función para validar el tamaño máximo de un archivo
export const validateFileSize = (file, maxSizeMB = 10) => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

// Función para validar las dimensiones de una imagen
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

// Función para obtener las dimensiones de una imagen
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