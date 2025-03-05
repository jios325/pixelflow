import React from 'react';
import { Card, Form, Switch, Select, Space, Divider, Typography } from 'antd';
import { ToolOutlined } from '@ant-design/icons';
import { useBrand } from '../../context/BrandContext';
import ResizeTool from './ResizeTool';
import CropTool from './CropTool';

const { Option } = Select;
const { Text } = Typography;

/**
 * Componente que muestra el panel de herramientas de procesamiento
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.processingSettings - Configuración de procesamiento
 * @param {Function} props.toggleOptimize - Función para activar/desactivar optimización
 * @param {Function} props.changeFormat - Función para cambiar formato
 * @param {Function} props.updateResizeSettings - Función para actualizar configuración de redimensionamiento
 * @param {Function} props.updateCropSettings - Función para actualizar configuración de recorte
 * @param {boolean} props.disabled - Estado de deshabilitado
 */
const ToolsPanel = ({
  processingSettings,
  toggleOptimize,
  changeFormat,
  updateResizeSettings,
  updateCropSettings,
  disabled = false
}) => {
  // Acceder al contexto de marca
  const { brandSettings } = useBrand();

  // Función para actualizar la configuración de recorte
  const handleUpdateCropSettings = (settings) => {
    updateCropSettings(settings);
  };

  return (
    <Card
      title={
        <span>
          <ToolOutlined style={{ marginRight: '8px', color: brandSettings.colors.primary }} />
          Herramientas
        </span>
      }
      bordered
      style={{ borderRadius: brandSettings.theme.borderRadius, marginBottom: '16px' }}
    >
      <Form layout="vertical" disabled={disabled}>
        <div style={{ marginBottom: '12px', background: '#f0f0f0', padding: '8px', borderRadius: '4px' }}>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            <strong>Orden de aplicación:</strong> Las herramientas se aplican en el siguiente orden: 1) Optimización, 2) Redimensionamiento, 3) Recorte, 4) Formato
          </Text>
        </div>
        <Form.Item label="Optimizar imágenes">
          <Switch
            checked={processingSettings.optimize}
            onChange={toggleOptimize}
            disabled={disabled}
            style={{ backgroundColor: processingSettings.optimize ? brandSettings.colors.primary : undefined }}
          />
          <Text type="secondary" style={{ marginLeft: '8px', fontSize: '12px' }}>
            Reduce el tamaño de archivo
          </Text>
        </Form.Item>

        <Form.Item label="Formato de salida">
          <Select
            value={processingSettings.format}
            onChange={changeFormat}
            style={{ width: '100%' }}
            disabled={disabled}
          >
            <Option value="original">Original</Option>
            <Option value="jpg">JPG</Option>
            <Option value="png">PNG</Option>
            <Option value="webp">WEBP</Option>
          </Select>
        </Form.Item>

        <Divider style={{ margin: '12px 0' }} />

        <ResizeTool
          resizeSettings={processingSettings.resize}
          updateResizeSettings={updateResizeSettings}
          disabled={disabled}
        />

        <Divider style={{ margin: '12px 0' }} />

        <CropTool
          cropSettings={processingSettings.crop}
          updateCropSettings={handleUpdateCropSettings}
          disabled={disabled}
        />
      </Form>
    </Card>
  );
};

export default ToolsPanel;