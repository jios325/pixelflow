import React from 'react';
import { Form, Input, Select, Space } from 'antd';

const { Option } = Select;

const AddTextRename = ({ addTextSettings, updateAddTextSettings, disabled }) => {
  const handleTextChange = (e) => {
    updateAddTextSettings({ text: e.target.value });
  };

  const handlePositionChange = (value) => {
    updateAddTextSettings({ position: value });
  };

  const positionOptions = [
    { value: 'prefix', label: 'Al inicio' },
    { value: 'suffix', label: 'Al final' }
  ];

  return (
    <div className="add-text-rename" style={{ marginLeft: '24px' }}>
      <Form layout="vertical">
        <Space style={{ width: '100%' }} align="start">
          <Form.Item label="Texto a agregar" style={{ marginBottom: '8px', width: '60%' }}>
            <Input
              value={addTextSettings.text}
              onChange={handleTextChange}
              placeholder="Texto a agregar"
              disabled={disabled}
            />
          </Form.Item>

          <Form.Item label="Posición" style={{ marginBottom: '8px' }}>
            <Select
              value={addTextSettings.position}
              onChange={handlePositionChange}
              disabled={disabled}
              style={{ width: '120px' }}
            >
              {positionOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Space>
      </Form>
    </div>
  );
};

export default AddTextRename; 