import React from 'react';
import { Form, Select, Typography, Space } from 'antd';
import { FileImageOutlined } from '@ant-design/icons';

const { Text } = Typography;
const { Option } = Select;

const FormatTool = ({ format, changeFormat, disabled }) => {
  const formatOptions = [
    { value: 'jpeg', label: 'JPG' },
    { value: 'png', label: 'PNG' },
    { value: 'webp', label: 'WEBP' },
    { value: 'gif', label: 'GIF' }
  ];

  return (
    <div className="tool-item">
      <Form layout="vertical" style={{ marginBottom: 0 }}>
        <Form.Item 
          label={
            <Text strong style={{ color: '#a855f7' }}>
              <FileImageOutlined style={{ marginRight: '8px' }} />
              Formato
            </Text>
          }
          style={{ marginBottom: '4px' }}
        >
          <Select
            value={format}
            onChange={changeFormat}
            style={{ width: '100%', borderRadius: '6px' }}
            disabled={disabled}
          >
            {formatOptions.map(option => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Text type="secondary" style={{ display: 'block', fontSize: '12px' }}>
          Selecciona el formato de salida para tus imágenes
        </Text>
      </Form>
    </div>
  );
};

export default FormatTool; 