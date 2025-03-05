import React from 'react';
import { Typography } from 'antd';
import { PictureOutlined } from '@ant-design/icons';
import brandConfig from '../../config/brandConfig';

const { Title } = Typography;

/**
 * Componente que muestra el logo de la marca o el nombre de la app
 * Se adapta automáticamente según la configuración en brandConfig.js
 */
const BrandLogo = ({ size = 'default' }) => {
  // Determinar el tamaño del texto según el parámetro size
  const getTitleLevel = () => {
    switch (size) {
      case 'small':
        return 5;
      case 'large':
        return 2;
      default:
        return 3;
    }
  };

  // Determinar el tamaño del icono según el parámetro size
  const getIconSize = () => {
    switch (size) {
      case 'small':
        return 16;
      case 'large':
        return 36;
      default:
        return 24;
    }
  };
  
  // Si hay una URL de logo definida en la configuración
  if (brandConfig.logoUrl) {
    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img 
          src={brandConfig.logoUrl} 
          alt={brandConfig.appName} 
          style={{ 
            width: size === 'small' ? brandConfig.logoWidth / 1.5 : brandConfig.logoWidth,
            height: size === 'small' ? brandConfig.logoHeight / 1.5 : brandConfig.logoHeight,
            marginRight: '12px',
            objectFit: 'contain'
          }} 
        />
        <Title 
          level={getTitleLevel()} 
          style={{ 
            margin: 0, 
            color: brandConfig.colors.primary 
          }}
        >
          {brandConfig.appName}
        </Title>
      </div>
    );
  }
  
  // Si no hay logo, mostrar el icono predeterminado y el nombre de la app
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <PictureOutlined 
        style={{ 
          fontSize: getIconSize(), 
          color: brandConfig.colors.primary, 
          marginRight: '12px' 
        }} 
      />
      <Title 
        level={getTitleLevel()} 
        style={{ 
          margin: 0, 
          color: brandConfig.colors.primary 
        }}
      >
        {brandConfig.appName}
      </Title>
    </div>
  );
};

export default BrandLogo;
