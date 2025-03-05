import React, { useEffect } from 'react';
import { Form, Switch, Typography, Space, Select } from 'antd';
import { ScissorOutlined } from '@ant-design/icons';

const { Text } = Typography;
const { Option } = Select;

const CropTool = ({ cropSettings, updateCropSettings, disabled }) => {
  // Definiciones de las opciones de recorte
  const cropTypeOptions = [
    { value: 'square', label: 'Cuadrado (1:1)' },
    { value: 'horizontal-16-9', label: 'Horizontal (16:9)' },
    { value: 'horizontal-4-3', label: 'Horizontal (4:3)' },
    { value: 'vertical-9-16', label: 'Vertical (9:16)' },
    { value: 'vertical-3-4', label: 'Vertical (3:4)' }
  ];
  
  const cropPositionOptions = [
    { value: 'center', label: 'Centro (default)' },
    { value: 'top-left', label: 'Superior izquierda' },
    { value: 'top-center', label: 'Superior central' },
    { value: 'top-right', label: 'Superior derecha' },
    { value: 'center-left', label: 'Centro izquierda' },
    { value: 'center-right', label: 'Centro derecha' },
    { value: 'bottom-left', label: 'Inferior izquierda' },
    { value: 'bottom-center', label: 'Inferior central' },
    { value: 'bottom-right', label: 'Inferior derecha' }
  ];
  const handleEnableChange = (checked) => {
    updateCropSettings({ enabled: checked });
  };

  // Manejar cambio de tipo de recorte
  const handleCropTypeChange = (value) => {
    let newWidth, newHeight;
    
    // Establecer dimensiones según el tipo seleccionado
    switch(value) {
      case 'square':
        newWidth = 1000;
        newHeight = 1000;
        break;
      case 'horizontal-16-9':
        newWidth = 1600;
        newHeight = 900;
        break;
      case 'horizontal-4-3':
        newWidth = 1200;
        newHeight = 900;
        break;
      case 'vertical-9-16':
        newWidth = 900;
        newHeight = 1600;
        break;
      case 'vertical-3-4':
        newWidth = 900;
        newHeight = 1200;
        break;
      default:
        newWidth = 1000;
        newHeight = 1000;
    }
    
    console.log(`Cambiando tipo de recorte a: ${value}, dimensiones: ${newWidth}x${newHeight}`);
    
    // Actualizamos primero el tipo, luego las dimensiones para asegurar la consistencia
    updateCropSettings({ 
      cropType: value,
      width: newWidth,
      height: newHeight
    });
  };

  // Manejar cambio de posición de recorte
  const handleCropPositionChange = (value) => {
    updateCropSettings({ position: value });
  };
  
  // Asegurarse de que cropSettings tiene las propiedades necesarias
  useEffect(() => {
    // Si no hay tipo o posición definida, establece valores predeterminados
    if (!cropSettings.cropType || !cropSettings.position) {
      const updates = {};
      
      if (!cropSettings.cropType) {
        updates.cropType = 'square';
      }
      
      if (!cropSettings.position) {
        updates.position = 'center';
      }
      
      if (Object.keys(updates).length > 0) {
        updateCropSettings(updates);
      }
    }
  }, [cropSettings, updateCropSettings]);

  return (
    <div className="tool-item">
      <Space align="center" style={{ marginBottom: '8px' }}>
        <Switch
          checked={cropSettings.enabled}
          onChange={handleEnableChange}
          disabled={disabled}
          style={{ backgroundColor: cropSettings.enabled ? '#a855f7' : undefined }}
        />
        <Text strong style={{ color: '#a855f7' }}>
          <ScissorOutlined style={{ marginRight: '8px' }} />
          Corte de imagen
        </Text>
      </Space>

      <Form layout="vertical" style={{ marginLeft: '44px', marginBottom: 0 }}>
        <Form.Item label="Tipo de recorte" style={{ marginBottom: '8px' }}>
          <Select
            value={cropSettings.cropType || 'square'}
            onChange={handleCropTypeChange}
            disabled={disabled || !cropSettings.enabled}
            style={{ width: '100%' }}
          >
            {cropTypeOptions.map(option => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Posición de recorte" style={{ marginBottom: '4px' }}>
          <Select
            value={cropSettings.position || 'center'}
            onChange={handleCropPositionChange}
            disabled={disabled || !cropSettings.enabled}
            style={{ width: '100%' }}
          >
            {cropPositionOptions.map(option => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
      
      <Text type="secondary" style={{ display: 'block', fontSize: '12px', marginLeft: '44px' }}>
        Define el tamaño y la posición del recorte
      </Text>
    </div>
  );
};

export default CropTool; 