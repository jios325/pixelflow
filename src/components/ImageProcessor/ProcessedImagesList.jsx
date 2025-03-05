import React from 'react';
import { Row, Col, Card, Typography, Spin, Empty, Tooltip } from 'antd';
import { FileImageOutlined } from '@ant-design/icons';
import { formatFileSize, getFileExtension } from '../../utils/fileValidation';

const { Text } = Typography;

/**
 * Componente que muestra la lista de imágenes procesadas
 * @param {Object} props - Propiedades del componente
 * @param {Array} props.images - Lista de imágenes procesadas
 * @param {boolean} props.loading - Estado de carga
 */
const ProcessedImagesList = ({ images = [], loading = false }) => {
  // Función para detectar el formato real de la imagen procesada
  const detectRealFormat = (image) => {
    if (!image) return 'Unknown';
    
    // Verificar si tenemos un archivo procesado con tipo MIME
    if (image.processedFile && image.processedFile.type) {
      const mimeType = image.processedFile.type.toLowerCase();
      if (mimeType.includes('jpeg') || mimeType.includes('jpg')) return 'JPG';
      if (mimeType.includes('png')) return 'PNG';
      if (mimeType.includes('webp')) return 'WEBP';
      if (mimeType.includes('gif')) return 'GIF';
      return mimeType.split('/')[1]?.toUpperCase() || 'Unknown';
    }
    
    // Si no hay archivo procesado, usar la extensión del nombre
    const name = image.newName || image.name || '';
    const ext = getFileExtension(name).toLowerCase();
    
    switch(ext) {
      case 'jpg':
      case 'jpeg':
        return 'JPG';
      case 'png':
        return 'PNG';
      case 'webp':
        return 'WEBP';
      case 'gif':
        return 'GIF';
      default:
        return ext.toUpperCase() || 'Unknown';
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <Spin size="large" />
        <Text style={{ display: 'block', marginTop: '16px' }}>
          Procesando imágenes...
        </Text>
      </div>
    );
  }

  if (!images || images.length === 0) {
    return (
      <Empty 
        description="No hay imágenes procesadas" 
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        style={{ margin: '40px 0' }}
      />
    );
  }
  
  // En caso de que alguna imagen no tenga id o esté corrupta
  const validImages = images.filter(img => img && img.id);

  return (
    <Row gutter={[16, 16]}>
      {validImages.map((image) => (
        <Col xs={24} sm={12} md={8} lg={6} key={image.id}>
          <Card
            hoverable
            cover={
              <div style={{ 
                height: '160px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                overflow: 'hidden',
                background: '#f5f5f5'
              }}>
                <img
                  alt={image.newName || image.name}
                  src={image.processedPreview || image.preview}
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: '100%', 
                    objectFit: 'contain' 
                  }}
                />
              </div>
            }
            bodyStyle={{ padding: '12px' }}
          >
            <Tooltip title={image.newName || image.name}>
              <Text ellipsis style={{ display: 'block', fontWeight: 'bold' }}>
                {image.newName || image.name}
              </Text>
            </Tooltip>
            <Text type="secondary" style={{ fontSize: '12px', display: 'block' }}>
              {image.formattedProcessedSize || formatFileSize(image.size)}
            </Text>
            {image.fileChanged && image.optimization && (
              <Text type="success" style={{ fontSize: '12px', display: 'block' }}>
                ↓ {image.optimization.reductionPercent}% ({formatFileSize(image.optimization.reduction)})
              </Text>
            )}
            
            {/* Mostrar explícitamente el formato del archivo */}
            <Text type="secondary" style={{ fontSize: '11px', display: 'block', marginTop: '4px' }}>
              Formato: <Text strong style={{ fontSize: '11px', color: '#1890ff' }}>
                {detectRealFormat(image)}
              </Text>
            </Text>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default ProcessedImagesList;