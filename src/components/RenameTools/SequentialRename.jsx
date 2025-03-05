import React from 'react';
import { Form, Input, InputNumber, Select, Space } from 'antd';

const { Option } = Select;

const SequentialRename = ({ sequentialSettings, updateSequentialSettings, disabled }) => {
  const handlePrefixChange = (e) => {
    updateSequentialSettings({ prefix: e.target.value });
  };

  const handleSuffixChange = (e) => {
    updateSequentialSettings({ suffix: e.target.value });
  };

  const handlePositionChange = (value) => {
    updateSequentialSettings({ position: value });
  };

  const handleSeparatorChange = (value) => {
    updateSequentialSettings({ separator: value });
  };

  const handleDigitsChange = (value) => {
    updateSequentialSettings({ digits: value });
  };

  const handleStartNumberChange = (value) => {
    updateSequentialSettings({ startNumber: value });
  };

  const positionOptions = [
    { value: 'prefix', label: 'Prefijo' },
    { value: 'suffix', label: 'Sufijo' }
  ];

  const separatorOptions = [
    { value: '_', label: 'Guión bajo (_)' },
    { value: '-', label: 'Guión (-)' },
    { value: '.', label: 'Punto (.)' },
    { value: '', label: 'Ninguno' }
  ];

  return (
    <div className="sequential-rename" style={{ marginLeft: '24px' }}>
      <Form layout="vertical">
        <Space style={{ width: '100%' }} wrap>
          <Form.Item label="Prefijo" style={{ marginBottom: '8px' }}>
            <Input
              value={sequentialSettings.prefix}
              onChange={handlePrefixChange}
              placeholder="Prefijo"
              disabled={disabled}
              style={{ width: '120px' }}
            />
          </Form.Item>

          <Form.Item label="Sufijo" style={{ marginBottom: '8px' }}>
            <Input
              value={sequentialSettings.suffix}
              onChange={handleSuffixChange}
              placeholder="Sufijo"
              disabled={disabled}
              style={{ width: '120px' }}
            />
          </Form.Item>

          <Form.Item label="Posición del número" style={{ marginBottom: '8px' }}>
            <Select
              value={sequentialSettings.position}
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

          <Form.Item label="Separador" style={{ marginBottom: '8px' }}>
            <Select
              value={sequentialSettings.separator}
              onChange={handleSeparatorChange}
              disabled={disabled}
              style={{ width: '120px' }}
            >
              {separatorOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Dígitos" style={{ marginBottom: '8px' }}>
            <InputNumber
              min={1}
              max={10}
              value={sequentialSettings.digits}
              onChange={handleDigitsChange}
              disabled={disabled}
              style={{ width: '80px' }}
            />
          </Form.Item>

          <Form.Item label="Número inicial" style={{ marginBottom: '8px' }}>
            <InputNumber
              min={0}
              value={sequentialSettings.startNumber}
              onChange={handleStartNumberChange}
              disabled={disabled}
              style={{ width: '80px' }}
            />
          </Form.Item>
        </Space>
      </Form>
    </div>
  );
};

export default SequentialRename; 