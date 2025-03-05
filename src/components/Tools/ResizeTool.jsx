import React, { useState, useEffect } from 'react';
import { Form, InputNumber, Switch, Typography, Space, Select } from 'antd';
import { ExpandOutlined } from '@ant-design/icons';

const { Text } = Typography;
const { Option } = Select;

/**
 * Componente para controlar el redimensionamiento de imágenes
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.resizeSettings - Configuración de redimensionamiento
 * @param {Function} props.updateResizeSettings - Función para actualizar configuración
 * @param {boolean} props.disabled - Estado de deshabilitado
 */
const ResizeTool = ({ resizeSettings, updateResizeSettings, disabled }) => {
  // Estado para mantener el valor de dimensión único
  const [sizeValue, setSizeValue] = useState(resizeSettings.width || 800);
  
  // Inicializar valores si cambia la configuración externa
  useEffect(() => {
    if (resizeSettings.width) {
      setSizeValue(resizeSettings.width);
    }
  }, [resizeSettings.width]);

  // Manejador para activar/desactivar redimensionamiento
  const handleEnableChange = (checked) => {
    updateResizeSettings({ 
      enabled: checked,
      // Siempre mantener la proporción activada
      maintainAspectRatio: true
    });
  };

  // Manejador para el cambio de valor de redimensionamiento
  const handleSizeChange = (value) => {
    if (!value) return;
    
    setSizeValue(value);
    
    // Actualizar el ancho y calcular la altura proporcionalmente
    updateResizeSettings({ width: value });
  };

  // Manejador para el cambio de unidad (px o %)
  const handleUnitChange = (value) => {
    updateResizeSettings({ unit: value });
  };

  return (
    <div className="resize-tool">
      {/* Título y switch para activar/desactivar */}
      <Form.Item label="Redimensión" style={{ marginBottom: '8px' }}>
        <Space>
          <Switch
            checked={resizeSettings.enabled}
            onChange={handleEnableChange}
            disabled={disabled}
            style={{ backgroundColor: resizeSettings.enabled ? '#a855f7' : undefined }}
          />
          <Text type="secondary" style={{ marginLeft: '8px', fontSize: '12px' }}>
            {resizeSettings.enabled ? 'Activado' : 'Desactivado'}
          </Text>
        </Space>
      </Form.Item>
      
      {/* Campos de redimensionamiento visibles solo cuando está habilitado */}
      {resizeSettings.enabled && (
        <div style={{ marginLeft: '24px' }}>
          <Text type="secondary" style={{ fontSize: '13px', display: 'block', marginBottom: '8px' }}>
            La base de la medida es el ancho
          </Text>
          
          <Space align="start">
            <Select
              value={resizeSettings.unit || 'px'}
              onChange={handleUnitChange}
              disabled={disabled}
              style={{ width: '100px' }}
            >
              <Option value="px">Píxeles</Option>
              <Option value="%">Porcentaje</Option>
            </Select>
            
            <InputNumber
              min={1}
              max={resizeSettings.unit === '%' ? 100 : 5000}
              value={sizeValue}
              onChange={handleSizeChange}
              disabled={disabled}
              style={{ width: '100px' }}
              addonAfter={resizeSettings.unit || 'px'}
            />
          </Space>
          
          {/* Switch para mantener proporción - siempre activado pero visible */}
          <div style={{ marginTop: '8px' }}>
            <Switch
              checked={resizeSettings.maintainAspectRatio}
              onChange={(checked) => updateResizeSettings({ maintainAspectRatio: checked })}
              disabled={true} // Siempre deshabilitado para mantener forzosamente la proporción
              style={{ backgroundColor: resizeSettings.maintainAspectRatio ? '#a855f7' : undefined }}
            />
            <Text type="secondary" style={{ marginLeft: '8px', fontSize: '12px' }}>
              Mantener proporción
            </Text>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResizeTool;