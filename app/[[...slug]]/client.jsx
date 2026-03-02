'use client';

import '@ant-design/v5-patch-for-react-19';
import dynamic from 'next/dynamic';
import { BrandProvider } from '@/context/BrandContext';

const App = dynamic(() => import('@/App.jsx'), { ssr: false });

export default function Client() {
  return (
    <BrandProvider>
      <App />
    </BrandProvider>
  );
}
