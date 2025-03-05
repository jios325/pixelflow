import React from 'react';
import { Upload, Typography, Alert } from 'antd';
import { InboxOutlined, WarningOutlined } from '@ant-design/icons';
import { isImageFile, validateFileSize } from '../../utils/fileValidation';
import { useBrand } from '../../context/BrandContext';
import { estimateImageMemoryUsage } from '../../utils/memoryManager';

const { Dragger } = Upload;
const { Text, Title } = Typography;

/**
 * Componente de área de carga de imágenes
 * @param {Object} props - Propiedades del componente
 * @param {Function} props.onUpload - Función para manejar la carga de imágenes
 * @param {boolean} props.loading - Estado de carga
 * @param {number} props.maxCount - Número máximo de archivos permitidos
 */
const UploadArea = ({ onUpload, loading = false, maxCount = 50 }) => {
  // Acceder al contexto de marca
  const { brandSettings } = useBrand();
  
  // Estado para advertencias de archivos grandes
  const [showLargeFileWarning, setShowLargeFileWarning] = React.useState(false);
  // Validación antes de cargar
  const beforeUpload = (file) => {
    // Verificar si es una imagen
    if (!isImageFile(file)) {
      return {
        error: true,
        message: 'Solo se permiten archivos de imagen (JPG, PNG, GIF, WEBP)'
      };
    }
    
    // Verificar tamaño (máximo 60MB)
    const sizeValidation = validateFileSize(file, 60);
    if (!sizeValidation.valid) {
      return {
        error: true,
        message: sizeValidation.message
      };
    }
    
    return true;
  };
  
  // Manejar cambio en la lista de archivos
  const handleChange = (info) => {
    // Solo procesar cuando la carga esté completa
    if (info.file.status === 'done') {
      // Obtener solo los archivos nuevos sin duplicar
      const newFiles = [];
      const fileMap = new Map();
      
      // Mapear los archivos por nombre para detectar duplicados
      info.fileList.forEach(fileItem => {
        if (fileItem.originFileObj && !fileMap.has(fileItem.name)) {
          fileMap.set(fileItem.name, fileItem.originFileObj);
          newFiles.push(fileItem.originFileObj);
        }
      });
      
      // Comprobar si hay archivos grandes
      const hasLargeFiles = newFiles.some(file => file.size > 30 * 1024 * 1024); // Advertir si > 30MB
      setShowLargeFileWarning(hasLargeFiles);
      
      if (newFiles.length > 0) {
        onUpload(newFiles);
      }
    }
  };
  
  // Función personalizada para simular carga exitosa sin enviar al servidor
  const customRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess("ok", null);
    }, 0);
  };
  
  return (
    <>
      {showLargeFileWarning && (
        <Alert
          message="Archivos grandes detectados"
          description="Algunos archivos son muy grandes (más de 30MB). El procesamiento puede ser más lento. Se han creado vistas previas optimizadas para mejorar el rendimiento."
          type="warning"
          showIcon
          icon={<WarningOutlined />}
          style={{ marginBottom: '16px' }}
          closable
          onClose={() => setShowLargeFileWarning(false)}
        />
      )}
      <Dragger
      name="images"
      multiple
      maxCount={maxCount}
      beforeUpload={beforeUpload}
      onChange={handleChange}
      customRequest={customRequest}
      showUploadList={false}
      disabled={loading}
      style={{
        padding: '20px',
        background: '#fafafa',
        border: '2px dashed #d9d9d9',
        borderRadius: '8px',
        transition: 'border-color 0.3s',
      }}
    >
      <p className="ant-upload-drag-icon">
        <InboxOutlined style={{ color: brandSettings.colors.primary, fontSize: '48px' }} />
      </p>
      <Title level={4} style={{ color: brandSettings.colors.primary }}>
        Arrastra tus imágenes aquí
      </Title>
      <Text type="secondary">
        Soporta JPG, PNG, GIF y WEBP hasta 60MB
      </Text>
      <br />
      <Text type="secondary">
        O <Text strong style={{ color: brandSettings.colors.primary }}>haz clic para seleccionar</Text>
      </Text>
    </Dragger>
    </>
  );
};

export default UploadArea; 