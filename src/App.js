import React from 'react';
import { Button, Typography } from 'antd';

function App() {
  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <Typography.Title level={2} style={{ color: '#a855f7' }}>
        PixelFlow - Procesador de Imágenes
      </Typography.Title>
      <p>Aplicación para procesar imágenes en lote</p>
      <Button type="primary" style={{ backgroundColor: '#a855f7', borderColor: '#a855f7' }}>
        Comenzar
      </Button>
    </div>
  );
}

export default App; 