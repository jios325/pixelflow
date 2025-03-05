import React, { useState } from 'react';
import { Button, message } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import JSZip from 'jszip';
import { useBrand } from '../context/BrandContext';

/**
 * Componente que muestra un botón para descargar imágenes procesadas
 * @param {Object} props - Propiedades del componente
 * @param {Array} props.images - Lista de imágenes a descargar
 * @param {boolean} props.loading - Estado de carga
 */
const DownloadButton = ({ images = [], loading = false }) => {
  // Acceder al contexto de marca
  const { brandSettings } = useBrand();
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (images.length === 0) {
      message.warning('No hay imágenes para descargar');
      return;
    }

    setDownloading(true);
    
    try {
      const zip = new JSZip();
      
      // Constantes para el procesamiento por lotes
      const BATCH_SIZE = 5; // Procesar 5 imágenes a la vez
      const TOTAL_BATCHES = Math.ceil(images.length / BATCH_SIZE);
      
      // Procesar imágenes en lotes para evitar bloquear el navegador
      for (let batchIndex = 0; batchIndex < TOTAL_BATCHES; batchIndex++) {
        // Calcular el rango del lote actual
        const startIndex = batchIndex * BATCH_SIZE;
        const endIndex = Math.min(startIndex + BATCH_SIZE, images.length);
        const currentBatch = images.slice(startIndex, endIndex);
        
        // Mostrar progreso
        message.loading({
          content: `Preparando lote ${batchIndex + 1} de ${TOTAL_BATCHES}...`,
          key: 'downloadProgress',
          duration: 0
        });
        
        // Procesar cada imagen del lote actual
        await Promise.all(currentBatch.map(async (image) => {
          try {
            // Obtener el blob de la imagen procesada o original
            let blob;
            
            if (image.processedFile) {
              // Si tenemos un archivo procesado, usarlo directamente
              blob = image.processedFile;
            } else {
              // Si no hay archivo procesado, obtener el blob desde la vista previa
              const response = await fetch(image.processedPreview || image.preview);
              blob = await response.blob();
            }
            
            // Usar el nombre renombrado si existe, o el nombre original
            const fileName = image.newName || image.name;
            console.log(`Preparando archivo para descargar: ${fileName}`);
            
            // Añadir el archivo al zip
            zip.file(fileName, blob);
          } catch (error) {
            console.error(`Error al procesar la imagen ${image.name}:`, error);
          }
        }));
        
        // Dar tiempo al navegador para actualizarse
        await new Promise(resolve => setTimeout(resolve, 10));
      }
      
      // Actualizar mensaje
      message.loading({
        content: 'Generando archivo ZIP...',
        key: 'downloadProgress',
        duration: 0
      });
      
      // Generar el archivo zip con compresión optimizada para imágenes
      const content = await zip.generateAsync({ 
        type: 'blob',
        compression: 'STORE' // 'STORE' es más rápido y las imágenes ya están comprimidas
      });
      
      // Crear un enlace de descarga
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${brandSettings.appName.toLowerCase()}_images_${new Date().getTime()}.zip`;
      
      // Simular clic para iniciar la descarga
      document.body.appendChild(link);
      link.click();
      
      // Limpiar
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      message.success({
        content: `${images.length} imágenes descargadas correctamente`,
        key: 'downloadProgress'
      });
    } catch (error) {
      console.error('Error al descargar imágenes:', error);
      message.error({
        content: 'Error al descargar las imágenes',
        key: 'downloadProgress'
      });
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Button
      type="primary"
      icon={<DownloadOutlined />}
      onClick={handleDownload}
      loading={downloading}
      disabled={loading || images.length === 0}
      style={{ 
        backgroundColor: brandSettings.colors.primary, 
        borderColor: brandSettings.colors.primary,
        boxShadow: `0 2px 0 ${brandSettings.colors.primary}20`
      }}
    >
      Descargar
    </Button>
  );
};

export default DownloadButton; 