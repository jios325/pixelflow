import React from 'react';
import { Popover, Button, Input, Typography, Space } from 'antd';
import { BgColorsOutlined } from '@ant-design/icons';

const { Text } = Typography;

/**
 * Componente selector de color con previsualización
 * @param {Object} props - Propiedades del componente
 * @param {string} props.value - Valor del color actual (hex)
 * @param {Function} props.onChange - Función llamada al cambiar el color
 * @param {string} props.label - Etiqueta descriptiva del color
 */
const ColorPicker = ({ value, onChange, label }) => {
  const handleChange = (e) => {
    const newColor = e.target.value;
    onChange(newColor);
  };

  const content = (
    <div style={{ padding: '8px' }}>
      <Space direction="vertical" size="small">
        <Text>{label}</Text>
        <Input 
          type="color"
          value={value}
          onChange={handleChange}
          style={{ width: 120, cursor: 'pointer' }}
        />
        <Input 
          value={value}
          onChange={handleChange}
          style={{ width: 120 }}
          placeholder="#000000"
        />
      </Space>
    </div>
  );

  return (
    <Popover 
      content={content} 
      trigger="click" 
      placement="bottomLeft"
      title={label}
    >
      <Button 
        type="default"
        icon={<BgColorsOutlined />}
        style={{ 
          backgroundColor: value,
          borderColor: value,
          color: getContrastColor(value),
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        {label}
      </Button>
    </Popover>
  );
};

/**
 * Determina si se debe usar texto claro u oscuro basado en el color de fondo
 * @param {string} hexColor - Color hexadecimal
 * @returns {string} - Color de texto (blanco o negro)
 */
function getContrastColor(hexColor) {
  // Convertir color hex a RGB
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  
  // Calcular luminancia
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Determinar color de texto basado en luminancia
  return luminance > 0.5 ? '#000000' : '#ffffff';
}

export default ColorPicker;
