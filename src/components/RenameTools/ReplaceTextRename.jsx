import React from 'react';
import { Form, Input, Space } from 'antd';

const ReplaceTextRename = ({ replaceTextSettings, updateReplaceTextSettings, disabled }) => {
  const handleSearchChange = (e) => {
    updateReplaceTextSettings({ search: e.target.value });
  };

  const handleReplaceChange = (e) => {
    updateReplaceTextSettings({ replace: e.target.value });
  };

  return (
    <div className="replace-text-rename" style={{ marginLeft: '24px' }}>
      <Form layout="vertical">
        <Space style={{ width: '100%' }} direction="vertical" size="small">
          <Form.Item label="Buscar texto" style={{ marginBottom: '8px' }}>
            <Input
              value={replaceTextSettings.search}
              onChange={handleSearchChange}
              placeholder="Texto a buscar"
              disabled={disabled}
            />
          </Form.Item>

          <Form.Item label="Reemplazar con" style={{ marginBottom: '8px' }}>
            <Input
              value={replaceTextSettings.replace}
              onChange={handleReplaceChange}
              placeholder="Texto de reemplazo"
              disabled={disabled}
            />
          </Form.Item>
        </Space>
      </Form>
    </div>
  );
};

export default ReplaceTextRename; 