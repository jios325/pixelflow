/* eslint-disable no-magic-numbers */
/**
 * Constantes de configuracion para PixelFlow
 * Valores magicos extraidos de la base de codigo y agrupados por funcionalidad
 */

// ---------------------------------------------------------------------------
// Procesamiento por lotes (batch processing)
// ---------------------------------------------------------------------------

/** Numero de imagenes a cargar simultaneamente en cada lote de upload */
export const UPLOAD_BATCH_SIZE = 3;

/** Numero de imagenes a procesar simultaneamente en cada lote de procesamiento */
export const PROCESSING_BATCH_SIZE = 3;

/** Numero de imagenes a preparar simultaneamente en cada lote de descarga */
export const DOWNLOAD_BATCH_SIZE = 5;

/** Cantidad minima de archivos para mostrar indicador de progreso durante upload */
export const UPLOAD_PROGRESS_THRESHOLD = 5;

// ---------------------------------------------------------------------------
// Umbrales de tamano de archivo y memoria
// ---------------------------------------------------------------------------

/** Tamano en bytes por encima del cual una imagen se considera "grande" (10 MB) */
export const LARGE_IMAGE_THRESHOLD = 10 * 1024 * 1024;

/** Uso estimado de memoria en bytes que dispara una advertencia (500 MB) */
export const MEMORY_WARNING_THRESHOLD = 500 * 1024 * 1024;

/** Bytes por pixel en una imagen RGBA sin comprimir */
export const BYTES_PER_PIXEL_RGBA = 4;

/** Factor de compresion estimado para calcular uso de memoria a partir del tamano del archivo */
export const ESTIMATED_COMPRESSION_RATIO = 10;

// ---------------------------------------------------------------------------
// Optimizacion de imagenes
// ---------------------------------------------------------------------------

/** Tamano maximo del archivo optimizado en MB */
export const OPTIMIZE_MAX_SIZE_MB = 1;

/** Dimension maxima (ancho o alto) de la imagen optimizada en pixels */
export const OPTIMIZE_MAX_DIMENSION = 1920;

// ---------------------------------------------------------------------------
// Redimensionamiento y recorte por defecto
// ---------------------------------------------------------------------------

/** Ancho por defecto para redimensionamiento en pixels */
export const DEFAULT_RESIZE_WIDTH = 800;

/** Alto por defecto para redimensionamiento en pixels */
export const DEFAULT_RESIZE_HEIGHT = 600;

/** Ancho por defecto para recorte en pixels */
export const DEFAULT_CROP_WIDTH = 1000;

/** Alto por defecto para recorte en pixels */
export const DEFAULT_CROP_HEIGHT = 1000;

// ---------------------------------------------------------------------------
// Calidades de imagen (0 - 1 o 0 - 100 segun la API)
// ---------------------------------------------------------------------------

/** Calidad de conversion de formato via canvas (0-1) */
export const FORMAT_CONVERSION_QUALITY = 0.92;

/** Calidad maxima para el redimensionador react-image-file-resizer (0-100) */
export const RESIZE_QUALITY = 100;

/** Calidad de compresion para la gestion de memoria (0-1) */
export const MEMORY_COMPRESSION_QUALITY = 0.85;

/** Calidad de la vista previa de baja resolucion (0-1) */
export const LOW_RES_PREVIEW_QUALITY = 0.5;

// ---------------------------------------------------------------------------
// Dimensiones para gestion de memoria
// ---------------------------------------------------------------------------

/** Ancho maximo al comprimir imagenes para ahorrar memoria */
export const MEMORY_MAX_WIDTH = 1920;

/** Alto maximo al comprimir imagenes para ahorrar memoria */
export const MEMORY_MAX_HEIGHT = 1080;

/** Tamano en pixels del lado mayor de la vista previa de baja resolucion */
export const PREVIEW_SIZE = 300;

/** Tamano en pixels de cada fragmento al dividir imagenes grandes */
export const IMAGE_CHUNK_SIZE = 1024;
