import React, { useState } from 'react';
import { Layout, Row, Col, Card, Typography, ConfigProvider, Button, Drawer } from 'antd';
import { PictureOutlined, FileImageOutlined, SettingOutlined } from '@ant-design/icons';

// Componentes
import UploadArea from './components/ImageUploader/UploadArea';
import UploadedImagesList from './components/ImageUploader/UploadedImagesList';
import ProcessedImagesList from './components/ImageProcessor/ProcessedImagesList';
import ToolsPanel from './components/Tools/ToolsPanel';
import RenamePanel from './components/RenameTools/RenamePanel';
import DownloadButton from './components/DownloadButton';
import BrandConfigPanel from './components/Common/BrandConfigPanel';
import BrandLogo from './components/Common/BrandLogo';

// Hooks
import useImageUpload from './hooks/useImageUpload';
import useImageProcessor from './hooks/useImageProcessor';
import useImageRename from './hooks/useImageRename';
import { useBrand } from './context/BrandContext';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

function App() {
  // Estado para el panel de configuración de marca
  const [configVisible, setConfigVisible] = useState(false);
  
  // Acceder al contexto de marca
  const { brandSettings, updateBrandSettings } = useBrand();
  
  // Estado de carga de imágenes
  const { 
    uploadedImages, 
    loading: uploadLoading, 
    handleUpload, 
    removeImage, 
    clearImages 
  } = useImageUpload();

  // Estado de procesamiento de imágenes
  const {
    processedImages,
    processingSettings,
    processing,
    processImages, // Añadir la función para procesar imágenes bajo demanda
    toggleOptimize,
    changeFormat,
    updateResizeSettings,
    updateCropSettings
  } = useImageProcessor(uploadedImages);

  // Estado de renombrado de imágenes
  const {
    renamedImages,
    renameSettings,
    toggleCleanText,
    changeRenameMode,
    updateSequentialSettings,
    updateAddTextSettings,
    updateReplaceTextSettings
  } = useImageRename(processedImages);

  // Determinar si hay imágenes para mostrar
  const hasImages = uploadedImages.length > 0;
  const loading = uploadLoading || processing;
  
  // Manejar guardado de configuración de marca
  const handleSaveBrandConfig = (newConfig) => {
    updateBrandSettings(newConfig);
    setConfigVisible(false);
  };

  return (
    <ConfigProvider
      theme={{
        primaryColor: brandSettings.colors.primary,
      }}
    >
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ 
        background: brandSettings.colors.headerBackground, 
        padding: '0 20px', 
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        display: 'flex',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <BrandLogo />
        </div>
        
        <Button 
          type="text" 
          icon={<SettingOutlined />}
          onClick={() => setConfigVisible(true)}
          style={{ color: brandSettings.colors.primary }}
        >
          Configurar
        </Button>
      </Header>
      
      <Content style={{ padding: '24px', background: brandSettings.colors.background }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={hasImages ? 6 : 24}>
            {!hasImages ? (
              <Card style={{ borderRadius: '8px', marginBottom: '16px' }}>
                <UploadArea onUpload={handleUpload} loading={loading} />
              </Card>
            ) : (
              <Card 
                title={
                  <span>
                    <FileImageOutlined style={{ marginRight: '8px', color: brandSettings.colors.primary }} />
                    Imágenes subidas
                  </span>
                }
                bordered
                style={{ borderRadius: '8px', marginBottom: '16px' }}
              >
                <UploadedImagesList images={uploadedImages} onRemove={removeImage} />
              </Card>
            )}
            
            {hasImages && (
              <>
                <ToolsPanel 
                  processingSettings={processingSettings}
                  toggleOptimize={toggleOptimize}
                  changeFormat={changeFormat}
                  updateResizeSettings={updateResizeSettings}
                  updateCropSettings={updateCropSettings}
                  disabled={loading}
                />
                
                <RenamePanel 
                  renameSettings={renameSettings}
                  toggleCleanText={toggleCleanText}
                  changeRenameMode={changeRenameMode}
                  updateSequentialSettings={updateSequentialSettings}
                  updateAddTextSettings={updateAddTextSettings}
                  updateReplaceTextSettings={updateReplaceTextSettings}
                  disabled={loading}
                />
              </>
            )}
          </Col>
          
          {hasImages && (
            <Col xs={24} lg={18}>
              <Card 
                title={
                  <span>
                    <FileImageOutlined style={{ marginRight: '8px', color: brandSettings.colors.primary }} />
                    Imágenes Listas
                  </span>
                }
                extra={
                  <>
                    <Button 
                      type="primary" 
                      onClick={processImages} 
                      loading={processing} 
                      style={{ marginRight: '8px' }}
                    >
                      Optimizar
                    </Button>
                    <DownloadButton images={renamedImages} loading={loading} />
                  </>
                }
                bordered
                style={{ borderRadius: '8px' }}
              >
                <ProcessedImagesList images={renamedImages} loading={loading} />
              </Card>
            </Col>
          )}
        </Row>
      </Content>
      
      <Footer style={{ textAlign: 'center', background: brandSettings.colors.footerBackground }}>
        {brandSettings.appName} © {new Date().getFullYear()} - Herramienta de Procesamiento de Imágenes
      </Footer>
    </Layout>
    
    {/* Panel de configuración de marca */}
    <Drawer
      title="Personaliza tu marca"
      placement="right"
      width={400}
      onClose={() => setConfigVisible(false)}
      open={configVisible}
      destroyOnClose={false}
    >
      <BrandConfigPanel 
        onSave={handleSaveBrandConfig} 
        onClose={() => setConfigVisible(false)} 
      />
    </Drawer>
    
    </ConfigProvider>
  );
}

export default App;