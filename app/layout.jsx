import '@/index.css';
import 'antd/dist/antd.min.css';

export const metadata = {
  title: 'PixelFlow',
  description: 'Herramienta de procesamiento de imágenes por lotes',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/logo192.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
