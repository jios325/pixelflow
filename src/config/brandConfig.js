/**
 * Configuración personalizable de la marca y colores
 * Edita este archivo para personalizar la apariencia de la aplicación
 */

const brandConfig = {
  // Nombre de la aplicación/empresa
  appName: "PixelFlow",
  
  // Logo: puede ser una URL a una imagen, o null para usar el nombre de la app
  // Ejemplo: "/logo.png" o "https://miempresa.com/logo.png"
  logoUrl: null,
  
  // Dimensiones del logo (en píxeles)
  logoWidth: 40,
  logoHeight: 40,
  
  // Paleta de colores
  colors: {
    // Color primario (usado en botones, switches, etc.)
    primary: "#a855f7", // Violeta por defecto
    
    // Color secundario (usado para acentos)
    secondary: "#818cf8", // Violeta claro por defecto
    
    // Color de fondo de la aplicación
    background: "#f5f5f5", // Gris claro por defecto
    
    // Color de fondo del encabezado
    headerBackground: "#ffffff", // Blanco por defecto
    
    // Color de fondo del pie de página
    footerBackground: "#ffffff", // Blanco por defecto
    
    // Color del texto principal
    textPrimary: "#000000", // Negro por defecto
    
    // Color del texto secundario
    textSecondary: "#6b7280", // Gris por defecto
  },
  
  // Ajustes del tema
  theme: {
    // Radio de borde para cards, botones, etc.
    borderRadius: 8,
    
    // Fuente principal (CSS font-family)
    fontFamily: "Segoe UI, system-ui, sans-serif",
  }
};

export default brandConfig;
