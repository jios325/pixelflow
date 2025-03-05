import React from 'react';
import { Radio, Space, Typography } from 'antd';
import { NumberOutlined, PlusOutlined, SwapOutlined } from '@ant-design/icons';

const { Text } = Typography;

const RenameOptions = ({ selectedMode, onChange, disabled }) => {
  const renameOptions = [
    { 
      value: 'sequential', 
      label: 'Secuencial', 
      icon: <NumberOutlined />,
      description: 'Renombra archivos con una secuencia numérica'
    },
    { 
      value: 'addText', 
      label: 'Agregar texto', 
      icon: <PlusOutlined />,
      description: 'Agrega texto al principio o final del nombre'
    },
    { 
      value: 'replaceText', 
      label: 'Reemplazar texto', 
      icon: <SwapOutlined />,
      description: 'Busca y reemplaza texto en el nombre'
    }
  ];

  return (
    <div className="rename-options">
      <Text strong style={{ display: 'block', marginBottom: '8px' }}>
        Modo de renombrado
      </Text>
      
      <Radio.Group 
        value={selectedMode} 
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          {renameOptions.map(option => (
            <Radio key={option.value} value={option.value} style={{ display: 'flex', alignItems: 'flex-start' }}>
              <Space direction="vertical" size={0}>
                <Text>
                  {option.icon} {option.label}
                </Text>
                <Text type="secondary" style={{ fontSize: '12px', marginLeft: '24px' }}>
                  {option.description}
                </Text>
              </Space>
            </Radio>
          ))}
        </Space>
      </Radio.Group>
    </div>
  );
};

export default RenameOptions; 