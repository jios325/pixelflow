'use client';

import dynamic from 'next/dynamic';
import { BrandProvider } from '../../src/context/BrandContext';

const App = dynamic(() => import('../../src/App.jsx'), { ssr: false });

export default function Client() {
  return (
    <BrandProvider>
      <App />
    </BrandProvider>
  );
}
