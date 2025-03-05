import React from 'react';
import { List, Avatar, Button, Typography, Space, Tooltip } from 'antd';
import { DeleteOutlined, FileImageOutlined } from '@ant-design/icons';
import { formatFileSize } from '../../utils/fileValidation';

const { Text } = Typography;

/**
 * Componente que muestra la lista de imágenes cargadas
 * @param {Object} props - Propiedades del componente
 * @param {Array} props.images - Lista de imágenes cargadas
 * @param {Function} props.onRemove - Función para eliminar una imagen
 */
const UploadedImagesList = ({ images = [], onRemove }) => {
  if (!images || images.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <Text type="secondary">No hay imágenes cargadas</Text>
      </div>
    );
  }

  return (
    <List
      itemLayout="horizontal"
      dataSource={images}
      renderItem={(image) => (
        <List.Item
          key={image.id}
          actions={[
            <Tooltip title="Eliminar imagen">
              <Button 
                icon={<DeleteOutlined />} 
                danger 
                size="small"
                onClick={() => onRemove(image.id)}
                shape="circle"
              />
            </Tooltip>
          ]}
        >
          <List.Item.Meta
            avatar={
              <Avatar 
                src={image.preview} 
                shape="square" 
                size={40}
                icon={<FileImageOutlined />}
              />
            }
            title={
              <Tooltip title={image.name}>
                <Text ellipsis style={{ maxWidth: '100%' }}>
                  {image.name}
                </Text>
              </Tooltip>
            }
            description={
              <Space direction="vertical" size={0}>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  {formatFileSize(image.size)}
                </Text>
              </Space>
            }
          />
        </List.Item>
      )}
      style={{ 
        maxHeight: '300px', 
        overflowY: 'auto',
        overflowX: 'hidden'
      }}
    />
  );
};

export default UploadedImagesList; 