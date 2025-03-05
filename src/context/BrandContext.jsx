import React, { createContext, useState, useContext, useEffect } from 'react';
import brandConfig from '../config/brandConfig';

// Crear contexto para la configuración de marca
const BrandContext = createContext();

/**
 * Proveedor de contexto de marca
 * Proporciona la configuración de marca a todos los componentes hijos
 */
export const BrandProvider = ({ children }) => {
  // Estado para la configuración de marca
  const [brandSettings, setBrandSettings] = useState(brandConfig);
  
  // Función para actualizar la configuración
  const updateBrandSettings = (newSettings) => {
    setBrandSettings(newSettings);
    
    // En una implementación real, aquí guardaríamos los ajustes en localStorage
    try {
      localStorage.setItem('pixelflow_brand_settings', JSON.stringify(newSettings));
    } catch (error) {
      console.error('Error al guardar configuración de marca:', error);
    }
  };
  
  // Cargar configuración guardada al iniciar
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('pixelflow_brand_settings');
      if (savedSettings) {
        setBrandSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error('Error al cargar configuración de marca:', error);
    }
  }, []);
  
  return (
    <BrandContext.Provider value={{ brandSettings, updateBrandSettings }}>
      {children}
    </BrandContext.Provider>
  );
};

// Hook personalizado para usar el contexto de marca
export const useBrand = () => {
  const context = useContext(BrandContext);
  if (!context) {
    throw new Error('useBrand debe usarse dentro de un BrandProvider');
  }
  return context;
};

export default BrandContext;
