import React from 'react';
import { Switch, Typography, Space } from 'antd';
import { CompressOutlined } from '@ant-design/icons';

const { Text } = Typography;

const OptimizeTool = ({ optimizeEnabled, toggleOptimize, disabled }) => {
  return (
    <div className="tool-item">
      <Space align="center">
        <Switch
          checked={optimizeEnabled}
          onChange={toggleOptimize}
          disabled={disabled}
          style={{ backgroundColor: optimizeEnabled ? '#a855f7' : undefined }}
        />
        <Text strong style={{ color: '#a855f7' }}>
          <CompressOutlined style={{ marginRight: '8px' }} />
          Optimizar
        </Text>
      </Space>
      <Text type="secondary" style={{ display: 'block', fontSize: '12px', marginLeft: '44px' }}>
        Reduce el tamaño de las imágenes manteniendo una buena calidad
      </Text>
    </div>
  );
};

export default OptimizeTool; 