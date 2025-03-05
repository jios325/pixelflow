import React from 'react';
import { Card, Form, Switch, Radio, Input, InputNumber, Space, Divider, Typography } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { useBrand } from '../../context/BrandContext';

const { Text } = Typography;

/**
 * Componente que muestra el panel de herramientas de renombrado
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.renameSettings - Configuración de renombrado
 * @param {Function} props.toggleCleanText - Función para activar/desactivar limpieza de texto
 * @param {Function} props.changeRenameMode - Función para cambiar modo de renombrado
 * @param {Function} props.updateSequentialSettings - Función para actualizar configuración de renombrado secuencial
 * @param {Function} props.updateAddTextSettings - Función para actualizar configuración de añadir texto
 * @param {Function} props.updateReplaceTextSettings - Función para actualizar configuración de reemplazar texto
 * @param {boolean} props.disabled - Estado de deshabilitado
 */
const RenamePanel = ({
  renameSettings,
  toggleCleanText,
  changeRenameMode,
  updateSequentialSettings,
  updateAddTextSettings,
  updateReplaceTextSettings,
  disabled = false
}) => {
  // Acceder al contexto de marca
  const { brandSettings } = useBrand();

  const renderModeSettings = () => {
    switch (renameSettings.mode) {
      case 'sequential':
        return (
          <Space direction="vertical" style={{ width: '100%' }}>
            <Form.Item label="Prefijo" style={{ marginBottom: '8px' }}>
              <Input
                value={renameSettings.sequential.prefix}
                onChange={(e) => updateSequentialSettings({ prefix: e.target.value })}
                placeholder="Prefijo (ej: IMG_)"
                disabled={disabled}
              />
            </Form.Item>
            <Space>
              <Form.Item label="Número inicial" style={{ marginBottom: '8px' }}>
                <InputNumber
                  min={0}
                  value={renameSettings.sequential.startNumber}
                  onChange={(value) => updateSequentialSettings({ startNumber: value })}
                  disabled={disabled}
                  style={{ width: '100px' }}
                />
              </Form.Item>
              <Form.Item label="Dígitos" style={{ marginBottom: '8px' }}>
                <InputNumber
                  min={1}
                  max={10}
                  value={renameSettings.sequential.digits}
                  onChange={(value) => updateSequentialSettings({ digits: value })}
                  disabled={disabled}
                  style={{ width: '80px' }}
                />
              </Form.Item>
            </Space>
          </Space>
        );
      
      case 'addText':
        return (
          <Space direction="vertical" style={{ width: '100%' }}>
            <Form.Item label="Texto a añadir" style={{ marginBottom: '8px' }}>
              <Input
                value={renameSettings.addText.text}
                onChange={(e) => updateAddTextSettings({ text: e.target.value })}
                placeholder="Texto a añadir"
                disabled={disabled}
              />
            </Form.Item>
            <Form.Item label="Posición" style={{ marginBottom: '8px' }}>
              <Radio.Group
                value={renameSettings.addText.position}
                onChange={(e) => updateAddTextSettings({ position: e.target.value })}
                disabled={disabled}
              >
                <Radio value="prefix">Al inicio</Radio>
                <Radio value="suffix">Al final</Radio>
              </Radio.Group>
            </Form.Item>
          </Space>
        );
      
      case 'replaceText':
        return (
          <Space direction="vertical" style={{ width: '100%' }}>
            <Form.Item label="Buscar" style={{ marginBottom: '8px' }}>
              <Input
                value={renameSettings.replaceText.search}
                onChange={(e) => updateReplaceTextSettings({ search: e.target.value })}
                placeholder="Texto a buscar"
                disabled={disabled}
              />
            </Form.Item>
            <Form.Item label="Reemplazar con" style={{ marginBottom: '8px' }}>
              <Input
                value={renameSettings.replaceText.replace}
                onChange={(e) => updateReplaceTextSettings({ replace: e.target.value })}
                placeholder="Texto de reemplazo"
                disabled={disabled}
              />
            </Form.Item>
          </Space>
        );
      
      default:
        return null;
    }
  };

  return (
    <Card
      title={
        <span>
          <EditOutlined style={{ marginRight: '8px', color: brandSettings.colors.primary }} />
          Renombrar
        </span>
      }
      bordered
      style={{ borderRadius: brandSettings.theme.borderRadius, marginBottom: '16px' }}
    >
      <Form layout="vertical" disabled={disabled}>
        <Form.Item label="Limpiar nombres">
          <Switch
            checked={renameSettings.cleanText}
            onChange={toggleCleanText}
            disabled={disabled}
            style={{ backgroundColor: renameSettings.cleanText ? brandSettings.colors.primary : undefined }}
          />
          <Text type="secondary" style={{ marginLeft: '8px', fontSize: '12px' }}>
            Elimina caracteres especiales
          </Text>
        </Form.Item>

        <Form.Item label="Modo de renombrado">
          <Radio.Group
            value={renameSettings.mode}
            onChange={(e) => changeRenameMode(e.target.value)}
            disabled={disabled}
          >
            <Radio value="sequential">Secuencial</Radio>
            <Radio value="addText">Añadir texto</Radio>
            <Radio value="replaceText">Reemplazar texto</Radio>
          </Radio.Group>
        </Form.Item>

        <Divider style={{ margin: '12px 0' }} />

        {renderModeSettings()}
      </Form>
    </Card>
  );
};

export default RenamePanel;