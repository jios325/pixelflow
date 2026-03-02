'use client';

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
