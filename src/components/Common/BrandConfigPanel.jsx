import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Upload, Button, Row, Col, Space, Divider, Typography, message } from 'antd';
import { UploadOutlined, SettingOutlined, SaveOutlined, UndoOutlined } from '@ant-design/icons';
import brandConfig from '../../config/brandConfig';
import ColorPicker from './ColorPicker';
import BrandLogo from './BrandLogo';

const { Text, Title } = Typography;

/**
 * Panel de configuración de marca y colores
 * @param {Object} props - Propiedades del componente
 * @param {Function} props.onSave - Función llamada al guardar la configuración
 * @param {Function} props.onClose - Función llamada al cerrar el panel
 */
const BrandConfigPanel = ({ onSave, onClose }) => {
  // Estado para la configuración actual
  const [config, setConfig] = useState({ ...brandConfig });
  // Estado para la vista previa del logo
  const [logoPreview, setLogoPreview] = useState(brandConfig.logoUrl);

  // Manejar cambios en los colores
  const handleColorChange = (colorKey, value) => {
    setConfig(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        [colorKey]: value
      }
    }));
  };

  // Manejar cambio en el nombre de la app
  const handleAppNameChange = (e) => {
    setConfig(prev => ({
      ...prev,
      appName: e.target.value
    }));
  };

  // Manejar carga de logo
  const handleLogoUpload = (file) => {
    // Validar que sea una imagen
    if (!file.type.startsWith('image/')) {
      message.error('Solo se permiten archivos de imagen');
      return Upload.LIST_IGNORE;
    }

    // Leer el archivo y generar una URL de objeto para previsualización
    const reader = new FileReader();
    reader.onload = () => {
      setLogoPreview(reader.result);
      setConfig(prev => ({
        ...prev,
        logoUrl: reader.result
      }));
    };
    reader.readAsDataURL(file);

    // Evitar carga automática
    return false;
  };

  // Manejar guardado de configuración
  const handleSave = () => {
    // En una aplicación real, aquí guardaríamos la configuración en localStorage o backend
    message.success('Configuración de marca guardada');
    
    // Llamar a la función onSave si está definida
    if (onSave) {
      onSave(config);
    }
  };

  // Restablecer configuración a valores predeterminados
  const handleReset = () => {
    setConfig({ ...brandConfig });
    setLogoPreview(brandConfig.logoUrl);
    message.info('Configuración restablecida a valores predeterminados');
  };

  return (
    <Card
      title={
        <span>
          <SettingOutlined style={{ marginRight: '8px', color: config.colors.primary }} />
          Configuración de marca
        </span>
      }
      bordered
      style={{ borderRadius: config.theme.borderRadius, marginBottom: '16px' }}
    >
      <Form layout="vertical">
        <Title level={5}>Vista previa</Title>
        <div 
          style={{ 
            padding: '16px', 
            border: '1px solid #eee', 
            borderRadius: config.theme.borderRadius, 
            marginBottom: '16px',
            backgroundColor: config.colors.headerBackground
          }}
        >
          <BrandLogo />
        </div>

        <Divider />

        <Title level={5}>Logo y nombre</Title>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Form.Item label="Nombre de la aplicación">
              <Input 
                value={config.appName} 
                onChange={handleAppNameChange}
                placeholder="Nombre de la empresa o app"
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item label="Logo de la empresa">
              <Upload
                name="logo"
                listType="picture"
                showUploadList={false}
                beforeUpload={handleLogoUpload}
                accept="image/*"
              >
                <Button icon={<UploadOutlined />} style={{ width: '100%' }}>
                  {logoPreview ? 'Cambiar logo' : 'Subir logo'}
                </Button>
              </Upload>
              {logoPreview && (
                <div style={{ marginTop: '8px', textAlign: 'center' }}>
                  <img 
                    src={logoPreview} 
                    alt="Logo preview" 
                    style={{ 
                      maxWidth: '100%', 
                      maxHeight: '80px', 
                      objectFit: 'contain' 
                    }} 
                  />
                </div>
              )}
            </Form.Item>
          </Col>
        </Row>

        <Divider />

        <Title level={5}>Paleta de colores</Title>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={8}>
            <Form.Item label="Color primario">
              <ColorPicker 
                value={config.colors.primary}
                onChange={(value) => handleColorChange('primary', value)}
                label="Primario"
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={8}>
            <Form.Item label="Color secundario">
              <ColorPicker 
                value={config.colors.secondary}
                onChange={(value) => handleColorChange('secondary', value)}
                label="Secundario"
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={8}>
            <Form.Item label="Fondo">
              <ColorPicker 
                value={config.colors.background}
                onChange={(value) => handleColorChange('background', value)}
                label="Fondo"
              />
            </Form.Item>
          </Col>
        </Row>

        <Divider />

        <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
          <Button 
            icon={<UndoOutlined />} 
            onClick={handleReset}
          >
            Restablecer
          </Button>
          <Button 
            type="primary" 
            icon={<SaveOutlined />} 
            onClick={handleSave}
            style={{ backgroundColor: config.colors.primary, borderColor: config.colors.primary }}
          >
            Guardar configuración
          </Button>
        </Space>
      </Form>
    </Card>
  );
};

export default BrandConfigPanel;
